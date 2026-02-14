"use client";

import { useCallback } from "react";

type Props = {
	tags: string[];
	activeTag: string | null;
	onTagChange: (tag: string | null) => void;
};

export const TagFilter: React.FC<Props> = ({ tags, activeTag, onTagChange }) => {
	const handleClick = useCallback(
		(tag: string | null) => () => {
			onTagChange(tag);
		},
		[onTagChange],
	);

	return (
		<div className="flex flex-wrap gap-2">
			<button
				type="button"
				onClick={handleClick(null)}
				className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors duration-200 cursor-pointer ${
					activeTag === null
						? "bg-zinc-100 text-zinc-900 border-zinc-100"
						: "text-zinc-400 bg-zinc-800/50 border-zinc-700 hover:text-zinc-200 hover:border-zinc-500"
				}`}
			>
				All
			</button>
			{tags.map((tag) => (
				<button
					key={tag}
					type="button"
					onClick={handleClick(tag)}
					className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors duration-200 cursor-pointer ${
						activeTag === tag
							? "bg-zinc-100 text-zinc-900 border-zinc-100"
							: "text-zinc-400 bg-zinc-800/50 border-zinc-700 hover:text-zinc-200 hover:border-zinc-500"
					}`}
				>
					{tag}
				</button>
			))}
		</div>
	);
};
