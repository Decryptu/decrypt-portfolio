import { useMDXComponent } from "next-contentlayer/hooks";
import Image from "next/image";
import Link from "next/link";
import type * as React from "react";
import ClickableImage from "./ClickableImage";

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
  variant?: 'default' | 'danger'; // Define allowable variants
}

const Callout: React.FC<CalloutProps> = ({ emoji, children, variant = 'default' }) => {
  // Define base styles
  const baseStyles = "px-4 rounded p-1 text-sm flex items-center mb-8";

  // Conditional styling based on the variant
  const variantStyles = {
    default: "border border-neutral-200 bg-neutral-50 text-neutral-900",
    danger: "border border-red-500 bg-red-100 text-red-800",
  };

  // Select the correct variant style, defaulting to 'default'
  const style = `${baseStyles} ${variantStyles[variant]}`;

  return (
    <div className={style}>
      <div className="flex items-center w-4 mr-4">{emoji}</div>
      <div className="w-full callout">{children}</div>
    </div>
  );
};

function clsx(...args: (string | undefined | null)[]) {
  return args.filter(Boolean).join(" ");
}
const components = {
  h1: ({ className, ...props }: ComponentProps) => (
    <h1
      className={clsx(
        "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: ComponentProps) => (
    <h2
      className={clsx(
        "mt-10 scroll-m-20 border-b border-b-zinc-800 pb-1 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentProps) => (
    <h3
      className={clsx(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: ComponentProps) => (
    <h4
      className={clsx(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: ComponentProps) => (
    <h5
      className={clsx(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: ComponentProps) => (
    <h6
      className={clsx(
        "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, href, ...props }: LinkProps) => (
    <Link href={href} passHref legacyBehavior>
      <a
        className={clsx(
          "font-medium text-zinc-900 underline underline-offset-4",
          className
        )}
        {...props}
      />
    </Link>
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
        className
      )}
      {...props}
    />
  ),
  img: ({
    src,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => (
    <ClickableImage src={src || ""} alt={props.alt} />
  ),
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
        "m-0 border-t border-zinc-300 p-0 even:bg-zinc-100",
        className
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }: ComponentProps) => (
    <th
      className={clsx(
        "border border-zinc-200 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: ComponentProps) => (
    <td
      className={clsx(
        "border border-zinc-200 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: ComponentProps) => (
    <pre
      className={clsx(
        "mt-6 mb-4 overflow-x-auto rounded-lg bg-zinc-900 py-4",
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: ComponentProps) => (
    <code
      className={clsx(
        "relative rounded border bg-zinc-300 bg-opacity-25 py-[0.2rem] px-[0.3rem] font-mono text-sm text-zinc-600",
        className
      )}
      {...props}
    />
  ),
  Image,
  Callout,
};

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);

  return (
    <div className="mdx">
      <Component components={components as any} />
    </div>
  );
}
