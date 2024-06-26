import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
	path: {
		type: "string",
		resolve: (doc) => `/${doc._raw.flattenedPath}`,
	},
	slug: {
		type: "string",
		resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
	},
};

const baseFields = {
	published: {
		type: "boolean",
	},
	title: {
		type: "string",
		required: true,
	},
	description: {
		type: "string",
		required: true,
	},
	date: {
		type: "date",
	},
	url: {
		type: "string",
	},
	repository: {
		type: "string",
	},
	tags: {
		type: "list",
		of: { type: "string" },
	},
	icon: {
		type: "string",
	},
};

export const Project = defineDocumentType(() => ({
	name: "Project",
	filePathPattern: "projects/**/*.mdx",
	contentType: "mdx",
	fields: baseFields,
	computedFields,
}));

export const Experiment = defineDocumentType(() => ({
	name: "Experiment",
	filePathPattern: "experiments/**/*.mdx",
	contentType: "mdx",
	fields: baseFields,
	computedFields,
}));

export const Page = defineDocumentType(() => ({
	name: "Page",
	filePathPattern: "pages/**/*.mdx",
	contentType: "mdx",
	fields: {
		title: {
			type: "string",
			required: true,
		},
		description: {
			type: "string",
		},
	},
	computedFields,
}));

export default makeSource({
	contentDirPath: "./content",
	documentTypes: [Page, Project, Experiment],
	mdx: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [
			rehypeSlug,
			[
				rehypePrettyCode,
				{
					theme: "github-dark",
					onVisitLine(node) {
						if (node.children.length === 0) {
							node.children = [{ type: "text", value: " " }];
						}
					},
					onVisitHighlightedLine(node) {
						node.properties.className.push("line--highlighted");
					},
					onVisitHighlightedWord(node) {
						node.properties.className = ["word--highlighted"];
					},
				},
			],
			[
				rehypeAutolinkHeadings,
				{
					properties: {
						className: ["subheading-anchor"],
						ariaLabel: "Link to section",
					},
				},
			],
		],
	},
});
