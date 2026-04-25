"use client";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { siGithub, siX } from "simple-icons";
import { Meteors } from "../../components/meteors";

interface Props {
  experiment: {
    slugAsParams: string;
    url?: string;
    title: string;
    description: string;
    repository?: string;
  };
  views: number;
}

// Simple icon component that renders simple-icons properly
interface SimpleIconProps {
  readonly className?: string;
  readonly iconData: {
    readonly title: string;
    readonly path: string;
  };
  readonly size?: number;
}

const SimpleIcon = ({
  iconData,
  size = 24,
  className,
}: SimpleIconProps): React.ReactElement => (
  <svg
    aria-label={iconData.title}
    className={className}
    fill="currentColor"
    height={size}
    role="img"
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={iconData.path} />
  </svg>
);

export const Header: React.FC<Props> = ({ experiment, views }) => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);
  const [currentViews, setCurrentViews] = useState(views);

  const links: { label: string; href: string }[] = [];
  if (experiment.repository) {
    links.push({
      label: "Github",
      href: "https://github.com/Decryptu",
    });
  }
  if (experiment.url) {
    links.push({
      label: "Website",
      href: experiment.url,
    });
  }

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ignore = false;

    fetch("/api/incr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: experiment.slugAsParams,
        type: "experiments",
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { views?: number };
        if (!ignore && typeof data.views === "number") {
          setCurrentViews(data.views);
        }
      })
      .catch((error) => {
        console.error("Failed to report view:", error);
      });

    return () => {
      ignore = true;
    };
  }, [experiment.slugAsParams]);

  const iconClasses = `w-6 h-6 duration-200 hover:font-medium ${
    isIntersecting
      ? " text-zinc-400 hover:text-zinc-100"
      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
  }`;

  const linkClasses = `duration-200 hover:font-medium ${
    isIntersecting
      ? " text-zinc-400 hover:text-zinc-100"
      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
  }`;

  return (
    <header
      className="relative isolate z-20 overflow-hidden bg-gradient-to-tl from-black via-zinc-900 to-black"
      ref={ref}
    >
      <Meteors number={5} />
      <div
        className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur duration-200 lg:bg-transparent lg:backdrop-blur-none ${
          isIntersecting
            ? "border-transparent bg-zinc-900/0"
            : "border-zinc-200 bg-white/10 lg:border-transparent dark:border-zinc-600 dark:bg-white/5"
        }`}
      >
        <div className="container mx-auto flex flex-row-reverse items-center justify-between p-6">
          <div className="flex justify-between gap-8">
            <span
              className={`flex items-center gap-1 duration-200 hover:font-medium ${linkClasses}`}
              title="View counter for this page"
            >
              <Eye className="h-5 w-5" />{" "}
              {Intl.NumberFormat("fr-FR", {
                notation: "compact",
              }).format(currentViews)}
            </span>
            <Link href="https://twitter.com/decrypttv" target="_blank">
              <SimpleIcon className={iconClasses} iconData={siX} size={24} />
            </Link>
            <Link href="https://github.com/Decryptu" target="_blank">
              <SimpleIcon
                className={iconClasses}
                iconData={siGithub}
                size={24}
              />
            </Link>
          </div>

          <Link className={linkClasses} href="/experiments">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </div>
      </div>
      <div className="container relative isolate mx-auto overflow-hidden py-24 sm:py-32">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="font-bold font-display text-4xl text-white tracking-tight sm:text-6xl">
              {experiment.title}
            </h1>
            <p className="mt-6 text-lg text-zinc-300 leading-8">
              {experiment.description}
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 font-semibold text-base text-white leading-7 sm:grid-cols-2 md:flex lg:gap-x-10">
              {links.map((link) => (
                <Link href={link.href} key={link.label} target="_blank">
                  {link.label} <span aria-hidden="true">&rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
