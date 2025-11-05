import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { experiments } from "#site/content";
import ExperimentMdx from "../ExperimentMdx";
import { Header } from "./header";
import { ReportView } from "./view";
import "./mdx.css";

// Enable ISR: pages are statically generated but revalidate every 60 seconds
export const revalidate = 60;

type Props = {
	params: Promise<{ slug: string }>;
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
	return experiments
		.filter((p) => p.published)
		.map((p) => ({ slug: p.slugAsParams }));
}

async function getViews(slug: string): Promise<number> {
	if (
		process.env.NODE_ENV === "production" &&
		process.env.UPSTASH_REDIS_REST_URL
	) {
		try {
			// Wrap Redis call with unstable_cache to allow SSG
			const getCachedViews = unstable_cache(
				async (slug: string) => {
					const { Redis } = await import("@upstash/redis");
					const redis = Redis.fromEnv();
					const fetched = await redis.get<number>(
						["pageviews", "experiments", slug].join(":"),
					);
					return fetched ?? 0;
				},
				[`experiment-views-${slug}`],
				{
					revalidate: 60,
					tags: [`experiment-views-${slug}`],
				},
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
