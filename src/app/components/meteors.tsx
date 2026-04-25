"use client";

import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";

interface Meteor {
  animationDelay: string;
  animationDuration: string;
  id: string;
  left: string;
}

export const Meteors = ({ number }: { number?: number }) => {
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  const getRandomValue = useCallback(
    (min: number, max: number, isInt = false) => {
      const value = Math.random() * (max - min) + min;
      return isInt ? Math.floor(value) : value;
    },
    []
  );

  useEffect(() => {
    const generatedMeteors = Array.from({ length: number ?? 20 }, () => ({
      id: crypto.randomUUID(),
      left: `${getRandomValue(-800, 800, true)}px`,
      animationDelay: `${getRandomValue(0.2, 2.8)}s`,
      animationDuration: `${getRandomValue(2, 10, true)}s`,
    }));
    setMeteors(generatedMeteors);
  }, [number, getRandomValue]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {meteors.map((meteor) => (
        <span
          className={clsx(
            "absolute -top-2 left-1/2 h-0.5 w-0.5 animate-meteor-effect rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
            "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']"
          )}
          key={meteor.id}
          style={{
            left: meteor.left,
            animationDelay: meteor.animationDelay,
            animationDuration: meteor.animationDuration,
          }}
        />
      ))}
    </div>
  );
};
