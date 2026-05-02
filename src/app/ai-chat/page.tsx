import {
  ArrowDown,
  CheckCircle2,
  Database,
  MessageSquare,
  Plug,
  Search,
} from "lucide-react";
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
    <div className="bg-black pb-32">
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
  <section className="relative isolate flex min-h-[88vh] items-center justify-center overflow-hidden bg-black px-6 pt-24 pb-16">
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] opacity-30"
    />
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.24),transparent_62%)]"
    />
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-80 bg-[linear-gradient(to_top,rgba(37,99,235,0.13),transparent)]"
    />

    <div className="relative mx-auto w-full max-w-5xl text-center">
      <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 font-mono text-blue-100 text-xs">
        <Search className="h-3.5 w-3.5" strokeWidth={1.5} />
        retrieval with citations
      </div>
      <h1
        className="z-10 mx-auto max-w-4xl cursor-default text-balance bg-gradient-to-b from-white to-zinc-500 bg-clip-text pb-2 font-display text-4xl text-transparent leading-[1.12] sm:text-5xl md:text-6xl"
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
          className="group flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-100 px-6 py-3 font-medium text-sm text-zinc-900 shadow-[0_0_40px_rgba(255,255,255,0.12)] transition-colors hover:bg-white"
          href="#contact"
        >
          Start a project
          <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        </a>
      </div>

      <AiChatHeroVisual />
    </div>
  </section>
);

const AiChatHeroVisual: React.FC = () => (
  <div
    aria-hidden="true"
    className="relative mx-auto mt-14 max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/75 p-3 text-left shadow-2xl shadow-black/60 backdrop-blur"
  >
    <div className="absolute -inset-px rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent_34%,rgba(37,99,235,0.28))] opacity-70" />
    <div className="relative rounded-[1.6rem] border border-white/10 bg-[linear-gradient(145deg,rgba(39,39,42,0.96),rgba(0,0,0,0.94))] p-4">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-300/20 bg-blue-400/10 text-blue-100">
          <Search className="h-4 w-4" strokeWidth={1.5} />
        </span>
        <p className="min-w-0 truncate font-mono text-sm text-zinc-200">
          Ask: which article explains Solana staking best?
        </p>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 uppercase tracking-wide">
            <Database className="h-3.5 w-3.5" strokeWidth={1.5} />
            answer
          </div>
          <p className="mt-4 text-sm text-zinc-200 leading-6">
            Start with the Solana guide, then open staking. The answer cites the
            live market row and the two source articles.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <SourceTag label="guide/solana" />
            <SourceTag label="rankings/SOL" />
          </div>
        </div>

        <div className="rounded-2xl border border-blue-300/15 bg-blue-400/10 p-4">
          <div className="flex items-center gap-2 font-mono text-[11px] text-blue-100 uppercase tracking-wide">
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.5} />
            retrieval score
          </div>
          <div className="mt-5 space-y-3">
            {["CMS article", "Guide index", "Market API"].map((item, index) => (
              <div className="flex items-center gap-3" key={item}>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-200" />
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-blue-200"
                    style={{ width: `${88 - index * 13}%` }}
                  />
                </div>
                <span className="w-20 font-mono text-[11px] text-zinc-400">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
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
            className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-sm backdrop-blur"
            key={step.id}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-blue-300/20 bg-blue-400/10 text-blue-100">
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
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-sm backdrop-blur">
        <p className="text-xs text-zinc-400 uppercase tracking-wide">
          Example question
        </p>
        <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.045] p-4 text-zinc-200">
          What's Solana's market cap, and which guide should I read first?
        </p>
        <p className="mt-6 text-xs text-zinc-400 uppercase tracking-wide">
          Example answer
        </p>
        <div className="mt-3 rounded-xl border border-blue-300/15 bg-blue-400/10 p-4 text-zinc-200">
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
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-zinc-800 shadow-2xl shadow-black/40 lg:aspect-auto">
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
          className="rounded-xl border border-white/10 bg-white/[0.035] p-5 shadow-sm backdrop-blur"
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
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-8 shadow-sm backdrop-blur">
        <p className="text-xs text-zinc-400 uppercase tracking-wide">Setup</p>
        <p className="mt-2 font-bold font-display text-4xl text-zinc-100 md:text-5xl">
          $5,000–10,000
        </p>
        <p className="mt-3 text-sm text-zinc-400">
          One-off. Depends on data sources, volume, and complexity of the
          retrieval pipeline.
        </p>
      </div>
      <div className="rounded-2xl border border-blue-300/30 bg-[linear-gradient(145deg,rgba(37,99,235,0.18),rgba(39,39,42,0.82))] p-8 shadow-sm backdrop-blur">
        <p className="text-blue-100/80 text-xs uppercase tracking-wide">
          Running costs
        </p>
        <p className="mt-2 font-bold font-display text-4xl text-white md:text-5xl">
          $150–600/mo
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
