"use client";

import { useCallback } from "react";

interface Props {
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  tags: string[];
}

export const TagFilter: React.FC<Props> = ({
  tags,
  activeTag,
  onTagChange,
}) => {
  const handleClick = useCallback(
    (tag: string | null) => () => {
      onTagChange(tag);
    },
    [onTagChange]
  );

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`cursor-pointer rounded-full border px-3 py-1 font-medium text-xs transition-colors duration-200 ${
          activeTag === null
            ? "border-zinc-100 bg-zinc-100 text-zinc-900"
            : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
        }`}
        onClick={handleClick(null)}
        type="button"
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          className={`cursor-pointer rounded-full border px-3 py-1 font-medium text-xs transition-colors duration-200 ${
            activeTag === tag
              ? "border-zinc-100 bg-zinc-100 text-zinc-900"
              : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
          }`}
          key={tag}
          onClick={handleClick(tag)}
          type="button"
        >
          {tag}
        </button>
      ))}
    </div>
  );
};
