import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import "./global.css";
import NavigationBar from "./components/NavigationBar";
import { Analytics } from "./components/analytics";

export const metadata: Metadata = {
	title: {
		default: "Decrypt Portfolio",
		template: "%s | Decrypt",
	},
	description:
		"Freelance graphic and web designer at pandia.pro, specializing in UX/UI design and front-end development.",
	openGraph: {
		title: "Decrypt Portfolio",
		description:
			"Freelance graphic and web designer at pandia.pro, specializing in UX/UI design and front-end development.",
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
				<NavigationBar />
				<Analytics />
				<SpeedInsights />
				{children}
			</body>
		</html>
	);
}
