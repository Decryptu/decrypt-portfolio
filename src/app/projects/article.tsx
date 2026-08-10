import { Eye } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import type { projects } from "#site/content";
import { ViewCount } from "../components/view-count";
import IconMapper from "../icons/icon-mapper";

interface Props {
  project: (typeof projects)[number];
}

export const Article: React.FC<Props> = ({ project }) => {
  // Memoize the date formatter
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
      }),
    []
  );
  // Avoid redundant new Date instantiation
  const projectDate = project.date ? new Date(project.date) : null;

  return (
    <Link className="block h-full" href={`/projects/${project.slugAsParams}`}>
      <article className="flex h-full flex-col p-4 md:p-8">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-zinc-200 drop-shadow-orange duration-1000 group-hover:border-zinc-200 group-hover:text-white">
            {projectDate ? (
              <time dateTime={projectDate.toISOString()}>
                {dateFormatter.format(projectDate)}
              </time>
            ) : (
              <span>SOON</span>
            )}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-500">
            <Eye className="h-4 w-4" />
            <ViewCount slug={project.slugAsParams} type="projects" />
          </span>
        </div>
        <div className="flex items-center gap-2">
          {project.icon ? (
            <IconMapper
              className="mt-1 h-4 w-4 text-zinc-200 sm:h-6 sm:w-6"
              name={project.icon}
            />
          ) : null}
          <h2 className="z-20 font-display font-medium text-xl text-zinc-200 duration-1000 group-hover:text-white lg:text-3xl">
            {project.title}
          </h2>
        </div>
        <p className="z-20 mt-4 text-sm text-zinc-400 duration-1000 group-hover:text-zinc-200">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags?.map((tag) => (
            <span
              className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-1 font-medium text-xs text-zinc-200"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
};
