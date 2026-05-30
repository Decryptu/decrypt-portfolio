import type { MetadataRoute } from "next";
import { experiments, projects } from "#site/content";

const baseUrl = "https://decrypt.im";

const staticPages = ["", "/contact", "/projects", "/experiments"] as const;

const withLastModified = (date?: string) =>
  date ? { lastModified: new Date(date) } : {};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
    })),
    ...projects
      .filter((project) => project.published)
      .map((project) => ({
        url: `${baseUrl}/projects/${project.slugAsParams}`,
        ...withLastModified(project.date),
      })),
    ...experiments
      .filter((experiment) => experiment.published)
      .map((experiment) => ({
        url: `${baseUrl}/experiments/${experiment.slugAsParams}`,
        ...withLastModified(experiment.date),
      })),
  ];
}
