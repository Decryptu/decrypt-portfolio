import { Eye } from "lucide-react";
import Link from "next/link";
import React from "react";
import { unstable_cache } from "next/cache";
import { projects } from "#site/content";
import { Card } from "../components/card";
import IconMapper from "../icons/iconMapper";
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

	return (
		<div className="relative pb-16">
			<div className="p-6 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-12 lg:pt-16">
				<div className="max-w-2xl mx-auto lg:mx-0">
					<h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
						Projects
					</h2>
					<p className="mt-4 text-zinc-400">
						Here is a list of projects I have contributed to.
					</p>
				</div>
				<div className="w-full h-px bg-zinc-800" />
				<div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
					<Card>
						<Link href={`/projects/${featured.slugAsParams}`} className="block h-full">
							<article className="relative h-full w-full p-4 md:p-8 flex flex-col">
								<div className="flex justify-between gap-2 items-center">
									<div className="text-xs text-zinc-100">
										{featured.date ? (
											<time dateTime={new Date(featured.date).toISOString()}>
												{Intl.DateTimeFormat(undefined, {
													dateStyle: "medium",
												}).format(new Date(featured.date))}
											</time>
										) : (
											<span>SOON</span>
										)}
									</div>
									<span className="text-zinc-500 text-xs flex items-center gap-1">
										<Eye className="w-4 h-4" />
										{Intl.NumberFormat("en-US", {
											notation: "compact",
										}).format(views[featured.slugAsParams] ?? 0)}
									</span>
								</div>
								<div className="flex items-center gap-2">
									{featured.icon && (
										<IconMapper
											name={featured.icon}
											className="w-4 h-4 sm:w-6 sm:h-6 mt-5 text-zinc-200"
										/>
									)}
									<h2
										id="featured-post"
										className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
									>
										{featured.title}
									</h2>
								</div>
								<p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
									{featured.description}
								</p>
								<div className="mt-4 flex flex-wrap gap-2">
									{featured.tags?.map((tag) => (
										<span
											key={tag}
											className="px-2 py-1 text-xs font-medium text-zinc-200 bg-zinc-800 border border-zinc-700 rounded-full"
										>
											{tag}
										</span>
									))}
								</div>
								<div className="absolute bottom-4 md:bottom-8">
									<p className="text-zinc-200 hover:text-zinc-50 hidden lg:block">
										Read more <span aria-hidden="true">&rarr;</span>
									</p>
								</div>
							</article>
						</Link>
					</Card>
					<div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0">
						{[top2, top3].map((project) => (
							<Card key={project.slug}>
								<Article project={project} views={views[project.slugAsParams] ?? 0} />
							</Card>
						))}
					</div>
				</div>
				<div className="hidden w-full h-px md:block bg-zinc-800" />
				<div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
					<div className="grid grid-cols-1 gap-4">
						{sorted
							.filter((_, i) => i % 3 === 0)
							.map((project) => (
								<Card key={project.slug}>
									<Article project={project} views={views[project.slugAsParams] ?? 0} />
								</Card>
							))}
					</div>
					<div className="grid grid-cols-1 gap-4">
						{sorted
							.filter((_, i) => i % 3 === 1)
							.map((project) => (
								<Card key={project.slug}>
									<Article project={project} views={views[project.slugAsParams] ?? 0} />
								</Card>
							))}
					</div>
					<div className="grid grid-cols-1 gap-4">
						{sorted
							.filter((_, i) => i % 3 === 2)
							.map((project) => (
								<Card key={project.slug}>
									<Article project={project} views={views[project.slugAsParams] ?? 0} />
								</Card>
							))}
					</div>
				</div>
			</div>
		</div>
	);
}
