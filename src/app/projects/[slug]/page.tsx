import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "#site/content";
import { Mdx } from "@/app/components/mdx";
import { pageMetadata } from "@/lib/seo";
import { Header } from "./header";
import { Toc } from "./toc";
import "./mdx.css";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return projects
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slugAsParams,
    }));
}

const tagLabels: Record<string, string> = {
  App: "App Design",
  Dev: "Development",
  Game: "Game Development",
  Logo: "Logo Design",
  NFT: "NFT Art",
  Print: "Print Design",
  UI: "UI/UX",
  UX: "UI/UX",
};

const describeTags = (title: string, tags: string[]) => {
  const labels = [...new Set(tags.map((tag) => tagLabels[tag] ?? tag))].filter(
    (label) => !title.toLowerCase().includes(label.split(" ")[0].toLowerCase())
  );

  return labels.slice(0, 2).join(" & ") || "Design";
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slugAsParams === slug);

  if (!project) {
    return {};
  }

  return pageMetadata({
    description: project.description,
    path: `/projects/${project.slugAsParams}`,
    title: `${project.title}: ${describeTags(project.title, project.tags ?? [])} Project`,
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  // Find project by slug (matching the slugAsParams)
  const project = projects.find((entry) => entry.slugAsParams === slug);

  if (!project) {
    notFound();
    return;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* The counter is updated client-side so it cannot invalidate this static page. */}
      <Header project={project} views={0} />

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-12">
        <article className="prose prose-zinc dark:prose-invert prose-quoteless min-w-0 max-w-4xl flex-1">
          <Mdx code={project.body} />
        </article>
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">
            <Toc />
          </div>
        </aside>
      </div>
    </div>
  );
}
