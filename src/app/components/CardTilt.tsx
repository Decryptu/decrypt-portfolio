"use client";
import type React from "react";
import { type MouseEvent, useMemo, useState } from "react";

function throttle<T extends (...args: never[]) => void>(
	func: T,
	delay: number,
): T {
	let lastCall = 0;
	return ((...args: Parameters<T>) => {
		const now = new Date().getTime();
		if (now - lastCall < delay) {
			return;
		}
		lastCall = now;
		func(...args);
	}) as T;
}

interface RotateState {
	x: number;
	y: number;
}

const CardTilt: React.FC = () => {
	const [rotate, setRotate] = useState<RotateState>({ x: 0, y: 0 });

	const onMouseMove = useMemo(
		() =>
			throttle((e: MouseEvent<HTMLDivElement>) => {
				const card = e.currentTarget;
				const box = card.getBoundingClientRect();
				const x = e.clientX - box.left;
				const y = e.clientY - box.top;
				const centerX = box.width / 2;
				const centerY = box.height / 2;
				const rotateX = (y - centerY) / 4;
				const rotateY = (centerX - x) / 4;

				setRotate({ x: rotateX, y: rotateY });
			}, 100),
		[],
	);

	const onMouseLeave = () => {
		setRotate({ x: 0, y: 0 });
	};

	return (
		<div
			className="card relative h-52 w-52 transition-[all_400ms_cubic-bezier(0.03,0.98,0.52,0.99)_0s] will-change-transform"
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}
			style={{
				transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
				transition: "all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s",
			}}
		>
			<div className="group relative flex h-full w-full select-none items-center justify-center rounded-lg border border-zinc-500 bg-gradient-to-tr from-zinc-600 to-zinc-400 text-sm font-light text-zinc-300">
				<span className="text-md bg-gradient-to-t from-zinc-300 to-white bg-clip-text font-bold text-transparent">
					Hover me
				</span>
			</div>
		</div>
	);
};

export default CardTilt;
