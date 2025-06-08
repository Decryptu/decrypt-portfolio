"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import * as runtime from "react/jsx-runtime";
import ClickableImage from "./ClickableImage";
import CodeBlock from "./CodeBlock";

import type { JSX } from "react";

interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
	className?: string;
}

// Define a new interface for Link props that includes the href property
interface LinkProps extends ComponentProps {
	href: string; // Making href a required property
}

// Define the Callout component
interface CalloutProps {
	emoji: string;
	children: React.ReactNode;
	variant?: "default" | "danger"; // Define allowable variants
}

const Callout: React.FC<CalloutProps> = ({
	emoji,
	children,
	variant = "default",
}) => {
	// Define base styles
	const baseStyles = "px-4 rounded p-1 text-sm flex items-center mb-8";

	// Conditional styling based on the variant
	const variantStyles = {
		default:
			"border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100",
		danger:
			"border border-red-500 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-100",
	};

	// Select the correct variant style, defaulting to 'default'
	return (
		<div className={`${baseStyles} ${variantStyles[variant]}`}>
			<div className="flex items-center w-4 mr-4">{emoji}</div>
			<div className="w-full callout">{children}</div>
		</div>
	);
};

function createHeading(type: keyof JSX.IntrinsicElements, style: string) {
	return ({ className, ...props }: ComponentProps) =>
		React.createElement(type, {
			className: clsx(style, className),
			...props,
		});
}

function clsx(...args: (string | undefined | null)[]) {
	return args.filter(Boolean).join(" ");
}

const sharedComponents = {
	h1: createHeading("h1", "mt-2 scroll-m-20 text-4xl font-bold tracking-tight"),
	h2: createHeading(
		"h2",
		"mt-10 scroll-m-20 border-b border-b-zinc-800 pb-1 text-3xl font-semibold tracking-tight first:mt-0",
	),
	h3: createHeading(
		"h3",
		"mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
	),
	h4: createHeading(
		"h4",
		"mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
	),
	h5: createHeading(
		"h5",
		"mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
	),
	h6: createHeading(
		"h6",
		"mt-8 scroll-m-20 text-base font-semibold tracking-tight",
	),
	a: ({ className, href, ...props }: LinkProps) => (
		<Link
			href={href}
			className={`font-medium text-zinc-900 underline underline-offset-4 ${className || ""}`}
			{...props}
		/>
	),
	p: ({ className, ...props }: ComponentProps) => (
		<p
			className={clsx("leading-7 [&:not(:first-child)]:mt-6", className)}
			{...props}
		/>
	),
	ul: ({ className, ...props }: ComponentProps) => (
		<ul className={clsx("my-6 ml-6 list-disc", className)} {...props} />
	),
	ol: ({ className, ...props }: ComponentProps) => (
		<ol className={clsx("my-6 ml-6 list-decimal", className)} {...props} />
	),
	li: ({ className, ...props }: ComponentProps) => (
		<li className={clsx("mt-2", className)} {...props} />
	),
	blockquote: ({ className, ...props }: ComponentProps) => (
		<blockquote
			className={clsx(
				"mt-6 border-l-2 border-zinc-300 pl-6 italic text-zinc-800 [&>*]:text-zinc-600",
				className,
			)}
			{...props}
		/>
	),
	img: ({
		src,
		...props
	}: React.ImgHTMLAttributes<HTMLImageElement> & {
		src: string;
	}) => <ClickableImage src={src || ""} alt={props.alt} />,
	hr: ({ ...props }) => (
		<hr className="my-4 border-zinc-200 md:my-8" {...props} />
	),
	table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
		<div className="w-full my-6 overflow-y-auto">
			<table className={clsx("w-full", className)} {...props} />
		</div>
	),
	tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
		<tr
			className={clsx(
				"m-0 border-t border-zinc-300 p-0 even:bg-zinc-100 dark:even:bg-zinc-900",
				className,
			)}
			{...props}
		/>
	),
	th: ({ className, ...props }: ComponentProps) => (
		<th
			className={clsx(
				"border border-zinc-200 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		/>
	),
	td: ({ className, ...props }: ComponentProps) => (
		<td
			className={clsx(
				"border border-zinc-200 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		/>
	),
	pre: CodeBlock,
	code: ({ className, ...props }: ComponentProps) => (
		<code
			className={clsx(
				"relative rounded py-[0.2rem] px-[0.3rem] font-light font-mono text-sm text-zinc-600 dark:text-zinc-400",
				className,
			)}
			{...props}
		/>
	),
	Image,
	Callout,
};

// parse the Velite generated MDX code into a React component function
const useMDXComponent = (code: string) => {
	const fn = new Function(code);
	return fn({ ...runtime }).default;
};

interface MDXProps {
	code: string;
	components?: Record<string, React.ComponentType>;
}

// MDXContent component
export const Mdx = ({ code, components }: MDXProps) => {
	const Component = useMDXComponent(code);
	return <Component components={{ ...sharedComponents, ...components }} />;
};
