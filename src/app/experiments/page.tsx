import { experiments } from "#site/content";
import { Card } from "../components/card";
import { Article } from "./article";

export default async function ExperimentsPage() {
  // Sort all experiments by published date
  const sortedExperiments = experiments
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    );

  return (
    <div className="relative pb-16">
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:space-y-16 md:pt-12 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="font-bold text-3xl text-zinc-100 tracking-tight sm:text-4xl">
            Laboratory
          </h2>
          <p className="mt-4 text-zinc-400">
            Explore this section for code snippets focused on cool UI designs,
            primarily using React, NextJS, and Tailwind CSS.
          </p>
        </div>
        <div className="h-px w-full bg-zinc-800" />
        <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-3 lg:mx-0">
          {[0, 1, 2].map((column) => (
            <div className="grid grid-cols-1 gap-4" key={column}>
              {sortedExperiments
                .filter((_, i) => i % 3 === column)
                .map((experiment) => (
                  <Card key={experiment.slug}>
                    <Article experiment={experiment} />
                  </Card>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
