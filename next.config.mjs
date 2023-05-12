import { withContentlayer } from 'next-contentlayer'
import withPWA from 'next-pwa'

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: {
    appDir: true,
    mdxRs: true,
  },
  pwa: {
    dest: 'public', // this can be set to 'public' or 'static' depending on your preference
  },
}

export default withPWA(withContentlayer(nextConfig))
