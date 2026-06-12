"use client";

import clsx from "clsx";
import { type MouseEvent, useEffect, useState } from "react";

interface Heading {
  id: string;
  level: number;
  parent: string;
  text: string;
}

export function Toc() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) {
      return;
    }

    const elements = Array.from(
      article.querySelectorAll<HTMLHeadingElement>("h2, h3, h4")
    ).filter((el) => el.id);

    let currentH3 = "";
    setHeadings(
      elements.map((el) => {
        const level = Number(el.tagName[1]);
        if (level === 3) {
          currentH3 = el.id;
        }
        return {
          id: el.id,
          level,
          parent: currentH3,
          text: el.textContent ?? "",
        };
      })
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    for (const el of elements) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) {
    return null;
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  // The H3 the reader is currently in: only its H4s stay expanded.
  const activeParent = headings.find((h) => h.id === activeId)?.parent ?? "";
  const visible = headings.filter(
    (h) => h.level !== 4 || h.parent === activeParent
  );

  return (
    <nav className="text-sm">
      <p className="mb-3 font-semibold text-zinc-900 dark:text-zinc-100">
        On this page
      </p>
      <ul>
        {visible.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: (heading.level - 2) * 12 }}
          >
            <a
              className={clsx(
                "-ml-px block border-l py-1 pl-3 transition-colors",
                activeId === heading.id
                  ? "border-zinc-900 font-medium text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              )}
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
