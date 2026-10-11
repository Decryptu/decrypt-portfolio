import type { Metadata } from "next";
import type React from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  description:
    "Get in touch with Decrypt for branding, UI/UX design, web development or custom automation work. Reach out by email, GitHub or X.",
  path: "/contact",
  title: "Contact: Hire an Independent Designer & Developer",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
