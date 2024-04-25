"use client";

import React, { useState } from "react";
import { Clipboard, CircleCheck } from "lucide-react";

const CodeBlock: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);

  // Recursive function to extract text from React nodes
  const extractText = (nodes: React.ReactNode): string => {
    let text = "";
    React.Children.forEach(nodes, (node) => {
      if (typeof node === "string") {
        text += node;
      } else if (
        React.isValidElement(node) &&
        node.props &&
        node.props.children
      ) {
        text += extractText(node.props.children);
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
          onClick={() => copyToClipboard(extractText(children))}
          className={`absolute right-2 top-2 rounded text-white bg-zinc-800 p-1 z-20`}
          title="Copy to Clipboard"
        >
          <Icon className="w-5 h-5" />
        </button>
      )}

      <pre
        className={`mt-6 mb-4 overflow-x-auto rounded-lg bg-zinc-900 py-4 ${className} relative z-10`}
      >
        <code className="block w-full whitespace-pre overflow-x-auto">
          {children}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
