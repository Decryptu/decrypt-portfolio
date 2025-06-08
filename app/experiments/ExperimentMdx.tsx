"use client";

import { Mdx } from "@/app/components/mdx";

// ———————————————————————————————
//  All components used by experiments
// ———————————————————————————————
import CardSpotlight         from "@/app/components/CardSpotlight";
import CardTilt              from "@/app/components/CardTilt";
import { DotPattern }        from "@/app/components/DotPattern";
import KeyboardKey           from "@/app/components/KeyboardKey";
import { Meteors }           from "@/app/components/Meteors";
import { OrbitingCirclesDemo } from "@/app/components/Orbit";

// loosen the type so TS won't complain about props
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