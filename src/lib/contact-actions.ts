"use server";

import { Resend } from "resend";
import { z } from "zod";
import {
  containsBannedKeyword,
  getClientIpHash,
  isBanned,
  looksLikeGibberish,
  recordSpamHit,
  recordSubmissionAndCheckLimit,
  verifyCaptcha,
} from "@/lib/spam-guard";

const FROM_ADDRESS = process.env.RESEND_FROM ?? "onboarding@resend.dev";
const TO_ADDRESS = process.env.CONTACT_EMAIL ?? "";

const automationSchema = z.object({
  kind: z.literal("automation"),
  category: z.string().min(1),
  categoryOther: z.string().optional(),
  mode: z.string().min(1),
  modeOther: z.string().optional(),
  platform: z.string().min(1),
  platformOther: z.string().optional(),
  freeText: z.string().optional(),
  email: z.string().email(),
  name: z.string().optional(),
  company: z.string().optional(),
  estimateLabel: z.string().min(1),
});

const aiChatSchema = z.object({
  kind: z.literal("ai-chat"),
  description: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
});

const inputSchema = z.discriminatedUnion("kind", [
  automationSchema,
  aiChatSchema,
]);

export type ContactInput = z.infer<typeof inputSchema>;

export interface ContactSecurity {
  captchaAnswer: string;
  captchaToken: string;
  /** Hidden field. Real visitors never fill it in; bots usually do. */
  honeypot?: string;
}

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; captchaError?: boolean };

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const row = (label: string, value: string | undefined): string => {
  if (!value || value.trim() === "") {
    return "";
  }
  return `<tr><td style="padding:6px 12px 6px 0;color:#71717a;vertical-align:top;font-size:13px;">${escapeHtml(label)}</td><td style="padding:6px 0;color:#18181b;font-size:14px;">${escapeHtml(value).replaceAll("\n", "<br>")}</td></tr>`;
};

const renderAutomation = (
  data: z.infer<typeof automationSchema>
): { subject: string; html: string } => {
  const category =
    data.category === "Other" && data.categoryOther
      ? `Other: ${data.categoryOther}`
      : data.category;
  const mode =
    data.mode === "Other" && data.modeOther
      ? `Other: ${data.modeOther}`
      : data.mode;
  const platform =
    data.platform === "Other" && data.platformOther
      ? `Other: ${data.platformOther}`
      : data.platform;

  const subject = `New automation request: ${category} (${platform})`;

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fafafa;padding:24px;color:#18181b;">
  <h2 style="margin:0 0 16px;font-size:18px;">New automation request</h2>
  <table style="width:100%;border-collapse:collapse;background:#ffffff;border:1px solid #e4e4e7;border-radius:8px;padding:12px 16px;">
    <tbody>
      ${row("Category", category)}
      ${row("Mode", mode)}
      ${row("Platform", platform)}
      ${row("Estimate", data.estimateLabel)}
      ${row("Details", data.freeText)}
      ${row("Email", data.email)}
      ${row("Name", data.name)}
      ${row("Company", data.company)}
    </tbody>
  </table>
</div>`;

  return { subject, html };
};

const renderAiChat = (
  data: z.infer<typeof aiChatSchema>
): { subject: string; html: string } => {
  const subject = "New AI Chat project enquiry";
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fafafa;padding:24px;color:#18181b;">
  <h2 style="margin:0 0 16px;font-size:18px;">New AI Chat enquiry</h2>
  <table style="width:100%;border-collapse:collapse;background:#ffffff;border:1px solid #e4e4e7;border-radius:8px;padding:12px 16px;">
    <tbody>
      ${row("Project description", data.description)}
      ${row("Email", data.email)}
      ${row("Company", data.company)}
    </tbody>
  </table>
</div>`;
  return { subject, html };
};

const looksLikeSpam = (data: z.infer<typeof inputSchema>): boolean =>
  containsBannedKeyword(
    data.email,
    data.company,
    data.kind === "ai-chat" ? data.description : data.freeText,
    data.kind === "automation" ? data.name : undefined
  ) ||
  looksLikeGibberish(data.company) ||
  looksLikeGibberish(
    data.kind === "ai-chat" ? data.description : data.freeText
  ) ||
  looksLikeGibberish(data.kind === "automation" ? data.name : undefined);

/** Returns a fake-success result once a spam signal fires, banning the IP behind it. */
async function checkSpamGuards(
  data: z.infer<typeof inputSchema>,
  security: ContactSecurity,
  ipHash: string | null
): Promise<ContactResult | null> {
  if (ipHash && (await isBanned(ipHash))) {
    return { ok: true };
  }

  if (security.honeypot && security.honeypot.trim() !== "") {
    if (ipHash) {
      await recordSpamHit(ipHash);
    }
    return { ok: true };
  }

  if (looksLikeSpam(data)) {
    if (ipHash) {
      await recordSpamHit(ipHash);
    }
    return { ok: true };
  }

  if (ipHash && (await recordSubmissionAndCheckLimit(ipHash))) {
    return { ok: true };
  }

  return null;
}

export async function submitContact(
  input: ContactInput,
  security: ContactSecurity
): Promise<ContactResult> {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid form data" };
  }

  const ipHash = await getClientIpHash();

  const spamResult = await checkSpamGuards(parsed.data, security, ipHash);
  if (spamResult) {
    return spamResult;
  }

  const captchaOk = await verifyCaptcha(
    security.captchaToken,
    security.captchaAnswer
  );
  if (!captchaOk) {
    return {
      ok: false,
      error: "That answer isn't quite right, please try again.",
      captchaError: true,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!(apiKey && TO_ADDRESS)) {
    return {
      ok: false,
      error: "Email is not configured on the server",
    };
  }

  const { subject, html } =
    parsed.data.kind === "automation"
      ? renderAutomation(parsed.data)
      : renderAiChat(parsed.data);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: parsed.data.email,
      subject,
      html,
    });

    if (error) {
      return { ok: false, error: error.message ?? "Failed to send email" };
    }

    return { ok: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected error sending email";
    return { ok: false, error: message };
  }
}
