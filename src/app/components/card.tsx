"use client";

import { motion, useMotionTemplate, useSpring } from "framer-motion";
import { throttle } from "lodash";
import React, { type PropsWithChildren, useCallback } from "react";

export const Card: React.FC<PropsWithChildren> = React.memo(({ children }) => {
  const mouseX = useSpring(0, {
    stiffness: 500,
    damping: 100,
  });
  const mouseY = useSpring(0, {
    stiffness: 500,
    damping: 100,
  });

  // Create a throttled onMouseMove handler
  const onMouseMove = useCallback(
    throttle((event: React.MouseEvent<HTMLDivElement>) => {
      const { currentTarget, clientX, clientY } = event;
      // Check if currentTarget is still part of the DOM
      if (currentTarget && document.body.contains(currentTarget)) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
      }
    }, 50),
    [] // Remove mouseX and mouseY from dependency array
  ); // Throttle the updates to reduce re-renders

  const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: Mouse movement only drives decorative card lighting.
    // biome-ignore lint/a11y/noStaticElementInteractions: Mouse movement only drives decorative card lighting.
    <div
      className="group relative z-0 overflow-hidden rounded-xl border border-zinc-600 duration-700 hover:border-zinc-400/50 hover:bg-zinc-800/10 md:gap-8"
      onMouseMove={onMouseMove}
    >
      <div className="pointer-events-none">
        <div className="absolute inset-0 z-0 transition duration-1000 [mask-image:linear-gradient(black,transparent)]" />
        <motion.div
          className="absolute inset-0 z-1 bg-gradient-to-br via-zinc-100/10 opacity-100 transition duration-1000 group-hover:opacity-50"
          style={style}
        />
        <motion.div
          className="absolute inset-0 z-1 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100"
          style={style}
        />
      </div>
      {children}
    </div>
  );
});

export default Card; // Export default if you are using this component across your app
