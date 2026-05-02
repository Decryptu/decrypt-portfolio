"use client";

import { ArrowDown } from "lucide-react";

export const Hero: React.FC = () => {
  const scrollToCalc = () => {
    const el = document.getElementById("calculator");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-tl from-black via-zinc-900/40 to-black px-6 pt-24 pb-16">
      <div className="mx-auto max-w-4xl text-center">
        <h1
          className="cursor-default bg-white bg-clip-text font-display text-4xl text-transparent sm:text-6xl md:text-7xl"
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
          <span className="text-zinc-300">€4,000+/year</span> to{" "}
          <span className="text-zinc-300">~€300/year</span> on visual assets.
        </p>
        <div className="mt-12 flex justify-center">
          <button
            className="group flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-100 px-6 py-3 font-medium text-sm text-zinc-900 transition-colors hover:bg-white"
            onClick={scrollToCalc}
            type="button"
          >
            How much would I save?
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
