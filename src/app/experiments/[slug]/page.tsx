// app/experiments/[slug]/page.tsx
import { experiments } from "#site/content";
import { notFound } from "next/navigation";
import { Header } from "./header";
import { ReportView } from "./view";
import ExperimentMdx from "../ExperimentMdx";
import "./mdx.css";

// ————————————————————————————————————
// Next-JS segment options
// ————————————————————————————————————
export const dynamic   = "force-dynamic";
export const revalidate = 60;

// ————————————————————————————————————
// Types
// ————————————————————————————————————
type Props = {
  params: Promise<{ slug: string }>;
};

// ————————————————————————————————————
// Static params (SSG)
// ————————————————————————————————————
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return experiments
    .filter((p) => p.published)
    .map((p) => ({ slug: p.slugAsParams }));
}

// ————————————————————————————————————
// Page-view counter (Redis)
// ————————————————————————————————————
async function getViews(slug: string): Promise<number> {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.UPSTASH_REDIS_REST_URL
  ) {
    try {
      const { Redis } = await import("@upstash/redis");
      const redis = Redis.fromEnv();
      const fetched = await redis.get<number>(
        ["pageviews", "experiments", slug].join(":"),
      );
      return fetched ?? 100;
    } catch {
      /* fall through → fallback value below */
    }
  }
  return 100;
}

// ————————————————————————————————————
// The route component
// ————————————————————————————————————
export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const experiment = experiments.find((e) => e.slugAsParams === slug);
  if (!experiment) notFound();

  const views = await getViews(slug);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <Header experiment={experiment} views={views} />
      <ReportView slug={slug} />

      <article className="px-4 py-12 mx-auto max-w-4xl prose prose-zinc dark:prose-invert prose-quoteless">
        <ExperimentMdx code={experiment.body} />
      </article>
    </div>
  );
}