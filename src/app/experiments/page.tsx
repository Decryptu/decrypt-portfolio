import React from "react";
import { unstable_cache } from "next/cache";
import { experiments } from "#site/content";
import { Card } from "../components/card";
import { Article } from "./article";

// Enable ISR: pages are statically generated but revalidate every 60 seconds
export const revalidate = 60;

// Define a type for the views object
type ViewsType = {
	[key: string]: number;
};

async function getViewsData(): Promise<ViewsType> {
	// Only fetch views in production with Redis configured
	if (
		process.env.NODE_ENV === "production" &&
		process.env.UPSTASH_REDIS_REST_URL
	) {
		try {
			// Wrap Redis call with unstable_cache to allow SSG
			const getCachedViewsData = unstable_cache(
				async () => {
					const { Redis } = await import("@upstash/redis");
					const redis = Redis.fromEnv();

					const viewsData = await redis.mget<number[]>(
						...experiments.map((p) =>
							["pageviews", "experiments", p.slugAsParams].join(":"),
						),
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
				},
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
				new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
		);

	return (
		<div className="relative pb-16">
			<div className="p-6 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-12 lg:pt-16">
				<div className="max-w-2xl mx-auto lg:mx-0">
					<h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
						Laboratory
					</h2>
					<p className="mt-4 text-zinc-400">
						Explore this section for code snippets focused on cool UI designs,
						primarily using React, NextJS, and Tailwind CSS.
					</p>
				</div>
				<div className="w-full h-px bg-zinc-800" />
				<div className="grid grid-cols-1 gap-4 mx-auto md:grid-cols-3 lg:mx-0">
					{[0, 1, 2].map((column) => (
						<div key={column} className="grid grid-cols-1 gap-4">
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
