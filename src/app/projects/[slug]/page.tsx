import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { projects } from "#site/content";
import { Mdx } from "@/app/components/mdx";
import { shouldUseRedis } from "@/lib/redis-guard";
import { Header } from "./header";
import { Toc } from "./toc";
import "./mdx.css";

// Enable ISR: pages are statically generated but revalidate every 60 seconds
export const revalidate = 60;

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return projects
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slugAsParams,
    }));
}

async function getViews(slug: string): Promise<number> {
  // Only fetch views from real Vercel deployments with Redis configured.
  if (shouldUseRedis()) {
    try {
      // Wrap Redis call with unstable_cache to allow SSG
      const getCachedViews = unstable_cache(
        async (slug: string) => {
          const { Redis } = await import("@upstash/redis");
          const redis = Redis.fromEnv();
          const fetchedViews = await redis.get<number>(
            ["pageviews", "projects", slug].join(":")
          );
          return fetchedViews ?? 100;
        },
        [`project-views-${slug}`],
        {
          revalidate: 60,
          tags: [`project-views-${slug}`],
        }
      );

      return await getCachedViews(slug);
    } catch (error) {
      console.error(`Error fetching views from Redis for slug: ${slug}`, error);
      return 100; // Fallback
    }
  }

  // Development fallback
  return 100;
}

export default async function PostPage(props: Props) {
  const params = await props.params;
  const slug = params?.slug;

  // Find project by slug (matching the slugAsParams)
  const project = projects.find((project) => project.slugAsParams === slug);

  if (!project) {
    notFound();
    return;
  }

  // Get views with proper error handling
  const views = await getViews(slug);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header project={project} views={views} />

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-12">
        <article className="prose prose-zinc dark:prose-invert prose-quoteless min-w-0 max-w-4xl flex-1">
          <Mdx code={project.body} />
        </article>
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">
            <Toc />
          </div>
        </aside>
      </div>
    </div>
  );
}
