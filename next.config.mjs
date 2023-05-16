import { withContentlayer } from "next-contentlayer";
import sitemap from 'nextjs-sitemap-generator';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generateDynamicPages = async () => {
  const directoryPath = join(__dirname, 'content', 'projects');
  const files = await fs.readdir(directoryPath);
  const slugs = files.map(file => file.replace('.mdx', ''));
  return slugs.map(slug => `/projects/${slug}`);
};

const generateSitemap = async () => {
  const dynamicPages = await generateDynamicPages();
  const pages = ['/', ...dynamicPages];

  sitemap({
    baseUrl: 'https://decrypt.im',
    pages,
    targetDirectory: 'public',
  });
};

generateSitemap();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  experimental: {
    appDir: true,
    mdxRs: true,
  },
};

export default withContentlayer(nextConfig);
