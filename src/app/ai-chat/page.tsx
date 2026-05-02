import { ArrowDown, Database, MessageSquare, Plug } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "AI Chat",
  description:
    "AI agents connected to your existing database. Plain-English answers to your users, sourced from your real content, not hallucinations.",
};

export default function AiChatPage() {
  return (
    <div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900/30 to-zinc-900/0 pb-32">
      <Hero />
      <HowItWorks />
      <UseCase />
      <Included />
      <Estimate />
      <Contact />
    </div>
  );
}

const Hero: React.FC = () => (
  <section className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-tl from-black via-zinc-900/40 to-black px-6 pt-24 pb-16">
    <div className="mx-auto max-w-4xl text-center">
      <h1
        className="z-10 cursor-default whitespace-pre-line bg-white bg-clip-text font-display text-4xl text-transparent sm:text-6xl md:text-7xl"
        style={{ fontFamily: "var(--font-calsans)" }}
      >
        Your database, queryable in plain English.
      </h1>
      <p className="mt-8 text-base text-zinc-400 md:text-lg">
        AI agents that read your real content and answer your users with
        sources, not hallucinations.
      </p>
      <div className="mt-12 flex justify-center">
        <a
          className="group flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-100 px-6 py-3 font-medium text-sm text-zinc-900 transition-colors hover:bg-white"
          href="#contact"
        >
          Start a project
          <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        </a>
      </div>
    </div>
  </section>
);

interface Step {
  readonly description: string;
  readonly icon: React.ComponentType<{
    className?: string;
    strokeWidth?: number;
  }>;
  readonly id: string;
  readonly title: string;
}

const STEPS: readonly Step[] = [
  {
    id: "connect",
    icon: Plug,
    title: "Connect your data sources",
    description: "CMS, database, API: wherever your content lives.",
  },
  {
    id: "build",
    icon: Database,
    title: "I build the retrieval layer",
    description: "RAG, embeddings, vector search, tuned to your content.",
  },
  {
    id: "embed",
    icon: MessageSquare,
    title: "Embed the chat",
    description: "Drop the widget on your site, or expose it via API.",
  },
] as const;

const HowItWorks: React.FC = () => (
  <section className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:px-8">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="font-bold font-display text-3xl text-zinc-100 tracking-tight sm:text-4xl">
        How it works
      </h2>
    </div>
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        return (
          <div
            className="rounded-2xl border border-zinc-700 bg-zinc-900/40 p-6"
            key={step.id}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-600 bg-zinc-800 text-zinc-200">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="font-mono text-xs text-zinc-500">0{i + 1}</span>
            </div>
            <h3 className="mt-4 font-display font-medium text-xl text-zinc-100">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-zinc-400">{step.description}</p>
          </div>
        );
      })}
    </div>
  </section>
);

const UseCase: React.FC = () => (
  <section className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:px-8">
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm text-zinc-400 uppercase tracking-wide">Use case</p>
      <h2 className="mt-2 font-bold font-display text-3xl text-zinc-100 tracking-tight sm:text-4xl">
        Cryptoast: news, guides & rankings, queryable
      </h2>
      <p className="mt-4 text-zinc-400">
        News articles, long-form guides, live crypto rankings (price, market
        cap, volume), all answerable from a single chat, with citations back to
        the source content.
      </p>
    </div>

    <div className="mt-10 grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900/40 p-6">
        <p className="text-xs text-zinc-400 uppercase tracking-wide">
          Example question
        </p>
        <p className="mt-3 rounded-xl bg-zinc-800/50 p-4 text-zinc-200">
          What's Solana's market cap, and which guide should I read first?
        </p>
        <p className="mt-6 text-xs text-zinc-400 uppercase tracking-wide">
          Example answer
        </p>
        <div className="mt-3 rounded-xl border border-zinc-700 bg-zinc-900/60 p-4 text-zinc-200">
          <p>
            Solana sits at <span className="text-zinc-100">$X.XB</span> market
            cap as of today. For a primer, start with{" "}
            <span className="underline decoration-zinc-600 underline-offset-2">
              "What is Solana?"
            </span>{" "}
            then move on to the staking guide.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <SourceTag label="cryptoast.fr/solana" />
            <SourceTag label="cryptoast.fr/guides/solana-staking" />
            <SourceTag label="api/markets/SOL" />
          </div>
        </div>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-800 lg:aspect-auto">
        <Image
          alt="Chat UI mockup placeholder"
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          src="/ai-chat/chat-ui-mockup.webp"
        />
      </div>
    </div>
  </section>
);

interface SourceTagProps {
  readonly label: string;
}

const SourceTag: React.FC<SourceTagProps> = ({ label }) => (
  <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-1 font-mono text-xs text-zinc-300">
    {label}
  </span>
);

const INCLUDED: readonly { id: string; title: string; body: string }[] = [
  {
    id: "retrieval",
    title: "Custom retrieval pipeline",
    body: "Tuned to your content: chunking, embeddings, ranking.",
  },
  {
    id: "citations",
    title: "Source citations on every answer",
    body: "Every claim links back to the article, doc or row it came from.",
  },
  {
    id: "widget",
    title: "Embeddable widget",
    body: "Drop in a single script tag, or query via API.",
  },
  {
    id: "monitoring",
    title: "Monitoring + iteration",
    body: "I watch real questions and improve the retrieval over time.",
  },
] as const;

const Included: React.FC = () => (
  <section className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:px-8">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="font-bold font-display text-3xl text-zinc-100 tracking-tight sm:text-4xl">
        What's included
      </h2>
    </div>
    <div className="mt-10 grid gap-4 md:grid-cols-2">
      {INCLUDED.map((item) => (
        <div
          className="rounded-xl border border-zinc-700 bg-zinc-900/40 p-5"
          key={item.id}
        >
          <h3 className="font-display font-medium text-lg text-zinc-100">
            {item.title}
          </h3>
          <p className="mt-2 text-sm text-zinc-400">{item.body}</p>
        </div>
      ))}
    </div>
  </section>
);

const Estimate: React.FC = () => (
  <section className="mx-auto max-w-4xl px-6 py-16 md:py-24 lg:px-8">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="font-bold font-display text-3xl text-zinc-100 tracking-tight sm:text-4xl">
        Pricing
      </h2>
    </div>
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900/40 p-8">
        <p className="text-xs text-zinc-400 uppercase tracking-wide">Setup</p>
        <p className="mt-2 font-bold font-display text-4xl text-zinc-100 md:text-5xl">
          €4,000–8,000
        </p>
        <p className="mt-3 text-sm text-zinc-400">
          One-off. Depends on data sources, volume, and complexity of the
          retrieval pipeline.
        </p>
      </div>
      <div className="rounded-2xl border border-zinc-300/40 bg-gradient-to-br from-zinc-800 to-zinc-900 p-8">
        <p className="text-xs text-zinc-300 uppercase tracking-wide">
          Running costs
        </p>
        <p className="mt-2 font-bold font-display text-4xl text-white md:text-5xl">
          €100–500/mo
        </p>
        <p className="mt-3 text-sm text-zinc-300">
          API + vector DB hosting. Scales with traffic; capped to a budget you
          set.
        </p>
      </div>
    </div>
  </section>
);

const Contact: React.FC = () => (
  <section
    className="mx-auto max-w-3xl px-6 py-16 md:py-24 lg:px-8"
    id="contact"
  >
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="font-bold font-display text-3xl text-zinc-100 tracking-tight sm:text-4xl">
        Tell me about your project
      </h2>
      <p className="mt-4 text-zinc-400">
        A few sentences is enough to start. I reply within 24 hours.
      </p>
    </div>
    <div className="mt-10">
      <ContactForm />
    </div>
  </section>
);
