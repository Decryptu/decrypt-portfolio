import { withContentlayer } from "next-contentlayer";
import sitemap from 'nextjs-sitemap-generator';

sitemap({  
  baseUrl: 'https://decrypt.im/',  
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
