"use client";

import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { submitContact } from "@/lib/contact-actions";
import { getContactCaptcha } from "@/lib/spam-actions";

interface State {
  company: string;
  description: string;
  email: string;
  honeypot: string;
}

const initial: State = {
  description: "",
  email: "",
  company: "",
  honeypot: "",
};

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_REGEX = /^.+@.+\..+$/;

export const ContactForm: React.FC = () => {
  const [state, setState] = useState<State>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [captcha, setCaptcha] = useState<{
    question: string;
    token: string;
  } | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  useEffect(() => {
    getContactCaptcha().then(setCaptcha);
  }, []);

  const canSubmit =
    state.description.trim() !== "" &&
    state.email.trim() !== "" &&
    EMAIL_REGEX.test(state.email) &&
    captchaAnswer.trim() !== "" &&
    captcha !== null;

  const submit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!(canSubmit && captcha)) {
      return;
    }
    setStatus("submitting");
    setErrorMessage("");
    const result = await submitContact(
      {
        kind: "ai-chat",
        description: state.description,
        email: state.email,
        company: state.company || undefined,
      },
      {
        honeypot: state.honeypot,
        captchaToken: captcha.token,
        captchaAnswer,
      }
    );
    if (result.ok) {
      setStatus("success");
      setState(initial);
      setCaptchaAnswer("");
    } else {
      setStatus("error");
      setErrorMessage(result.error);
      if (result.captchaError) {
        setCaptchaAnswer("");
        getContactCaptcha().then(setCaptcha);
      }
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900/40 p-8 text-center md:p-10">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="font-display font-medium text-2xl text-zinc-100">
          Sent.
        </h3>
        <p className="mt-2 text-zinc-400">
          Thanks. I'll get back to you within 24 hours.
        </p>
        <button
          className="mt-6 text-sm text-zinc-400 underline hover:text-zinc-200"
          onClick={() => setStatus("idle")}
          type="button"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      className="rounded-2xl border border-zinc-700 bg-zinc-900/40 p-6 md:p-10"
      onSubmit={submit}
    >
      <div className="grid gap-5">
        <label className="block">
          <span className="mb-1 block text-xs text-zinc-400 uppercase tracking-wide">
            Project description
          </span>
          <textarea
            className="h-36 w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none"
            onChange={(e) =>
              setState((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="What kind of data should the AI answer questions about?"
            required
            value={state.description}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-zinc-400 uppercase tracking-wide">
            Email
          </span>
          <input
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none"
            onChange={(e) =>
              setState((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            type="email"
            value={state.email}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-zinc-400 uppercase tracking-wide">
            Company (optional)
          </span>
          <input
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none"
            onChange={(e) =>
              setState((prev) => ({ ...prev, company: e.target.value }))
            }
            type="text"
            value={state.company}
          />
        </label>
        {/* Honeypot: hidden from real visitors, bots tend to fill every field. */}
        <label
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
        >
          Leave this field empty
          <input
            autoComplete="off"
            name="website"
            onChange={(e) =>
              setState((prev) => ({ ...prev, honeypot: e.target.value }))
            }
            tabIndex={-1}
            type="text"
            value={state.honeypot}
          />
        </label>
        {captcha && (
          <label className="block">
            <span className="mb-1 block text-xs text-zinc-400 uppercase tracking-wide">
              Quick check: {captcha.question} = ?
            </span>
            <input
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none"
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              required
              value={captchaAnswer}
            />
          </label>
        )}
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-200 text-sm">
          {errorMessage || "Something went wrong. Please try again."}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-100 px-5 py-2.5 font-medium text-sm text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!canSubmit || status === "submitting"}
          type="submit"
        >
          {status === "submitting" && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          Send my project
        </button>
      </div>
    </form>
  );
};
