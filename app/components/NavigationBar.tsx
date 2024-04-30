"use client";

import {
	ArrowUpRight,
	BriefcaseBusiness,
	Contact,
	Ellipsis,
	FlaskConical,
	Home,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NavigationBar = () => {
	const [state, setState] = useState<{
		currentPath: string;
		isSubMenuVisible: boolean;
		isFirstLoad: boolean;
		tooltip: string | null;
	}>({
		currentPath: "/",
		isSubMenuVisible: false,
		isFirstLoad: true,
		tooltip: null,
	});
	const ellipsisRef = useRef<HTMLButtonElement>(null);
	const subMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setState((prev) => ({
				...prev,
				currentPath: window.location.pathname,
				isFirstLoad: false,
			}));
		}
	}, []);

	const handleLinkClick = (path: string) =>
		setState((prev) => ({ ...prev, currentPath: path }));
	const handleEllipsisClick = () =>
		setState((prev) => ({
			...prev,
			isSubMenuVisible: !prev.isSubMenuVisible,
		}));

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				subMenuRef.current &&
				ellipsisRef.current &&
				!subMenuRef.current.contains(event.target as Node) &&
				!ellipsisRef.current.contains(event.target as Node)
			) {
				setState((prev) => ({
					...prev,
					isSubMenuVisible: false,
				}));
			}
		};

		if (state.isSubMenuVisible) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [state.isSubMenuVisible]);

	const navItems = [
		{ path: "/", Icon: Home, label: "Home" },
		{
			path: "/projects",
			Icon: BriefcaseBusiness,
			label: "Projects",
		},
		{
			path: "/experiments",
			Icon: FlaskConical,
			label: "Laboratory",
		},
		{ path: "/contact", Icon: Contact, label: "Contact" },
	];

	const isMobile = () => window.innerWidth < 768 || "ontouchstart" in window;

	return (
		<div
			className={`fixed inset-x-0 bottom-4 flex justify-center items-center navbar-parent transition-opacity duration-1000 ${
				state.isFirstLoad ? "opacity-0" : "opacity-100"
			} animate-fadeIn`}
			style={{ zIndex: 1000 }}
		>
			<div className="flex items-center space-x-2 rounded-lg border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-900 bg-white p-1 shadow-[0_3px_10px_rgb(0,0,0,0.1)] dark:shadow-[0_3px_10px_rgb(0,0,0,0.5)]">
				{navItems.map(({ path, Icon, label }) => (
					<Link key={path} href={path} passHref legacyBehavior>
						<a
							className={`relative flex items-center justify-center w-8 h-8 dark:hover:bg-zinc-800 hover:bg-zinc-200 rounded-md ${
								state.currentPath === path
									? "bg-zinc-200 dark:bg-zinc-950 rounded-md"
									: ""
							}`}
							onMouseEnter={() =>
								!isMobile() &&
								setState((prev) => ({
									...prev,
									tooltip: label,
								}))
							}
							onMouseLeave={() =>
								setState((prev) => ({
									...prev,
									tooltip: null,
								}))
							}
							onClick={() => handleLinkClick(path)}
						>
							<Icon
								strokeWidth={1.25}
								className="w-6 h-6 dark:stroke-zinc-100 stroke-zinc-950"
							/>
							{state.tooltip === label && (
								<span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 dark:bg-zinc-900 dark:text-white bg-zinc-50 text-zinc-900 text-xs rounded shadow-lg">
									{label}
								</span>
							)}
						</a>
					</Link>
				))}
				{/* Separator */}
				<div className="w-px h-6 dark:bg-zinc-500 bg-zinc-200" />
				{/* More Options Icon */}
				<button
					ref={ellipsisRef}
					onClick={handleEllipsisClick}
					className="relative flex items-center justify-center w-8 h-8 dark:hover:bg-zinc-800 hover:bg-zinc-200 rounded-md"
					onMouseEnter={() =>
						!isMobile() &&
						setState((prev) => ({
							...prev,
							tooltip: "More",
						}))
					}
					onMouseLeave={() => setState((prev) => ({ ...prev, tooltip: null }))}
					type="button"
				>
					<Ellipsis
						strokeWidth={1.5}
						className="w-6 h-6 dark:stroke-zinc-100 stroke-zinc-950"
					/>
					{state.tooltip === "More" && (
						<span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 dark:bg-zinc-900 dark:text-white bg-zinc-50 text-zinc-900 text-xs rounded shadow-lg">
							More
						</span>
					)}
				</button>
			</div>

			{/* Sub Menu */}
			{state.isSubMenuVisible && (
				<div
					ref={subMenuRef}
					className="absolute bottom-14 left-1/2 transform translate-x-6 border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-900 dark:text-zinc-50 bg-zinc-50 text-zinc-950 rounded-lg shadow-2xl py-2"
				>
					<SubMenuLink href="https://twitter.com/DecryptTV" label="Twitter" />
					<SubMenuLink href="https://github.com/Decryptu" label="GitHub" />
					<SubMenuLink href="https://dribbble.com/Decrypt" label="Dribbble" />
				</div>
			)}
		</div>
	);
};

const SubMenuLink = ({ href, label }: { href: string; label: string }) => (
	<a
		href={href}
		target="_blank"
		rel="noopener noreferrer"
		className="flex items-center justify-center px-2 mx-2 py-2 dark:hover:bg-zinc-800 hover:bg-zinc-200 rounded-md"
	>
		{label}
		<ArrowUpRight strokeWidth={1.25} className="ml-1 w-4 h-4" />
	</a>
);

export default NavigationBar;
