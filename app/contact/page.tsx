"use client";
import { Github, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import { Card } from "../components/card";

// Define an interface for the social links
interface SocialLinkProps {
	icon: ReactElement<any>; // Assuming icons are React elements
	href: string;
	handle: string;
	label: string;
}

const socials: SocialLinkProps[] = [
	{
		icon: <Twitter size={20} />,
		href: "https://twitter.com/decrypttv",
		label: "Twitter",
		handle: "@DecryptTV",
	},
	{
		icon: <Mail size={20} />,
		href: "mailto:louis.vicomte@protonmail.com",
		label: "Email",
		handle: "louis.vicomte@proton.me",
	},
	{
		icon: <Github size={20} />,
		href: "https://github.com/Decryptu",
		label: "Github",
		handle: "Decryptu",
	},
];

const containerClasses =
	"p-4 flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24 lg:pb-48 md:p-16";
const iconContainerClasses =
	"relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange";
const handleClasses =
	"text-xl font-medium duration-150 lg:text-3xl text-zinc-200 group-hover:text-white font-display";
const labelClasses =
	"mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200";

const SocialLink: React.FC<SocialLinkProps> = ({
	icon,
	href,
	handle,
	label,
}) => (
	<Card key={handle}>
		<Link href={href} target="_blank" className="relative" legacyBehavior>
			<div className={containerClasses}>
				<span
					className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
					aria-hidden="true"
				/>
				<span className={iconContainerClasses}>{icon}</span>
				<div className="z-10 flex flex-col items-center">
					<span className={handleClasses}>{handle}</span>
					<span className={labelClasses}>{label}</span>
				</div>
			</div>
		</Link>
	</Card>
);

export default function Example() {
	return (
		<div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
			<div className="container flex items-center justify-center min-h-screen px-4 mx-auto">
				<div className="grid w-full grid-cols-1 gap-8 mx-auto mt-16 sm:mt-0 sm:grid-cols-3 lg:gap-16">
					{socials.map((s) => (
						<SocialLink key={s.handle} {...s} />
					))}
				</div>
			</div>
		</div>
	);
}
