import "server-only";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { shouldUseRedis } from "@/lib/redis-guard";

const CAPTCHA_SECRET =
  process.env.CONTACT_FORM_SECRET ?? "dev-only-insecure-secret";
const CAPTCHA_TTL_MS = 10 * 60 * 1000;
const CAPTCHA_MIN_MS = 1500;
const BAN_TTL_SECONDS = 60 * 60 * 24 * 30;
const MAX_SUBMISSIONS_PER_DAY = 5;

// Phrases from the "we noticed your website" SEO spam and similar bulk
// outreach. None of this is relevant to a portfolio contact form.
const BANNED_KEYWORDS = [
  "seo",
  "search engine optimization",
  "search engine ranking",
  "backlink",
  "page rank",
  "google ranking",
  "bing ranking",
  "website audit",
  "rank higher",
  "digital marketing",
  "increase your traffic",
  "improve your visibility",
  "struggling to appear on search engines",
  "top search results",
  "keyword ranking",
  "web design services",
  "guest post",
];

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(CAPTCHA_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256(value: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface Captcha {
  question: string;
  token: string;
}

/** Stateless math captcha: the answer is signed into the token, so no server-side storage is needed. */
export async function createCaptcha(): Promise<Captcha> {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  const answer = a + b;
  const issuedAt = Date.now();
  const payload = `${a}+${b}=${answer}|${issuedAt}`;
  const sig = await hmac(payload);
  const token = Buffer.from(`${payload}|${sig}`).toString("base64url");
  return { question: `${a} + ${b}`, token };
}

export async function verifyCaptcha(
  token: string,
  answer: string
): Promise<boolean> {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split("|");
    if (parts.length !== 3) {
      return false;
    }
    const [expr, issuedAtRaw, sig] = parts;
    const expected = await hmac(`${expr}|${issuedAtRaw}`);
    if (expected !== sig) {
      return false;
    }
    const issuedAt = Number(issuedAtRaw);
    const age = Date.now() - issuedAt;
    // Too fast: a bot filling the form instantly. Too slow: a stale/reused token.
    if (
      !Number.isFinite(issuedAt) ||
      age < CAPTCHA_MIN_MS ||
      age > CAPTCHA_TTL_MS
    ) {
      return false;
    }
    const expectedAnswer = expr.split("=")[1];
    return expectedAnswer === answer.trim();
  } catch {
    return false;
  }
}

export async function getClientIpHash(): Promise<string | null> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("cf-connecting-ip");
  if (!ip) {
    return null;
  }
  return sha256(ip);
}

export async function isBanned(ipHash: string): Promise<boolean> {
  if (!shouldUseRedis()) {
    return false;
  }
  const redis = Redis.fromEnv();
  return Boolean(await redis.get(`spam:ban:${ipHash}`));
}

export async function recordSpamHit(ipHash: string): Promise<void> {
  if (!shouldUseRedis()) {
    return;
  }
  const redis = Redis.fromEnv();
  await redis.set(`spam:ban:${ipHash}`, true, { ex: BAN_TTL_SECONDS });
}

/** Returns true (and bans the IP) once the daily submission cap is exceeded. */
export async function recordSubmissionAndCheckLimit(
  ipHash: string
): Promise<boolean> {
  if (!shouldUseRedis()) {
    return false;
  }
  const redis = Redis.fromEnv();
  const day = new Date().toISOString().slice(0, 10);
  const key = `spam:count:${ipHash}:${day}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 60 * 60 * 24);
  }
  if (count > MAX_SUBMISSIONS_PER_DAY) {
    await recordSpamHit(ipHash);
    return true;
  }
  return false;
}

export function containsBannedKeyword(
  ...values: (string | undefined)[]
): boolean {
  const haystack = values.filter(Boolean).join(" ").toLowerCase();
  return BANNED_KEYWORDS.some((kw) => haystack.includes(kw));
}

const WHITESPACE_RE = /\s/;
const LETTER_RE = /[a-zA-Z]/g;
const VOWEL_RE = /[aeiouAEIOU]/g;
const LOWERCASE_RE = /[a-z]/;
const UPPERCASE_RE = /[A-Z]/;

/**
 * Bot form-fillers often drop random alphanumeric strings (no spaces, mixed
 * case, few vowels) into free-text fields instead of real sentences.
 */
export function looksLikeGibberish(value: string | undefined): boolean {
  if (!value) {
    return false;
  }
  const trimmed = value.trim();
  if (trimmed.length < 8 || WHITESPACE_RE.test(trimmed)) {
    return false;
  }
  const letters = trimmed.match(LETTER_RE) ?? [];
  if (letters.length < 8) {
    return false;
  }
  const vowels = trimmed.match(VOWEL_RE) ?? [];
  const vowelRatio = vowels.length / letters.length;
  const hasMixedCase = LOWERCASE_RE.test(trimmed) && UPPERCASE_RE.test(trimmed);
  return vowelRatio < 0.2 && hasMixedCase;
}
