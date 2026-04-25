"use client";

import { CircleCheck, Clipboard } from "lucide-react";
import React, { useState } from "react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
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
        const element = node as React.ReactElement<{
          children?: React.ReactNode;
        }>;
        if (element.props && "children" in element.props) {
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
    <div className="group relative">
      <button
        aria-label="Copy code to clipboard"
        className="absolute top-2 right-2 z-20 rounded bg-zinc-800 p-1 text-white opacity-0 transition-opacity hover:bg-zinc-700 focus:opacity-100 group-hover:opacity-100"
        onClick={() => copyToClipboard(extractText(children))}
        title="Copy to Clipboard"
        type="button"
      >
        <Icon className="h-5 w-5" />
      </button>

      <pre
        className={`mt-6 mb-4 overflow-x-auto rounded-lg bg-zinc-900 px-4 py-4 ${
          className || ""
        } relative z-10`}
      >
        <code className="block w-full overflow-x-auto whitespace-pre text-zinc-100">
          {children}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
