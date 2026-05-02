import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { experiments } from "#site/content";
import { shouldUseRedis } from "@/lib/redis-guard";
import ExperimentMdx from "../experiment-mdx";
import { Header } from "./header";
import "./mdx.css";

// Enable ISR: pages are statically generated but revalidate every 60 seconds
export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return experiments
    .filter((p) => p.published)
    .map((p) => ({ slug: p.slugAsParams }));
}

async function getViews(slug: string): Promise<number> {
  if (shouldUseRedis()) {
    try {
      // Wrap Redis call with unstable_cache to allow SSG
      const getCachedViews = unstable_cache(
        async (slug: string) => {
          const { Redis } = await import("@upstash/redis");
          const redis = Redis.fromEnv();
          const fetched = await redis.get<number>(
            ["pageviews", "experiments", slug].join(":")
          );
          return fetched ?? 0;
        },
        [`experiment-views-${slug}`],
        {
          revalidate: 60,
          tags: [`experiment-views-${slug}`],
        }
      );

      return await getCachedViews(slug);
    } catch {
      return 0;
    }
  }
  return 0;
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const experiment = experiments.find((e) => e.slugAsParams === slug);
  if (!experiment) {
    notFound();
  }

  const views = await getViews(slug);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header experiment={experiment} views={views} />

      <article className="prose prose-zinc dark:prose-invert prose-quoteless mx-auto max-w-4xl px-4 py-12">
        <ExperimentMdx code={experiment.body} />
      </article>
    </div>
  );
}
