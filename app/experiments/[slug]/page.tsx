import { Mdx } from "@/app/components/mdx";
import { Redis } from "@upstash/redis";
import { allExperiments } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

const isRedisConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.NODE_ENV === "production"
);
const redis = isRedisConfigured ? Redis.fromEnv() : null;

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allExperiments
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const experiment = allExperiments.find(
    (experiment) => experiment.slug === slug
  );

  if (!experiment) {
    notFound();
    return; // Ensure the function exits after calling notFound()
  }

  let views = 100; // Default mock views count for local development or fallback

  if (redis) {
    // Fetch views from Redis only when it's available and in production
    try {
      const fetchedViews = await redis.get<number>(
        ["pageviews", "projects", slug].join(":")
      );
      views = fetchedViews ?? views;
    } catch (error) {
      console.error(`Error fetching views from Redis for slug: ${slug}`, error);
      // Optionally, fall back to mock views in case of an error
    }
  } else {
    // Log a message to indicate that the views count is mocked in development
    console.log(`Using mock views count for slug: ${slug}`);
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <Header experiment={experiment} views={views} />
      <ReportView slug={experiment.slug} />

      <article className="px-4 py-12 mx-auto prose prose-zinc dark:prose-invert prose-quoteless">
        <Mdx code={experiment.body.code} />
      </article>
    </div>
  );
}
