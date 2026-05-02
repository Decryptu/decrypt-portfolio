"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { SAVINGS_RATIO, subscriptions } from "./data";

interface CardState {
  price: number;
  selected: boolean;
}

const initialState = (): Record<string, CardState> =>
  Object.fromEntries(
    subscriptions.map((s) => [s.id, { selected: false, price: s.defaultPrice }])
  );

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
  const [state, setState] = useState<Record<string, CardState>>(initialState);

  const currentTotal = useMemo(
    () =>
      subscriptions.reduce(
        (sum, s) => (state[s.id]?.selected ? sum + state[s.id].price : sum),
        0
      ),
    [state]
  );

  const automatedTotal = currentTotal * (1 - SAVINGS_RATIO);
  const savings = currentTotal - automatedTotal;

  const animatedAutomated = useAnimatedNumber(automatedTotal);
  const animatedSavings = useAnimatedNumber(savings);
  const animatedCurrent = useAnimatedNumber(currentTotal);

  const toggle = (id: string): void =>
    setState((prev) => ({
      ...prev,
      [id]: { ...prev[id], selected: !prev[id].selected },
    }));

  const setPrice = (id: string, raw: string): void => {
    const parsed = Number.parseInt(raw, 10);
    const price = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    setState((prev) => ({ ...prev, [id]: { ...prev[id], price } }));
  };

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

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {subscriptions.map((sub) => {
          const card = state[sub.id];
          const isSelected = card?.selected ?? false;
          return (
            <button
              className={`group relative flex flex-col gap-3 rounded-xl border p-4 text-left transition-colors ${
                isSelected
                  ? "border-zinc-300 bg-zinc-800/50"
                  : "border-zinc-700 bg-zinc-900/30 hover:border-zinc-500"
              }`}
              key={sub.id}
              onClick={() => toggle(sub.id)}
              type="button"
            >
              <div className="flex items-center justify-between">
                <div className="relative h-10 w-10 overflow-hidden rounded-md bg-zinc-800">
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="40px"
                    src="/placeholders/placeholder-logo.webp"
                  />
                </div>
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    isSelected
                      ? "border-zinc-200 bg-zinc-200 text-zinc-900"
                      : "border-zinc-600"
                  }`}
                >
                  {isSelected && (
                    <svg
                      aria-hidden="true"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              </div>
              <span className="font-medium text-sm text-zinc-100">
                {sub.name}
              </span>
              <label className="flex items-center gap-2 text-xs text-zinc-400">
                <span>€</span>
                <input
                  className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100 focus:border-zinc-400 focus:outline-none"
                  inputMode="numeric"
                  min={0}
                  onChange={(e) => setPrice(sub.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  type="number"
                  value={card?.price ?? 0}
                />
                <span>/yr</span>
              </label>
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
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center font-bold font-display text-2xl text-zinc-100 md:text-4xl"
          initial={{ opacity: 0, y: 12 }}
          key={currentTotal}
          transition={{ duration: 0.4 }}
        >
          You'd save{" "}
          <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            {formatEur(animatedSavings)}
          </span>{" "}
          per year
        </motion.p>
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
