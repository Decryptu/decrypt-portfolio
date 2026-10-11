import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { experiments } from "#site/content";
import { pageMetadata } from "@/lib/seo";
import ExperimentMdx from "../experiment-mdx";
import { Header } from "./header";
import "./mdx.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return experiments
    .filter((p) => p.published)
    .map((p) => ({ slug: p.slugAsParams }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const experiment = experiments.find((e) => e.slugAsParams === slug);

  if (!experiment) {
    return {};
  }

  return pageMetadata({
    description: experiment.description,
    path: `/experiments/${experiment.slugAsParams}`,
    title: `${experiment.title}: React & Tailwind CSS Component`,
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const experiment = experiments.find((e) => e.slugAsParams === slug);
  if (!experiment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* The counter is updated client-side so it cannot invalidate this static page. */}
      <Header experiment={experiment} views={0} />

      <article className="prose prose-zinc dark:prose-invert prose-quoteless mx-auto max-w-4xl px-4 py-12">
        <ExperimentMdx code={experiment.body} />
      </article>
    </div>
  );
}
