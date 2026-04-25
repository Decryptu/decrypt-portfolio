"use client";

import CardSpotlight from "@/app/components/card-spotlight";
import CardTilt from "@/app/components/card-tilt";
import { DotPattern } from "@/app/components/dot-pattern";
import KeyboardKey from "@/app/components/keyboard-key";
import { Mdx } from "@/app/components/mdx";
import { Meteors } from "@/app/components/meteors";
import { OrbitingCirclesDemo } from "@/app/components/orbit";

const components = {
  CardSpotlight,
  CardTilt,
  DotPattern,
  KeyboardKey,
  Meteors,
  OrbitingCirclesDemo,
  // biome-ignore lint/suspicious/noExplicitAny: MDX components receive arbitrary generated props.
} as Record<string, React.ComponentType<any>>;

export default function ExperimentMdx({ code }: { code: string }) {
  return <Mdx code={code} components={components} />;
}
