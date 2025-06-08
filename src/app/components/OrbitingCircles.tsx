"use client";

export default function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  delay = 10,      // seconds
  radius = 50,     // pixels
  path = true,
}: {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
}) {
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <title>Orbit path</title>
          <circle
            className="stroke-zinc-500/25 stroke-1"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            strokeDasharray="4 4"
          />
        </svg>
      )}

      <div
        style={{
          "--duration": duration,
          "--radius": radius,
          animationDelay: `-${delay}s`,
        } as React.CSSProperties}
        className={`
          absolute flex h-full w-full
          [will-change:transform]
          ${reverse ? "animate-orbit-reverse" : "animate-orbit"}
          items-center justify-center rounded-full
          text-zinc-600
          ${className ?? ""}
        `}
      >
        {children}
      </div>
    </>
  );
}