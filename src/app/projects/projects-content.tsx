"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { projects as projectsType } from "#site/content";
import { Card } from "../components/card";
import IconMapper from "../icons/icon-mapper";
import { Article } from "./article";
import { TagFilter } from "./tag-filter";

type Project = (typeof projectsType)[number];
interface ViewsType {
  [key: string]: number;
}

interface Props {
  allTags: string[];
  featured: Project;
  sorted: Project[];
  top2: Project;
  top3: Project;
  views: ViewsType;
}

export const ProjectsContent: React.FC<Props> = ({
  featured,
  top2,
  top3,
  sorted,
  views,
  allTags,
}) => {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const isVisible = useCallback(
    (project: Project) => {
      if (activeTag === null) {
        return true;
      }
      return project.tags?.includes(activeTag) ?? false;
    },
    [activeTag]
  );

  const filteredSorted = useMemo(
    () => sorted.filter(isVisible),
    [sorted, isVisible]
  );

  const showFeatured = isVisible(featured);
  const showTop2 = isVisible(top2);
  const showTop3 = isVisible(top3);
  const hasHighlighted = showFeatured || showTop2 || showTop3;

  return (
    <>
      <div className="mx-auto max-w-2xl lg:mx-0">
        <h2 className="font-bold text-3xl text-zinc-100 tracking-tight sm:text-4xl">
          Projects
        </h2>
        <p className="mt-4 text-zinc-400">
          Here is a list of projects I have contributed to.
        </p>
        <div className="mt-4">
          <TagFilter
            activeTag={activeTag}
            onTagChange={setActiveTag}
            tags={allTags}
          />
        </div>
      </div>

      <div className="flex w-full items-center gap-4">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="shrink-0 font-medium text-xs text-zinc-500">
          Featured
        </span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      {hasHighlighted && (
        <div className="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2">
          {showFeatured && (
            <Card>
              <Link
                className="block h-full"
                href={`/projects/${featured.slugAsParams}`}
              >
                <article className="relative flex h-full w-full flex-col p-4 md:p-8">
                  <div className="flex items-center justify-between gap-2">
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
                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                      <Eye className="h-4 w-4" />
                      {Intl.NumberFormat("en-US", {
                        notation: "compact",
                      }).format(views[featured.slugAsParams] ?? 0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {featured.icon && (
                      <IconMapper
                        className="mt-5 h-4 w-4 text-zinc-200 sm:h-6 sm:w-6"
                        name={featured.icon}
                      />
                    )}
                    <h2
                      className="mt-4 font-bold font-display text-3xl text-zinc-100 group-hover:text-white sm:text-4xl"
                      id="featured-post"
                    >
                      {featured.title}
                    </h2>
                  </div>
                  <p className="mt-4 text-zinc-400 leading-8 duration-150 group-hover:text-zinc-300">
                    {featured.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {featured.tags?.map((tag) => (
                      <span
                        className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-1 font-medium text-xs text-zinc-200"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4">
                    <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                      Read more <span aria-hidden="true">&rarr;</span>
                    </p>
                  </div>
                </article>
              </Link>
            </Card>
          )}
          {(showTop2 || showTop3) && (
            <div className="mx-auto flex w-full flex-col gap-8 border-gray-900/10 border-t lg:mx-0 lg:border-t-0">
              {showTop2 && (
                <Card>
                  <Article
                    project={top2}
                    views={views[top2.slugAsParams] ?? 0}
                  />
                </Card>
              )}
              {showTop3 && (
                <Card>
                  <Article
                    project={top3}
                    views={views[top3.slugAsParams] ?? 0}
                  />
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {hasHighlighted && filteredSorted.length > 0 && (
        <div className="hidden w-full items-center gap-4 md:flex">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="shrink-0 font-medium text-xs text-zinc-500">
            Archive
          </span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>
      )}

      {filteredSorted.length > 0 && (
        <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-3 lg:mx-0">
          <div className="grid grid-cols-1 gap-4">
            {filteredSorted
              .filter((_, i) => i % 3 === 0)
              .map((project) => (
                <Card key={project.slug}>
                  <Article
                    project={project}
                    views={views[project.slugAsParams] ?? 0}
                  />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredSorted
              .filter((_, i) => i % 3 === 1)
              .map((project) => (
                <Card key={project.slug}>
                  <Article
                    project={project}
                    views={views[project.slugAsParams] ?? 0}
                  />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredSorted
              .filter((_, i) => i % 3 === 2)
              .map((project) => (
                <Card key={project.slug}>
                  <Article
                    project={project}
                    views={views[project.slugAsParams] ?? 0}
                  />
                </Card>
              ))}
          </div>
        </div>
      )}

      {!hasHighlighted && filteredSorted.length === 0 && (
        <p className="py-12 text-center text-zinc-500">
          No projects found with this tag.
        </p>
      )}
    </>
  );
};
