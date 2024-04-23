import Link from "next/link";
import React, { memo, Suspense, lazy } from "react";
import { Meteors } from "./components/Meteors";

const Particles = lazy(() => import("./components/particles"));

interface NavigationItem {
  name: string;
  href: string;
}

const navigation: NavigationItem[] = [
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

const Navigation = memo(() => (
  <nav className="my-16 animate-fade-in">
    <ul className="flex items-center justify-center gap-4">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
        >
          {item.name}
        </Link>
      ))}
    </ul>
  </nav>
));

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <Navigation />
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <Suspense fallback={<div>Loading...</div>}>
        <Particles
          className="absolute inset-0 -z-10 animate-fade-in"
          quantity={100}
        />
        <Meteors number={10} />
      </Suspense>
      <h1 className="pb-4 z-10 text-6xl sm:text-8xl md:text-9xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display whitespace-nowrap bg-clip-text">
        Decrypt
      </h1>
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="my-16 text-center animate-fade-in">
        <h2 className="md:text-sm sm:text-base mx-8 md:mx-32 lg:mx-80 text-zinc-500 ">
          Hello, I am Decrypt, a freelance graphic designer and web designer who
          has worked, among others, for{" "}
          <Link
            target="_blank"
            href="https://decrypt.im/projects/cryptoast"
            className="underline duration-500 hover:text-zinc-300"
          >
            Cryptoast
          </Link>
          {" "}&{" "}
          <Link
            target="_blank"
            href="https://decrypt.im/projects/adan"
            className="underline duration-500 hover:text-zinc-300"
          >
            ADAN
          </Link>
          . I am also the founder of{" "}
          <Link
            target="_blank"
            href="https://decrypt.im/projects/pandia"
            className="underline duration-500 hover:text-zinc-300"
          >
            PandIA
          </Link>
          , a media outlet specializing in artificial intelligence.
        </h2>
      </div>
    </div>
  );
}
