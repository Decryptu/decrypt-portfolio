import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createConfig = async (): Promise<NextConfig> => {
  // Velite integration for Next.js 16
  // In Next.js 16, process.argv checking for 'dev' returns false
  // Use NODE_ENV instead
  const isDev = process.env.NODE_ENV === "development";
  const isBuild = process.env.NODE_ENV === "production";

  if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
    process.env.VELITE_STARTED = "1";
    const { build } = await import("velite");
    await build({ watch: isDev, clean: !isDev });
  }

  return {
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    experimental: {
      mdxRs: true,
    },
    turbopack: {
      root: __dirname,
    },
  };
};

export default createConfig;
