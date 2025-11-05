import { Mdx } from "@/app/components/mdx";
import { notFound } from "next/navigation";
import { projects } from "#site/content";
import { Header } from "./header";
import { ReportView } from "./view";
import "./mdx.css";

// Enable ISR: pages are statically generated but revalidate every 60 seconds
export const revalidate = 60;

type Props = {
	params: Promise<{
		slug: string;
	}>;
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
	return projects
		.filter((p) => p.published)
		.map((p) => ({
			slug: p.slugAsParams,
		}));
}

async function getViews(slug: string): Promise<number> {
	// Only fetch views in production with Redis configured
	if (
		process.env.NODE_ENV === "production" &&
		process.env.UPSTASH_REDIS_REST_URL
	) {
		try {
			const { Redis } = await import("@upstash/redis");
			const redis = Redis.fromEnv();
			const fetchedViews = await redis.get<number>(
				["pageviews", "projects", slug].join(":"),
			);
			return fetchedViews ?? 100;
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
		<div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen">
			<Header project={project} views={views} />
			<ReportView slug={slug} />

			<article className="px-4 py-12 mx-auto max-w-4xl prose prose-zinc dark:prose-invert prose-quoteless">
				{" "}
				<Mdx code={project.body} />
			</article>
		</div>
	);
}
