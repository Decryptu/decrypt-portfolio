import { Eye } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import type { experiments } from "#site/content";
import IconMapper from "../icons/iconMapper";

type Props = {
	experiment: (typeof experiments)[number];
	views: number;
};

export const Article: React.FC<Props> = ({ experiment, views }) => {
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
	const experimentDate = experiment.date ? new Date(experiment.date) : null;

	return (
		<Link href={`/experiments/${experiment.slugAsParams}`} className="block h-full">
			<article className="p-4 md:p-8 h-full flex flex-col">
				<div className="flex justify-between gap-2 items-center">
					<span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
						{experimentDate ? (
							<time dateTime={experimentDate.toISOString()}>
								{dateFormatter.format(experimentDate)}
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
					{experiment.icon && (
						<IconMapper
							name={experiment.icon}
							className="w-4 h-4 sm:w-6 sm:h-6 mt-1 text-zinc-200"
						/>
					)}
					<h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
						{experiment.title}
					</h2>
				</div>
				<p className="z-20 mt-4 text-sm  duration-1000 text-zinc-400 group-hover:text-zinc-200">
					{experiment.description}
				</p>
				<div className="mt-4 flex flex-wrap gap-2">
					{experiment.tags?.map((tag) => (
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
