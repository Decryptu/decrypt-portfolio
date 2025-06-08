"use client";

import { Mdx } from "@/app/components/mdx";

import CardSpotlight from "@/app/components/CardSpotlight";
import CardTilt from "@/app/components/CardTilt";
import { DotPattern } from "@/app/components/DotPattern";
import KeyboardKey from "@/app/components/KeyboardKey";
import { Meteors } from "@/app/components/Meteors";
import { OrbitingCirclesDemo } from "@/app/components/Orbit";

const components = {
	CardSpotlight,
	CardTilt,
	DotPattern,
	KeyboardKey,
	Meteors,
	OrbitingCirclesDemo,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
} as Record<string, React.ComponentType<any>>;

export default function ExperimentMdx({ code }: { code: string }) {
	return <Mdx code={code} components={components} />;
}
