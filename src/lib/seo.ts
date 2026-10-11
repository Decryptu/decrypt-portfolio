import type { Metadata } from "next";

const siteName = "Decrypt Portfolio";
const defaultImage = {
  height: 1080,
  url: "https://decrypt.im/og.png",
  width: 1920,
};

interface PageMetadataInput {
  description: string;
  path: string;
  title: string;
}

export function pageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const fullTitle = `${title} | ${siteName}`;

  return {
    alternates: { canonical: path },
    description,
    openGraph: {
      description,
      images: [defaultImage],
      locale: "en-US",
      siteName: "decrypt.im",
      title: fullTitle,
      type: "website",
      url: path,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [defaultImage.url],
      title: fullTitle,
    },
  };
}
