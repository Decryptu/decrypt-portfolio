"use client";

import clsx from "clsx";
import React, { useEffect, useState, useCallback } from "react";

export const Meteors = ({ number }: { number?: number }) => {
	const [meteors, setMeteors] = useState<JSX.Element[]>([]);

	// Memoize the helper function to generate random values
	const getRandomValue = useCallback(
		(min: number, max: number, isInt = false) => {
			const value = Math.random() * (max - min) + min;
			return isInt ? Math.floor(value) : value;
		},
		[],
	);

	useEffect(() => {
		const generatedMeteors = Array.from({ length: number ?? 20 }, (_, index) => (
			<span
				key={`meteor-${index}-${getRandomValue(0, 1000000)}`}
				className={clsx(
					"animate-meteor-effect absolute -top-2 left-1/2 h-0.5 w-0.5 rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
					"before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
				)}
				style={{
					left: `${getRandomValue(-800, 800, true)}px`,
					animationDelay: `${getRandomValue(0.2, 2.8)}s`,
					animationDuration: `${getRandomValue(2, 10, true)}s`,
				}}
			/>
		));
		setMeteors(generatedMeteors);
	}, [number, getRandomValue]); // Now getRandomValue is stable and won't cause the effect to re-run unnecessarily

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{meteors}
		</div>
	);
};
