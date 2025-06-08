// app/contact/page.tsx
"use client";
import { Mail } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import { siGithub, siX } from "simple-icons";
import { Card } from "../components/card";

// Simple icon component that renders simple-icons properly
interface SimpleIconProps {
	readonly iconData: {
		readonly title: string;
		readonly path: string;
	};
	readonly size?: number;
}

const SimpleIcon = ({ iconData, size = 20 }: SimpleIconProps): ReactElement => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
		role="img"
		aria-label={iconData.title}
	>
		<path d={iconData.path} />
	</svg>
);

// Define a proper interface for the social links with strict typing
interface SocialLinkProps {
	readonly icon: ReactElement;
	readonly href: string;
	readonly handle: string;
	readonly label: string;
}

const socials: readonly SocialLinkProps[] = [
	{
		icon: <SimpleIcon iconData={siX} size={20} />,
		href: "https://x.com/decrypttv",
		label: "X (Twitter)",
		handle: "@DecryptTV",
	},
	{
		icon: <Mail size={20} />,
		href: "mailto:louis.vicomte@protonmail.com",
		label: "Email",
		handle: "louis.vicomte@proton.me",
	},
	{
		icon: <SimpleIcon iconData={siGithub} size={20} />,
		href: "https://github.com/Decryptu",
		label: "GitHub",
		handle: "Decryptu",
	},
] as const;

const containerClasses =
	"p-4 flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24 lg:pb-48 md:p-16" as const;
const iconContainerClasses =
	"relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange" as const;
const handleClasses =
	"text-xl font-medium duration-150 lg:text-3xl text-zinc-200 group-hover:text-white font-display" as const;
const labelClasses =
	"mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200" as const;

const SocialLink = ({
	icon,
	href,
	handle,
	label,
}: SocialLinkProps): ReactElement => (
	<Card>
		<Link href={href} target="_blank" className="relative">
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

export default function ContactPage(): ReactElement {
	return (
		<div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
			<div className="container flex items-center justify-center min-h-screen px-4 mx-auto">
				<div className="grid w-full grid-cols-1 gap-8 mx-auto mt-16 sm:mt-0 sm:grid-cols-3 lg:gap-16">
					{socials.map((social) => (
						<SocialLink key={social.handle} {...social} />
					))}
				</div>
			</div>
		</div>
	);
}
