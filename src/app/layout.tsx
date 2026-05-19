import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { calSans, geistSans } from "@/lib/fonts";
import { Analytics } from "./components/analytics";
import NavigationBar from "./components/navigation-bar";
import "./global.css";

export const metadata: Metadata = {
  title: {
    default: "Decrypt Portfolio",
    template: "%s | Decrypt",
  },
  description:
    "Independent designer and full-stack developer specializing in graphic design, web design, UI/UX, and web/mobile app development.",
  openGraph: {
    title: "Decrypt Portfolio",
    description:
      "Independent designer and full-stack developer specializing in graphic design, web design, UI/UX, and web/mobile app development.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${geistSans.variable} ${calSans.variable}`} lang="en">
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
