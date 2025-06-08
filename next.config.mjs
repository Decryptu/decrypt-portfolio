// next.config.mjs
import { dirname, join } from "node:path";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generateSitemap = async () => {
  const pages = ["/", "/contact", "/projects", "/experiments"];

  // Generate URLs for projects
  const projectsDirectoryPath = join(__dirname, "src", "content", "projects");
  const projectFiles = await fs.readdir(projectsDirectoryPath);
  const projectSlugs = projectFiles.map((file) => file.replace(".mdx", ""));
  const projectPages = projectSlugs.map((slug) => `/projects/${slug}`);

  // Generate URLs for experiments
  const experimentsDirectoryPath = join(__dirname, "src", "content", "experiments");
  const experimentFiles = await fs.readdir(experimentsDirectoryPath);
  const experimentSlugs = experimentFiles.map((file) =>
    file.replace(".mdx", "")
  );
  const experimentPages = experimentSlugs.map((slug) => `/experiments/${slug}`);

  // Combine all pages
  const allPages = [...pages, ...projectPages, ...experimentPages];
  const baseUrl = "https://decrypt.im";

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const page of allPages) {
    sitemap += `<url>\n  <loc>${baseUrl}${page}</loc>\n  <lastmod>${new Date().toISOString()}</lastmod>\n</url>\n`;
  }

  sitemap += "</urlset>";

  await fs.writeFile(join(__dirname, "public", "sitemap.xml"), sitemap);
};

generateSitemap();

// Velite integration for Next.js 15
const isDev = process.argv.indexOf('dev') !== -1;
const isBuild = process.argv.indexOf('build') !== -1;

if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1';
  const { build } = await import('velite');
  await build({ watch: isDev, clean: !isDev });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  experimental: {
    mdxRs: true,
  },
};

export default nextConfig;