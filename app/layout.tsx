import "../global.css";
import { Inter } from "@next/font/google";
import LocalFont from "@next/font/local";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";

export const metadata: Metadata = {
	title: {
		default: "Decrypt",
		template: "%s | Decrypt",
	},
	description: "Freelance graphic designer and web designer, founder of pandia.pro",
	openGraph: {
		title: "Decrypt",
		description:
			"Freelance graphic designer and web designer, founder of pandia.pro",
		url: "https://decrypt.im/",
		siteName: "decrypt.im",
		images: [
			{
				url: "https://decrypt.im/og.png",
				width: 1920,
				height: 1080,
			},
		],
		locale: "en-US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	twitter: {
		title: "Decrypt",
		card: "summary_large_image",
	},
	icons: {
		shortcut: "/favicon.png",
	},
};
const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const calSans = LocalFont({
	src: "../public/fonts/CalSans-SemiBold.ttf",
	variable: "--font-calsans",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
			<body
				className={`bg-black ${
					process.env.NODE_ENV === "development" ? "debug-screens" : undefined
				}`}
			>
				<Analytics />
				{children}
			</body>
		</html>
	);
}
