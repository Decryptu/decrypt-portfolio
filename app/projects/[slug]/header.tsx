// app/projects/[slug]/header.tsx
"use client";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { siGithub, siX } from "simple-icons";
import { Meteors } from "../../components/Meteors";

type Props = {
	project: {
		url?: string;
		title: string;
		description: string;
		repository?: string;
	};
	views: number;
};

// Simple icon component that renders simple-icons properly
interface SimpleIconProps {
	readonly iconData: {
		readonly title: string;
		readonly path: string;
	};
	readonly size?: number;
	readonly className?: string;
}

const SimpleIcon = ({ iconData, size = 24, className }: SimpleIconProps): React.ReactElement => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
		role="img"
		aria-label={iconData.title}
		className={className}
	>
		<path d={iconData.path} />
	</svg>
);

export const Header: React.FC<Props> = ({ project, views }) => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);

	const links: { label: string; href: string }[] = [];
	if (project.repository) {
		links.push({
			label: "Github",
			href: "https://github.com/Decryptu",
		});
	}
	if (project.url) {
		links.push({
			label: "Website",
			href: project.url,
		});
	}

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

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
			ref={ref}
			className="relative z-20 isolate overflow-hidden bg-gradient-to-tl from-black via-zinc-900 to-black"
		>
			<Meteors number={5} />
			<div
				className={`fixed inset-x-0 top-0 z-50 backdrop-blur lg:backdrop-blur-none duration-200 border-b lg:bg-transparent ${
					isIntersecting
						? "bg-zinc-900/0 border-transparent"
						: "bg-white/10 dark:bg-white/5  border-zinc-200 dark:border-zinc-600 lg:border-transparent"
				}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
					<div className="flex justify-between gap-8">
						<span
							title="View counter for this page"
							className={`duration-200 hover:font-medium flex items-center gap-1 ${linkClasses}`}
						>
							<Eye className="w-5 h-5" />{" "}
							{Intl.NumberFormat("fr-FR", {
								notation: "compact",
							}).format(views)}
						</span>
						<Link target="_blank" href="https://twitter.com/decrypttv">
							<SimpleIcon 
								iconData={siX} 
								size={24} 
								className={iconClasses}
							/>
						</Link>
						<Link target="_blank" href="https://github.com/Decryptu">
							<SimpleIcon 
								iconData={siGithub} 
								size={24} 
								className={iconClasses}
							/>
						</Link>
					</div>

					<Link
						href="/projects"
						className={linkClasses}
					>
						<ArrowLeft className="w-6 h-6 " />
					</Link>
				</div>
			</div>
			<div className="container mx-auto relative isolate overflow-hidden  py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-display">
							{project.title}
						</h1>
						<p className="mt-6 text-lg leading-8 text-zinc-300">
							{project.description}
						</p>
					</div>

					<div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
						<div className="grid grid-cols-1 gap-y-6 gap-x-8 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
							{links.map((link) => (
								<Link target="_blank" key={link.label} href={link.href}>
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