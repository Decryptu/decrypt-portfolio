"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { SAVINGS_RATIO, subscriptions } from "./data";

const initialState = (): Record<string, boolean> =>
  Object.fromEntries(subscriptions.map((s) => [s.id, false]));

const formatEur = (n: number): string =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

const ANIMATION_MS = 600;

const useAnimatedNumber = (target: number): number => {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);
  valueRef.current = value;

  useEffect(() => {
    const start = valueRef.current;
    const delta = target - start;
    if (delta === 0) {
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / ANIMATION_MS);
      const eased = 1 - (1 - t) ** 3;
      setValue(start + delta * eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return value;
};

export const SavingsCalculator: React.FC = () => {
  const [selected, setSelected] =
    useState<Record<string, boolean>>(initialState);

  const currentTotal = useMemo(
    () =>
      subscriptions.reduce(
        (sum, s) => (selected[s.id] ? sum + s.defaultPrice : sum),
        0
      ),
    [selected]
  );

  const automatedTotal = currentTotal * (1 - SAVINGS_RATIO);
  const savings = currentTotal - automatedTotal;

  const animatedAutomated = useAnimatedNumber(automatedTotal);
  const animatedSavings = useAnimatedNumber(savings);
  const animatedCurrent = useAnimatedNumber(currentTotal);

  const toggle = (id: string): void =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  const scrollToTree = () => {
    const el = document.getElementById("decision-tree");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:px-8"
      id="calculator"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-bold font-display text-3xl text-zinc-100 tracking-tight sm:text-4xl">
          What are you paying for?
        </h2>
        <p className="mt-4 text-zinc-400">
          Toggle the subscriptions you currently pay for. Watch what they could
          cost as a single, custom-built bot.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((sub) => {
          const isSelected = selected[sub.id] ?? false;
          return (
            <button
              className={`group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                isSelected
                  ? "border-zinc-300 bg-zinc-800/60"
                  : "border-zinc-700 bg-zinc-900/30 hover:border-zinc-500"
              }`}
              key={sub.id}
              onClick={() => toggle(sub.id)}
              type="button"
            >
              <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded bg-zinc-800">
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  sizes="28px"
                  src={`/automations/subscriptions/${sub.id}.webp`}
                />
              </div>
              <span className="flex-1 truncate font-medium text-sm text-zinc-100">
                {sub.name}
              </span>
              <span
                className={`shrink-0 font-mono text-sm tabular-nums ${
                  isSelected ? "text-zinc-100" : "text-zinc-400"
                }`}
              >
                {formatEur(sub.defaultPrice)}/yr
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900/40 p-6 md:p-8">
          <p className="text-sm text-zinc-400 uppercase tracking-wide">
            Current annual cost
          </p>
          <p className="mt-2 font-bold font-display text-4xl text-zinc-200 md:text-5xl">
            {formatEur(animatedCurrent)}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-300/40 bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 md:p-8">
          <p className="text-sm text-zinc-300 uppercase tracking-wide">
            With Decrypt automations
          </p>
          <p className="mt-2 font-bold font-display text-4xl text-white md:text-5xl">
            {formatEur(animatedAutomated)}
          </p>
        </div>
      </div>

      {currentTotal > 0 && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 12 }}
          key={currentTotal}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm text-zinc-400 uppercase tracking-wide">
            You'd save
          </p>
          <p className="mt-3 font-bold font-display text-5xl tracking-tight sm:text-6xl md:text-7xl">
            <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              {formatEur(animatedSavings)}
            </span>
          </p>
          <p className="mt-2 text-sm text-zinc-400">per year</p>
        </motion.div>
      )}

      <div className="mt-10 flex justify-center">
        <button
          className="rounded-lg border border-zinc-300 bg-zinc-100 px-6 py-3 font-medium text-sm text-zinc-900 transition-colors hover:bg-white"
          onClick={scrollToTree}
          type="button"
        >
          Design my bot →
        </button>
      </div>
    </section>
  );
};
