"use client";

import { CircleCheck, Clipboard } from "lucide-react";
import React, { useState } from "react";

interface CodeBlockProps {
	children: React.ReactNode;
	className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
	const [hover, setHover] = useState(false);
	const [copied, setCopied] = useState(false);

	// Recursive function to extract text from React nodes with proper type checking
	const extractText = (nodes: React.ReactNode): string => {
		let text = "";
		React.Children.forEach(nodes, (node) => {
			if (typeof node === "string") {
				text += node;
			} else if (typeof node === "number") {
				text += node.toString();
			} else if (React.isValidElement(node)) {
				// Type-safe way to check for children property
				const element = node as React.ReactElement<{ children?: React.ReactNode }>;
				if (element.props && 'children' in element.props) {
					text += extractText(element.props.children);
				}
			}
		});
		return text;
	};

	// Function to copy code to clipboard
	const copyToClipboard = async (code: string) => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000); // Change the icon back after 2 seconds
		} catch (err) {
			console.error("Failed to copy code", err);
		}
	};

	// Select the icon based on the copied state
	const Icon = copied ? CircleCheck : Clipboard;

	return (
		<div
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			className="relative group"
		>
			{hover && (
				<button
					type="button"
					onClick={() => copyToClipboard(extractText(children))}
					className="absolute right-2 top-2 rounded text-white bg-zinc-800 p-1 z-20 hover:bg-zinc-700 transition-colors"
					title="Copy to Clipboard"
					aria-label="Copy code to clipboard"
				>
					<Icon className="w-5 h-5" />
				</button>
			)}

			<pre
				className={`mt-6 mb-4 overflow-x-auto rounded-lg bg-zinc-900 py-4 px-4 ${
					className || ""
				} relative z-10`}
			>
				<code className="block w-full whitespace-pre overflow-x-auto text-zinc-100">
					{children}
				</code>
			</pre>
		</div>
	);
};

export default CodeBlock;