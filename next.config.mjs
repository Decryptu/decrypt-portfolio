import { withContentlayer } from "next-contentlayer";
import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	experimental: {
		appDir: true,
		mdxRs: true,
	},
	pwa: {
		dest: 'public', // directory where the service worker will be served
		disable: process.env.NODE_ENV === 'development',
		register: true,
		skipWaiting: true,
	}
};

export default withContentlayer(withPWA(nextConfig));
