import React from "react";
import { unstable_cache } from "next/cache";
import { projects } from "#site/content";
import { ProjectsContent } from "./projects-content";

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
						...projects.map((p) => ["pageviews", "projects", p.slugAsParams].join(":")),
					);

					return viewsData.reduce((acc: ViewsType, v, i) => {
						acc[projects[i].slugAsParams] = v ?? 0;
						return acc;
					}, {});
				},
				["projects-views-all"],
				{
					revalidate: 60,
					tags: ["projects-views"],
				},
			);

			return await getCachedViewsData();
		} catch (error) {
			console.error("Failed to fetch views from Redis:", error);
			// Fallback to zero views
			return projects.reduce((acc: ViewsType, project) => {
				acc[project.slugAsParams] = 0;
				return acc;
			}, {});
		}
	}

	// Development fallback - return zero views for all projects
	return projects.reduce((acc: ViewsType, project) => {
		acc[project.slugAsParams] = 0;
		return acc;
	}, {});
}

export default async function ProjectsPage() {
	const views = await getViewsData();

	// Find featured projects with fallbacks - using slugAsParams
	const featured = projects.find(
		(project) => project.slugAsParams === "defillama",
	);
	const top2 = projects.find((project) => project.slugAsParams === "cryptoast");
	const top3 = projects.find((project) => project.slugAsParams === "oak");

	// Check if featured projects exist
	if (!featured || !top2 || !top3) {
		throw new Error("Required featured projects not found");
	}

	const sorted = projects
		.filter((p) => p.published)
		.filter(
			(project) =>
				project.slugAsParams !== featured.slugAsParams &&
				project.slugAsParams !== top2.slugAsParams &&
				project.slugAsParams !== top3.slugAsParams,
		)
		.sort(
			(a, b) =>
				new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
				new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
		);

	// Extract all unique tags from published projects, sorted alphabetically
	const allTags = Array.from(
		new Set(
			projects
				.filter((p) => p.published)
				.flatMap((p) => p.tags ?? []),
		),
	).sort();

	return (
		<div className="relative pb-16">
			<div className="p-6 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-12 lg:pt-16">
				<ProjectsContent
					featured={featured}
					top2={top2}
					top3={top3}
					sorted={sorted}
					views={views}
					allTags={allTags}
				/>
			</div>
		</div>
	);
}
