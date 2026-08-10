import { projects } from "#site/content";
import { ProjectsContent } from "./projects-content";

export default async function ProjectsPage() {
  // Find featured projects with fallbacks - using slugAsParams
  const featured = projects.find(
    (project) => project.slugAsParams === "defillama"
  );
  const top2 = projects.find((project) => project.slugAsParams === "cryptoast");
  const top3 = projects.find((project) => project.slugAsParams === "oak");

  // Check if featured projects exist
  if (!(featured && top2 && top3)) {
    throw new Error("Required featured projects not found");
  }

  const sorted = projects
    .filter((p) => p.published)
    .filter(
      (project) =>
        project.slugAsParams !== featured.slugAsParams &&
        project.slugAsParams !== top2.slugAsParams &&
        project.slugAsParams !== top3.slugAsParams
    )
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    );

  // Extract all unique tags from published projects, sorted alphabetically
  const allTags = Array.from(
    new Set(projects.filter((p) => p.published).flatMap((p) => p.tags ?? []))
  ).sort();

  return (
    <div className="relative pb-16">
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:space-y-16 md:pt-12 lg:px-8 lg:pt-16">
        <ProjectsContent
          allTags={allTags}
          featured={featured}
          sorted={sorted}
          top2={top2}
          top3={top3}
        />
      </div>
    </div>
  );
}
