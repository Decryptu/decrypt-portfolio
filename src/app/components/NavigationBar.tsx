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
	] as const;

	const isMobile = () => window.innerWidth < 768 || "ontouchstart" in window;

	return (
		<div
			className={`fixed inset-x-0 bottom-4 flex justify-center items-center navbar-parent transition-opacity duration-1000 ${
				state.isFirstLoad ? "opacity-0" : "opacity-100"
			} animate-fadeIn`}
			style={{ zIndex: 1000 }}
		>
			{/* Gradient stroke wrapper */}
			<div className="p-px bg-gradient-to-br from-zinc-500 from-0% to-zinc-800 to-50% rounded-lg shadow-lg">
				<div className="flex items-center space-x-2 rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-800 p-1">
					{navItems.map(({ path, Icon, label }) => (
						<Link
							key={path}
							href={path}
							className={`relative flex items-center justify-center w-8 h-8 hover:bg-zinc-700/75 rounded-md transition-colors ${
								state.currentPath === path
									? "bg-zinc-700/75 rounded-md"
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
								className={`w-6 h-6 ${
									state.currentPath === path
										? "stroke-zinc-200"
										: "stroke-zinc-50"
								}`}
							/>
							{state.tooltip === label && (
								<span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gradient-to-b from-zinc-800 to-zinc-800 text-zinc-50 text-xs rounded shadow-lg">
									{label}
								</span>
							)}
						</Link>
					))}
					{/* Separator */}
					<div className="w-px h-6 bg-zinc-400" />
					{/* More Options Icon */}
					<button
						ref={ellipsisRef}
						onClick={handleEllipsisClick}
						className="relative flex items-center justify-center w-8 h-8 hover:bg-zinc-700 rounded-md transition-colors"
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
							className="w-6 h-6 stroke-zinc-50"
						/>
						{state.tooltip === "More" && (
							<span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gradient-to-b from-zinc-800 to-zinc-800 text-zinc-50 text-xs rounded shadow-lg">
								More
							</span>
						)}
					</button>
				</div>
			</div>

			{/* Sub Menu */}
			{state.isSubMenuVisible && (
				<div className="absolute bottom-14 left-1/2 transform translate-x-6 shadow-lg">
					{/* Gradient stroke wrapper for submenu */}
					<div className="p-px bg-gradient-to-br from-zinc-600 from-0% to-zinc-800 to-35% rounded-lg">
						<div
							ref={subMenuRef}
							className="bg-gradient-to-b from-zinc-800 to-zinc-800 text-zinc-50 hover:text-zinc-50 rounded-lg py-2"
						>
							<SubMenuLink href="https://twitter.com/DecryptTV" label="Twitter" />
							<SubMenuLink href="https://github.com/Decryptu" label="GitHub" />
							<SubMenuLink href="https://dribbble.com/Decrypt" label="Dribbble" />
						</div>
					</div>
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
		className="flex items-center justify-center px-2 mx-2 py-2 hover:bg-zinc-700/75 hover:text-zinc-50 rounded-md transition-colors"
	>
		{label}
		<ArrowUpRight strokeWidth={1.25} className="ml-1 w-4 h-4" />
	</a>
);

export default NavigationBar;