import { withContentlayer } from "next-contentlayer";
import sitemap from 'nextjs-sitemap-generator';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

sitemap({  
  baseUrl: 'https://decrypt.im',  
  pagesDirectory: __dirname + "/pages",  
  targetDirectory : 'public/'  
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  experimental: {
    appDir: true,
    mdxRs: true,
  },
};

export default withContentlayer(nextConfig);
