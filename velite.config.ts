// velite.config.ts
import { defineConfig, defineCollection, s } from 'velite'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeShiki from '@shikijs/rehype'
import rehypeSlug from 'rehype-slug'

const computedFields = <T extends { slug: string }>(data: T) => ({
  ...data,
  slugAsParams: data.slug.split('/').slice(1).join('/'),
})

const projects = defineCollection({
  name: 'Project',
  pattern: 'projects/**/*.mdx',
  schema: s
    .object({
      slug: s.path(),
      title: s.string(),
      description: s.string(),
      date: s.isodate().optional(),
      published: s.boolean().default(false),
      url: s.string().optional(),
      repository: s.string().optional(),
      tags: s.array(s.string()).optional(),
      icon: s.string().optional(),
      body: s.mdx(),
    })
    .transform(computedFields),
})

const experiments = defineCollection({
  name: 'Experiment',
  pattern: 'experiments/**/*.mdx',
  schema: s
    .object({
      slug: s.path(),
      title: s.string(),
      description: s.string(),
      date: s.isodate().optional(),
      published: s.boolean().default(false),
      url: s.string().optional(),
      repository: s.string().optional(),
      tags: s.array(s.string()).optional(),
      icon: s.string().optional(),
      body: s.mdx(),
    })
    .transform(computedFields),
})

const pages = defineCollection({
  name: 'Page',
  pattern: 'pages/**/*.mdx',
  schema: s
    .object({
      slug: s.path(),
      title: s.string(),
      description: s.string().optional(),
      body: s.mdx(),
    })
    .transform(computedFields),
})

export default defineConfig({
  root: './content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { projects, experiments, pages },
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [
      rehypeSlug,
      [
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        rehypeShiki as any,
        {
          theme: 'github-dark'
        }
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
})