// app/experiments/[slug]/page.tsx
import { Mdx } from "@/app/components/mdx";
import { experiments } from "#site/content";
import { notFound } from "next/navigation";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";

// Force dynamic rendering for Redis calls
export const dynamic = "force-dynamic";
export const revalidate = 60;

type Props = {
	params: Promise<{
		slug: string;
	}>;
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
	return experiments
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
				["pageviews", "experiments", slug].join(":"),
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

	// Find experiment by slug (matching the slugAsParams)
	const experiment = experiments.find(
		(experiment) => experiment.slugAsParams === slug,
	);

	if (!experiment) {
		notFound();
		return;
	}

	// Get views with proper error handling
	const views = await getViews(slug);

	return (
		<div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen">
			<Header experiment={experiment} views={views} />
			<ReportView slug={slug} />

			<article className="px-4 py-12 mx-auto max-w-4xl prose prose-zinc dark:prose-invert prose-quoteless">
				<Mdx code={experiment.body} />
			</article>
		</div>
	);
}
