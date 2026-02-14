"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { projects as projectsType } from "#site/content";
import { Card } from "../components/card";
import IconMapper from "../icons/iconMapper";
import { Article } from "./article";
import { TagFilter } from "./tag-filter";

type Project = (typeof projectsType)[number];
type ViewsType = { [key: string]: number };

type Props = {
	featured: Project;
	top2: Project;
	top3: Project;
	sorted: Project[];
	views: ViewsType;
	allTags: string[];
};

export const ProjectsContent: React.FC<Props> = ({
	featured,
	top2,
	top3,
	sorted,
	views,
	allTags,
}) => {
	const [activeTag, setActiveTag] = useState<string | null>(null);

	const isVisible = (project: Project) => {
		if (activeTag === null) return true;
		return project.tags?.includes(activeTag) ?? false;
	};

	const filteredSorted = useMemo(
		() => sorted.filter(isVisible),
		[sorted, activeTag],
	);

	const showFeatured = isVisible(featured);
	const showTop2 = isVisible(top2);
	const showTop3 = isVisible(top3);
	const hasHighlighted = showFeatured || showTop2 || showTop3;

	return (
		<>
			<div className="max-w-2xl mx-auto lg:mx-0">
				<h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
					Projects
				</h2>
				<p className="mt-4 text-zinc-400">
					Here is a list of projects I have contributed to.
				</p>
				<div className="mt-4">
					<TagFilter tags={allTags} activeTag={activeTag} onTagChange={setActiveTag} />
				</div>
			</div>

			<div className="flex items-center gap-4 w-full">
				<div className="flex-1 h-px bg-zinc-800" />
				<span className="text-xs font-medium text-zinc-500 shrink-0">Featured</span>
				<div className="flex-1 h-px bg-zinc-800" />
			</div>

			{hasHighlighted && (
				<div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2">
					{showFeatured && (
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
									<div className="mt-auto pt-4">
										<p className="text-zinc-200 hover:text-zinc-50 hidden lg:block">
											Read more <span aria-hidden="true">&rarr;</span>
										</p>
									</div>
								</article>
							</Link>
						</Card>
					)}
					{(showTop2 || showTop3) && (
						<div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0">
							{showTop2 && (
								<Card>
									<Article project={top2} views={views[top2.slugAsParams] ?? 0} />
								</Card>
							)}
							{showTop3 && (
								<Card>
									<Article project={top3} views={views[top3.slugAsParams] ?? 0} />
								</Card>
							)}
						</div>
					)}
				</div>
			)}

			{hasHighlighted && filteredSorted.length > 0 && (
				<div className="hidden md:flex items-center gap-4 w-full">
					<div className="flex-1 h-px bg-zinc-800" />
					<span className="text-xs font-medium text-zinc-500 shrink-0">Archive</span>
					<div className="flex-1 h-px bg-zinc-800" />
				</div>
			)}

			{filteredSorted.length > 0 && (
				<div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
					<div className="grid grid-cols-1 gap-4">
						{filteredSorted
							.filter((_, i) => i % 3 === 0)
							.map((project) => (
								<Card key={project.slug}>
									<Article project={project} views={views[project.slugAsParams] ?? 0} />
								</Card>
							))}
					</div>
					<div className="grid grid-cols-1 gap-4">
						{filteredSorted
							.filter((_, i) => i % 3 === 1)
							.map((project) => (
								<Card key={project.slug}>
									<Article project={project} views={views[project.slugAsParams] ?? 0} />
								</Card>
							))}
					</div>
					<div className="grid grid-cols-1 gap-4">
						{filteredSorted
							.filter((_, i) => i % 3 === 2)
							.map((project) => (
								<Card key={project.slug}>
									<Article project={project} views={views[project.slugAsParams] ?? 0} />
								</Card>
							))}
					</div>
				</div>
			)}

			{!hasHighlighted && filteredSorted.length === 0 && (
				<p className="text-zinc-500 text-center py-12">
					No projects found with this tag.
				</p>
			)}
		</>
	);
};
