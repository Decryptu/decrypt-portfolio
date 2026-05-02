"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { type ContactInput, submitContact } from "@/lib/contact-actions";

interface Option {
  readonly description?: string;
  readonly value: string;
}

interface Step {
  readonly id: string;
  readonly options: readonly Option[];
  readonly subtitle?: string;
  readonly title: string;
}

const STEPS: readonly Step[] = [
  {
    id: "category",
    title: "What kind of bot?",
    subtitle: "Pick the closest category. We'll refine later.",
    options: [
      { value: "Design", description: "Thumbnails, social cards, image ops." },
      { value: "Writing", description: "Drafts, summaries, editorial assist." },
      {
        value: "Community Management",
        description: "Moderation, replies, onboarding.",
      },
      {
        value: "Data & News",
        description: "Pipelines, scrapers, alerts, briefings.",
      },
      {
        value: "Research",
        description: "Long-form digging, citations, sourcing.",
      },
      { value: "Other" },
    ],
  },
  {
    id: "mode",
    title: "How autonomous?",
    options: [
      {
        value: "Fully Autonomous",
        description: "Publishes or acts on its own based on rules or triggers.",
      },
      {
        value: "Guided",
        description: "A human triggers each action; the bot does the work.",
      },
      { value: "Other" },
    ],
  },
  {
    id: "platform",
    title: "Where does it live?",
    options: [
      { value: "Discord", description: "Most teams already work here." },
      { value: "Telegram" },
      { value: "Slack" },
      {
        value: "Autonomous",
        description: "Server-side cron, no chat interface.",
      },
      {
        value: "Web Dashboard",
        description: "Custom UI for non-technical users.",
      },
      { value: "Other" },
    ],
  },
] as const;

interface Answer {
  other?: string;
  value: string;
}

interface ContactInfo {
  company: string;
  email: string;
  name: string;
}

interface State {
  answers: Record<string, Answer>;
  contact: ContactInfo;
  freeText: string;
  step: number;
}

const initial: State = {
  step: 0,
  answers: {},
  freeText: "",
  contact: { email: "", name: "", company: "" },
};

const isComplexCategory = (cat: string): boolean =>
  cat === "Writing" || cat === "Data & News" || cat === "Research";

const estimateFor = (
  answers: Record<string, Answer>
): { label: string; setup: string; running: string } => {
  const category = answers.category?.value ?? "";
  const mode = answers.mode?.value ?? "";

  if (category === "Other") {
    return {
      label: "Custom quote",
      setup: "Custom quote",
      running: "Discussed once we scope the project.",
    };
  }

  if (mode === "Fully Autonomous" || isComplexCategory(category)) {
    return {
      label: "Complex bot. €3,000–6,000 setup + €50–300/mo",
      setup: "€3,000–6,000",
      running: "€50–300/mo",
    };
  }

  return {
    label: "Simple bot. €1,500–3,000 setup + €20–100/mo",
    setup: "€1,500–3,000",
    running: "€20–100/mo",
  };
};

const recapSentence = (answers: Record<string, Answer>): string => {
  const category =
    answers.category?.value === "Other"
      ? (answers.category.other ?? "custom")
      : (answers.category?.value ?? "").toLowerCase();
  const mode =
    answers.mode?.value === "Other"
      ? (answers.mode.other ?? "custom").toLowerCase()
      : (answers.mode?.value ?? "").toLowerCase();
  const platform =
    answers.platform?.value === "Other"
      ? (answers.platform.other ?? "a custom platform")
      : (answers.platform?.value ?? "");
  return `A ${mode} ${category} bot, deployed on ${platform}.`;
};

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_REGEX = /^.+@.+\..+$/;

export const DecisionTree: React.FC = () => {
  const [state, setState] = useState<State>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const totalSteps = STEPS.length + 2;
  const progress = ((state.step + 1) / totalSteps) * 100;

  const goBack = (): void => {
    setStatus("idle");
    setErrorMessage("");
    setState((prev) => ({ ...prev, step: Math.max(0, prev.step - 1) }));
  };

  const setAnswer = (id: string, value: string): void =>
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [id]: { value, other: prev.answers[id]?.other },
      },
    }));

  const setOther = (id: string, other: string): void =>
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [id]: { value: prev.answers[id]?.value ?? "Other", other },
      },
    }));

  const next = (): void =>
    setState((prev) => ({ ...prev, step: prev.step + 1 }));

  const reset = (): void => {
    setState(initial);
    setStatus("idle");
    setErrorMessage("");
  };

  const submit = async (): Promise<void> => {
    setStatus("submitting");
    setErrorMessage("");
    const estimate = estimateFor(state.answers);
    const payload: ContactInput = {
      kind: "automation",
      category: state.answers.category?.value ?? "",
      categoryOther: state.answers.category?.other,
      mode: state.answers.mode?.value ?? "",
      modeOther: state.answers.mode?.other,
      platform: state.answers.platform?.value ?? "",
      platformOther: state.answers.platform?.other,
      freeText: state.freeText || undefined,
      email: state.contact.email,
      name: state.contact.name || undefined,
      company: state.contact.company || undefined,
      estimateLabel: estimate.label,
    };

    const result = await submitContact(payload);
    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  };

  const currentStep = STEPS[state.step];
  const isOptionStep = state.step < STEPS.length;
  const isFreeTextStep = state.step === STEPS.length;
  const isContactStep = state.step === STEPS.length + 1;

  const canAdvanceOption = (() => {
    if (!isOptionStep) {
      return false;
    }
    const ans = state.answers[currentStep.id];
    if (!ans?.value) {
      return false;
    }
    if (ans.value === "Other" && !ans.other?.trim()) {
      return false;
    }
    return true;
  })();

  const canSubmit =
    state.contact.email.trim() !== "" && EMAIL_REGEX.test(state.contact.email);

  return (
    <section
      className="mx-auto max-w-4xl px-6 py-16 md:py-24 lg:px-8"
      id="decision-tree"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-bold font-display text-3xl text-zinc-100 tracking-tight sm:text-4xl">
          Design your bot
        </h2>
        <p className="mt-4 text-zinc-400">
          A few questions to scope your project. Takes about a minute.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/40 p-6 md:p-10">
        <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
          <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-zinc-400 to-zinc-200"
            initial={false}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <AnimatePresence initial={false} mode="wait">
          {renderBody({
            status,
            isOptionStep,
            isFreeTextStep,
            currentStep,
            state,
            errorMessage,
            setAnswer,
            setOther,
            setState,
            reset,
          })}
        </AnimatePresence>

        {status !== "success" && (
          <div className="mt-8 flex items-center justify-between">
            <button
              className={`flex items-center gap-2 text-sm transition-colors ${
                state.step === 0
                  ? "invisible"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              onClick={goBack}
              type="button"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {renderPrimaryButton({
              isContactStep,
              isOptionStep,
              isFreeTextStep,
              canAdvanceOption,
              canSubmit,
              status,
              submit,
              next,
            })}
          </div>
        )}
      </div>
    </section>
  );
};

interface FieldProps {
  readonly label: string;
  readonly onChange: (value: string) => void;
  readonly required?: boolean;
  readonly type?: "text" | "email";
  readonly value: string;
}

const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <label className="block">
    <span className="mb-1 block text-xs text-zinc-400 uppercase tracking-wide">
      {label}
    </span>
    <input
      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none"
      onChange={(e) => onChange(e.target.value)}
      required={required}
      type={type}
      value={value}
    />
  </label>
);

interface RecapProps {
  readonly answers: Record<string, Answer>;
}

const Recap: React.FC<RecapProps> = ({ answers }) => {
  const estimate = estimateFor(answers);
  return (
    <div className="mt-6 rounded-xl border border-zinc-700 bg-zinc-900/60 p-5">
      <p className="text-xs text-zinc-400 uppercase tracking-wide">
        Your project
      </p>
      <p className="mt-2 text-zinc-100">{recapSentence(answers)}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Setup</p>
          <p className="mt-1 font-display font-medium text-lg text-zinc-100">
            {estimate.setup}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wide">
            Running costs
          </p>
          <p className="mt-1 font-display font-medium text-lg text-zinc-100">
            {estimate.running}
          </p>
        </div>
      </div>
    </div>
  );
};

interface BodyArgs {
  currentStep: Step;
  errorMessage: string;
  isFreeTextStep: boolean;
  isOptionStep: boolean;
  reset: () => void;
  setAnswer: (id: string, value: string) => void;
  setOther: (id: string, other: string) => void;
  setState: React.Dispatch<React.SetStateAction<State>>;
  state: State;
  status: Status;
}

const renderBody = (args: BodyArgs): React.ReactElement => {
  if (args.status === "success") {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="py-8 text-center"
        exit={{ opacity: 0, y: -12 }}
        initial={{ opacity: 0, y: 12 }}
        key="success"
      >
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
          onClick={args.reset}
          type="button"
        >
          Start over
        </button>
      </motion.div>
    );
  }

  if (args.isOptionStep) {
    return (
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        initial={{ opacity: 0, x: 16 }}
        key={args.currentStep.id}
        transition={{ duration: 0.25 }}
      >
        <h3 className="font-display font-medium text-2xl text-zinc-100">
          {args.currentStep.title}
        </h3>
        {args.currentStep.subtitle && (
          <p className="mt-2 text-sm text-zinc-400">
            {args.currentStep.subtitle}
          </p>
        )}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {args.currentStep.options.map((opt) => {
            const ans = args.state.answers[args.currentStep.id];
            const isSelected = ans?.value === opt.value;
            return (
              <button
                className={`rounded-xl border p-4 text-left transition-colors ${
                  isSelected
                    ? "border-zinc-200 bg-zinc-800/60"
                    : "border-zinc-700 bg-zinc-900/30 hover:border-zinc-500"
                }`}
                key={opt.value}
                onClick={() => args.setAnswer(args.currentStep.id, opt.value)}
                type="button"
              >
                <div className="font-medium text-sm text-zinc-100">
                  {opt.value}
                </div>
                {opt.description && (
                  <div className="mt-1 text-xs text-zinc-400">
                    {opt.description}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {args.state.answers[args.currentStep.id]?.value === "Other" && (
          <input
            aria-label="Tell us more"
            className="mt-4 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none"
            onChange={(e) => args.setOther(args.currentStep.id, e.target.value)}
            placeholder="Tell us more…"
            type="text"
            value={args.state.answers[args.currentStep.id]?.other ?? ""}
          />
        )}
      </motion.div>
    );
  }

  if (args.isFreeTextStep) {
    return (
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        initial={{ opacity: 0, x: 16 }}
        key="freeText"
        transition={{ duration: 0.25 }}
      >
        <h3 className="font-display font-medium text-2xl text-zinc-100">
          Tell me more about what you want it to do
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          Optional. Anything that will help me scope the project.
        </p>
        <textarea
          className="mt-6 h-40 w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none"
          onChange={(e) =>
            args.setState((prev) => ({ ...prev, freeText: e.target.value }))
          }
          placeholder="Inputs, outputs, edge cases, references…"
          value={args.state.freeText}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      initial={{ opacity: 0, x: 16 }}
      key="contact"
      transition={{ duration: 0.25 }}
    >
      <h3 className="font-display font-medium text-2xl text-zinc-100">
        Your details
      </h3>
      <div className="mt-6 grid gap-4">
        <Field
          label="Email"
          onChange={(v) =>
            args.setState((prev) => ({
              ...prev,
              contact: { ...prev.contact, email: v },
            }))
          }
          required
          type="email"
          value={args.state.contact.email}
        />
        <Field
          label="Name (optional)"
          onChange={(v) =>
            args.setState((prev) => ({
              ...prev,
              contact: { ...prev.contact, name: v },
            }))
          }
          value={args.state.contact.name}
        />
        <Field
          label="Company (optional)"
          onChange={(v) =>
            args.setState((prev) => ({
              ...prev,
              contact: { ...prev.contact, company: v },
            }))
          }
          value={args.state.contact.company}
        />
      </div>

      <Recap answers={args.state.answers} />

      {args.status === "error" && (
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-200 text-sm">
          {args.errorMessage || "Something went wrong. Please try again."}
        </p>
      )}
    </motion.div>
  );
};

interface PrimaryButtonArgs {
  canAdvanceOption: boolean;
  canSubmit: boolean;
  isContactStep: boolean;
  isFreeTextStep: boolean;
  isOptionStep: boolean;
  next: () => void;
  status: Status;
  submit: () => Promise<void>;
}

const renderPrimaryButton = (args: PrimaryButtonArgs): React.ReactElement => {
  if (args.isContactStep) {
    return (
      <button
        className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-100 px-5 py-2.5 font-medium text-sm text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!args.canSubmit || args.status === "submitting"}
        onClick={args.submit}
        type="button"
      >
        {args.status === "submitting" && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        Send my project
      </button>
    );
  }

  return (
    <button
      className="rounded-lg border border-zinc-300 bg-zinc-100 px-5 py-2.5 font-medium text-sm text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
      disabled={args.isOptionStep && !args.canAdvanceOption}
      onClick={args.next}
      type="button"
    >
      {args.isFreeTextStep ? "Continue" : "Next"}
    </button>
  );
};
