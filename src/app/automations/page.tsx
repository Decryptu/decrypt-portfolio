import type { Metadata } from "next";
import { CaseStudy } from "./case-study";
import { DecisionTree } from "./decision-tree";
import { Hero } from "./hero";
import { SavingsCalculator } from "./savings-calculator";

export const metadata: Metadata = {
  title: "Automations",
  description:
    "Custom bots that replace expensive SaaS subscriptions with API-based automations — at roughly 10× lower cost, with artistic direction baked in.",
};

export default function AutomationsPage() {
  return (
    <div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900/30 to-zinc-900/0 pb-32">
      <Hero />
      <SavingsCalculator />
      <CaseStudy />
      <DecisionTree />
      <ClosingBlock />
    </div>
  );
}

const ClosingBlock: React.FC = () => (
  <section className="mx-auto max-w-3xl px-6 pb-16 text-center">
    <div className="mx-auto h-px w-24 bg-zinc-800" />
    <p className="mt-8 text-zinc-400">
      Ten years in graphic design. Artistic direction included on every bot.
      Maintained after launch — not just shipped.
    </p>
  </section>
);
