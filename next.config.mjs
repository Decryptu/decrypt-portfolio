import { withContentlayer } from "next-contentlayer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { promises as fs } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generateSitemap = async () => {
	const pages = ["/", "/contact", "/projects"];

	const directoryPath = join(__dirname, "content", "projects");
	const files = await fs.readdir(directoryPath);
	const slugs = files.map((file) => file.replace(".mdx", ""));
	const projectPages = slugs.map((slug) => `/projects/${slug}`);

	const allPages = [...pages, ...projectPages];
	const baseUrl = "https://decrypt.im";

	let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

	allPages.forEach((page) => {
		sitemap += `<url>\n<loc>${baseUrl}${page}</loc>\n<lastmod>${new Date().toISOString()}</lastmod>\n</url>\n`;
	});

	sitemap += "</urlset>";

	await fs.writeFile(join(__dirname, "public", "sitemap.xml"), sitemap);
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
