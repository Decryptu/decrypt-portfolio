import { unstable_cache } from "next/cache";
import { experiments } from "#site/content";
import { shouldUseRedis } from "@/lib/redis-guard";
import { Card } from "../components/card";
import { Article } from "./article";

// Enable ISR: pages are statically generated but revalidate every 60 seconds
export const revalidate = 60;

// Define a type for the views object
interface ViewsType {
  [key: string]: number;
}

async function getViewsData(): Promise<ViewsType> {
  // Only fetch views from real Vercel deployments with Redis configured.
  if (shouldUseRedis()) {
    try {
      // Wrap Redis call with unstable_cache to allow SSG
      const getCachedViewsData = unstable_cache(
        async () => {
          const { Redis } = await import("@upstash/redis");
          const redis = Redis.fromEnv();

          const viewsData = await redis.mget<number[]>(
            ...experiments.map((p) =>
              ["pageviews", "experiments", p.slugAsParams].join(":")
            )
          );

          return viewsData.reduce((acc: ViewsType, v, i) => {
            acc[experiments[i].slugAsParams] = v ?? 0;
            return acc;
          }, {});
        },
        ["experiments-views-all"],
        {
          revalidate: 60,
          tags: ["experiments-views"],
        }
      );

      return await getCachedViewsData();
    } catch (error) {
      console.error("Failed to fetch views from Redis:", error);
      // Fallback to zero views
      return experiments.reduce((acc: ViewsType, experiment) => {
        acc[experiment.slugAsParams] = 0;
        return acc;
      }, {});
    }
  }

  // Development fallback - return zero views for all experiments
  return experiments.reduce((acc: ViewsType, experiment) => {
    acc[experiment.slugAsParams] = 0;
    return acc;
  }, {});
}

export default async function ExperimentsPage() {
  const views = await getViewsData();

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
                    <Article
                      experiment={experiment}
                      views={views[experiment.slugAsParams] ?? 0}
                    />
                  </Card>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
