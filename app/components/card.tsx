"use client";

import React, { useCallback, type PropsWithChildren } from "react";
import { motion, useSpring, useMotionTemplate } from "framer-motion";
import { throttle } from "lodash";

export const Card: React.FC<PropsWithChildren> = React.memo(({ children }) => {
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

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
    <div
      onMouseMove={onMouseMove}
      className="overflow-hidden relative z-0 duration-700 border rounded-xl hover:bg-zinc-800/10 group md:gap-8 hover:border-zinc-400/50 border-zinc-600"
    >
      <div className="pointer-events-none">
        <div className="absolute inset-0 z-0 transition duration-1000 [mask-image:linear-gradient(black,transparent)]" />
        <motion.div
          className="absolute inset-0 z-1 bg-gradient-to-br opacity-100 via-zinc-100/10 transition duration-1000 group-hover:opacity-50"
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
