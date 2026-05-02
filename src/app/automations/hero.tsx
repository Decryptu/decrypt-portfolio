"use client";

import {
  ArrowDown,
  Bot,
  Check,
  FilePenLine,
  ImageIcon,
  Newspaper,
  Presentation,
  Sparkles,
} from "lucide-react";

const FLOW_ROWS = [
  {
    id: "stock",
    before: "Shutterstock",
    after: "Thumbnail bot",
    cost: "$4,000/yr",
    saved: "$3,700 saved",
    Icon: ImageIcon,
  },
  {
    id: "editor",
    before: "Low-quality editor",
    after: "Article publishing bot",
    cost: "$3,000/mo",
    saved: "Writes and publishes",
    Icon: Newspaper,
  },
  {
    id: "canva",
    before: "Canva templates",
    after: "Infographic bot",
    cost: "$360/yr",
    saved: "On-brand visuals",
    Icon: Presentation,
  },
] as const;

export const Hero: React.FC = () => {
  const scrollToCalc = () => {
    const el = document.getElementById("calculator");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-black px-6 pt-24 pb-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] opacity-40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_50%_0%,rgba(126,164,91,0.22),transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-80 bg-[linear-gradient(to_top,rgba(126,164,91,0.16),transparent)]"
      />

      <div className="relative mx-auto w-full max-w-5xl text-center">
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 font-mono text-lime-200 text-xs">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
          subscription replacement systems
        </div>
        <h1
          className="mx-auto max-w-4xl cursor-default text-balance bg-gradient-to-b from-white to-zinc-500 bg-clip-text pb-2 font-display text-4xl text-transparent leading-[1.12] sm:text-5xl md:text-6xl"
          style={{ fontFamily: "var(--font-calsans)" }}
        >
          Replace your subscriptions with bots that don't look like AI slop.
        </h1>
        <p className="mt-8 text-base text-zinc-400 md:text-lg">
          Custom automations to replace Shutterstock, Iconscout, and the rest of
          your stack at roughly{" "}
          <span className="text-zinc-200">10× lower cost</span>, with artistic
          direction baked in.
        </p>
        <p className="mt-4 text-sm text-zinc-500 md:text-base">
          Cryptoast went from{" "}
          <span className="text-zinc-300">$4,000+/year</span> to{" "}
          <span className="text-zinc-300">~$300/year</span> on visual assets.
        </p>
        <div className="mt-12 flex justify-center">
          <button
            className="group flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-100 px-6 py-3 font-medium text-sm text-zinc-900 shadow-[0_0_40px_rgba(255,255,255,0.12)] transition-colors hover:bg-white"
            onClick={scrollToCalc}
            type="button"
          >
            How much would I save?
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>

        <AutomationHeroVisual />
      </div>
    </section>
  );
};

const AutomationHeroVisual: React.FC = () => (
  <div
    aria-hidden="true"
    className="relative mx-auto mt-14 max-w-3xl rounded-[2rem] border border-white/10 bg-zinc-950/75 p-3 text-left shadow-2xl shadow-black/60 backdrop-blur"
  >
    <div className="absolute -inset-px rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_35%,rgba(126,164,91,0.24))] opacity-60" />
    <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(145deg,rgba(39,39,42,0.96),rgba(0,0,0,0.94))]">
      <div className="flex items-center justify-between border-white/10 border-b px-4 py-3">
        <div className="flex items-center gap-2 text-zinc-300">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-lime-300/25 bg-lime-300/15 text-lime-200">
            <Bot className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <div>
            <p className="font-medium text-sm text-zinc-100">Automation desk</p>
            <p className="font-mono text-[11px] text-zinc-500">
              assets, articles, infographics
            </p>
          </div>
        </div>
        <div className="rounded-full border border-lime-300/20 bg-lime-300/10 px-2 py-1 font-mono text-[11px] text-lime-200">
          live
        </div>
      </div>

      <div className="grid gap-2 p-3">
        {FLOW_ROWS.map((row) => (
          <div
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-3"
            key={row.id}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
                <row.Icon className="h-4 w-4" strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-sm text-zinc-100">
                  {row.before}
                </p>
                <p className="font-mono text-[11px] text-zinc-500">
                  {row.cost}
                </p>
              </div>
            </div>
            <div className="h-px w-10 bg-lime-300/40" />
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-lime-300/25 bg-lime-300/10 text-lime-200">
                {row.id === "editor" ? (
                  <FilePenLine className="h-4 w-4" strokeWidth={1.8} />
                ) : (
                  <Check className="h-4 w-4" strokeWidth={1.8} />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-sm text-zinc-100">
                  {row.after}
                </p>
                <p className="font-mono text-[11px] text-lime-200/80">
                  {row.saved}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
