// app/projects/article.tsx
import type { projects } from "#site/content";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import IconMapper from "../icons/iconMapper";

type Props = {
	project: (typeof projects)[number];
	views: number;
};

export const Article: React.FC<Props> = ({ project, views }) => {
	// Memoize the date formatter
	const dateFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat(undefined, {
				dateStyle: "medium",
			}),
		[],
	);
	const numberFormatter = useMemo(
		() =>
			new Intl.NumberFormat("en-US", {
				notation: "compact",
			}),
		[],
	);

	// Avoid redundant new Date instantiation
	const projectDate = project.date ? new Date(project.date) : null;

	return (
		<Link href={`/projects/${project.slugAsParams}`}>
			<article className="p-4 md:p-8">
				<div className="flex justify-between gap-2 items-center">
					<span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
						{projectDate ? (
							<time dateTime={projectDate.toISOString()}>
								{dateFormatter.format(projectDate)}
							</time>
						) : (
							<span>SOON</span>
						)}
					</span>
					<span className="text-zinc-500 text-xs flex items-center gap-1">
						<Eye className="w-4 h-4" />
						{numberFormatter.format(views)}
					</span>
				</div>
				<div className="flex items-center gap-2">
					{project.icon && (
						<IconMapper
							name={project.icon}
							className="w-4 h-4 sm:w-6 sm:h-6 mt-1 text-zinc-200"
						/>
					)}
					<h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
						{project.title}
					</h2>
				</div>
				<p className="z-20 mt-4 text-sm  duration-1000 text-zinc-400 group-hover:text-zinc-200">
					{project.description}
				</p>
				<div className="mt-4 flex flex-wrap gap-2">
					{project.tags?.map((tag) => (
						<span
							key={tag}
							className="px-2 py-1 text-xs font-medium text-zinc-200 bg-zinc-800 border border-zinc-700 rounded-full"
						>
							{tag}
						</span>
					))}
				</div>
			</article>
		</Link>
	);
};