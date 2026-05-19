import Link from "next/link";
import { lazy, Suspense } from "react";
import { Meteors } from "./components/meteors";

const Particles = lazy(() => import("./components/particles"));

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-linear-to-tl from-black via-zinc-600/20 to-black">
      <div className="hidden h-px w-screen animate-fade-left animate-glow bg-linear-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 md:block" />
      <Suspense fallback={<div>Loading...</div>}>
        <Particles
          className="absolute inset-0 -z-10 animate-fade-in"
          quantity={100}
        />
        <Meteors number={10} />
      </Suspense>
      <h1
        className="z-10 animate-title cursor-default whitespace-nowrap bg-white bg-clip-text pb-4 font-display text-6xl text-edge-outline text-transparent duration-1000 sm:text-8xl md:text-9xl"
        style={{ fontFamily: "var(--font-calsans)" }}
      >
        Decrypt
      </h1>
      <div className="hidden h-px w-screen animate-fade-right animate-glow bg-linear-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 md:block" />
      <div className="my-16 animate-fade-in text-center">
        <h2 className="mx-8 text-base text-zinc-500 md:mx-32 lg:mx-80">
          Hello, I am Decrypt, an independent designer and full-stack developer
          with 10+ years of experience across graphic design, web design, UI/UX,
          and web/mobile app development. I currently work with{" "}
          <Link
            className="underline duration-500 hover:text-zinc-300"
            href="https://decrypt.im/projects/defillama"
          >
            DefiLlama
          </Link>{" "}
          &{" "}
          <Link
            className="underline duration-500 hover:text-zinc-300"
            href="https://decrypt.im/projects/defillama"
          >
            LlamaPay
          </Link>
          , and have ongoing collaborations with{" "}
          <Link
            className="underline duration-500 hover:text-zinc-300"
            href="https://decrypt.im/projects/cryptoast"
          >
            Cryptoast
          </Link>{" "}
          &{" "}
          <Link
            className="underline duration-500 hover:text-zinc-300"
            href="https://decrypt.im/projects/adan"
          >
            Adan
          </Link>
          . I am CTO of{" "}
          <Link
            className="underline duration-500 hover:text-zinc-300"
            href="https://decrypt.im/projects/oak"
          >
            OAK Research
          </Link>{" "}
          and founder of{" "}
          <Link
            className="underline duration-500 hover:text-zinc-300"
            href="https://decrypt.im/projects/pandia"
          >
            PandIA
          </Link>
          .
        </h2>
      </div>
    </div>
  );
}
