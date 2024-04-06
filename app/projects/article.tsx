import type { Project as GeneratedProject } from "@/.contentlayer/generated";
import IconMapper from "../icons/iconMapper";
import Link from "next/link";
import { Eye } from "lucide-react";

type Props = {
	project: Project;
	views: number;
};

type Project = GeneratedProject & {
	tags?: string[];
	icon?: string;
};

export const Article: React.FC<Props> = ({ project, views }) => {
	return (
		<Link href={`/projects/${project.slug}`}>
			<article className="p-4 md:p-8">
				<div className="flex justify-between gap-2 items-center">
					<span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
						{project.date ? (
							<time dateTime={new Date(project.date).toISOString()}>
								{Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
									new Date(project.date),
								)}
							</time>
						) : (
							<span>SOON</span>
						)}
					</span>
					<span className="text-zinc-500 text-xs flex items-center gap-1">
						<Eye className="w-4 h-4" />{" "}
						{Intl.NumberFormat("en-US", { notation: "compact" }).format(views)}
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
					{project.tags?.map((tag: string) => (
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
