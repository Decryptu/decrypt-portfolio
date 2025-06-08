// app/components/particles.tsx
"use client";

import { useMousePosition } from "@/util/mouse";
import React, { useRef, useEffect, useCallback } from "react";

// Define the Circle type outside the component for reusability and clarity.
type Circle = {
	x: number;
	y: number;
	translateX: number;
	translateY: number;
	size: number;
	alpha: number;
	targetAlpha: number;
	dx: number;
	dy: number;
	magnetism: number;
};

// This is a pure utility function, so it can live outside the component.
const remapValue = (
	value: number,
	start1: number,
	end1: number,
	start2: number,
	end2: number,
): number => {
	const remapped =
		((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
	return remapped > 0 ? remapped : 0;
};

interface ParticlesProps {
	className?: string;
	quantity?: number;
	staticity?: number;
	ease?: number;
	refresh?: boolean;
}

export default function Particles({
	className = "",
	quantity = 30,
	staticity = 50,
	ease = 50,
	refresh = false,
}: ParticlesProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const context = useRef<CanvasRenderingContext2D | null>(null);
	// ✨ FIX: Use the Circle type instead of `any` for type safety.
	const circles = useRef<Circle[]>([]);
	const mousePosition = useMousePosition();
	const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
	const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

	// Memoize functions to prevent them from being recreated on every render.
	// This stabilizes their references, making them safe to use as dependencies in useEffect hooks.

	const clearContext = useCallback(() => {
		if (context.current) {
			context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
		}
	}, []);

	const drawCircle = useCallback(
		(circle: Circle, update = false) => {
			if (context.current) {
				const { x, y, translateX, translateY, size, alpha } = circle;
				context.current.translate(translateX, translateY);
				context.current.beginPath();
				context.current.arc(x, y, size, 0, 2 * Math.PI);
				context.current.fillStyle = `rgba(255, 255, 255, ${alpha})`;
				context.current.fill();
				context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

				if (!update) {
					circles.current.push(circle);
				}
			}
		},
		[dpr],
	);

	const circleParams = useCallback((): Circle => {
		const x = Math.floor(Math.random() * canvasSize.current.w);
		const y = Math.floor(Math.random() * canvasSize.current.h);
		return {
			x,
			y,
			translateX: 0,
			translateY: 0,
			size: Math.floor(Math.random() * 2) + 0.1,
			alpha: 0,
			targetAlpha: Number.parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
			dx: (Math.random() - 0.5) * 0.2,
			dy: (Math.random() - 0.5) * 0.2,
			magnetism: 0.1 + Math.random() * 4,
		};
	}, []);

	const drawParticles = useCallback(() => {
		clearContext();
		for (let i = 0; i < quantity; i++) {
			const circle = circleParams();
			drawCircle(circle);
		}
	}, [quantity, clearContext, circleParams, drawCircle]);

	const resizeCanvas = useCallback(() => {
		if (canvasContainerRef.current && canvasRef.current && context.current) {
			circles.current.length = 0;
			canvasSize.current.w = canvasContainerRef.current.offsetWidth;
			canvasSize.current.h = canvasContainerRef.current.offsetHeight;
			canvasRef.current.width = canvasSize.current.w * dpr;
			canvasRef.current.height = canvasSize.current.h * dpr;
			canvasRef.current.style.width = `${canvasSize.current.w}px`;
			canvasRef.current.style.height = `${canvasSize.current.h}px`;
			context.current.scale(dpr, dpr);
		}
	}, [dpr]);

	const initCanvas = useCallback(() => {
		resizeCanvas();
		drawParticles();
	}, [resizeCanvas, drawParticles]);

	// ✨ FIX: The animation logic is now memoized with its dependencies.
	const animate = useCallback(() => {
		clearContext();
		circles.current.forEach((circle, i) => {
			const edge = [
				circle.x + circle.translateX - circle.size,
				canvasSize.current.w - circle.x - circle.translateX - circle.size,
				circle.y + circle.translateY - circle.size,
				canvasSize.current.h - circle.y - circle.translateY - circle.size,
			];
			const closestEdge = edge.reduce((a, b) => Math.min(a, b));
			const remapClosestEdge = Number.parseFloat(
				remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
			);

			if (remapClosestEdge > 1) {
				circle.alpha += 0.02;
				if (circle.alpha > circle.targetAlpha) {
					circle.alpha = circle.targetAlpha;
				}
			} else {
				circle.alpha = circle.targetAlpha * remapClosestEdge;
			}

			circle.x += circle.dx;
			circle.y += circle.dy;
			circle.translateX +=
				(mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
				ease;
			circle.translateY +=
				(mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
				ease;

			if (
				circle.x < -circle.size ||
				circle.x > canvasSize.current.w + circle.size ||
				circle.y < -circle.size ||
				circle.y > canvasSize.current.h + circle.size
			) {
				circles.current.splice(i, 1);
				const newCircle = circleParams();
				drawCircle(newCircle);
			} else {
				drawCircle(circle, true);
			}
		});
	}, [ease, staticity, clearContext, circleParams, drawCircle]);

	// Effect for canvas initialization and resizing
	useEffect(() => {
		if (canvasRef.current) {
			context.current = canvasRef.current.getContext("2d");
		}
		initCanvas();
		window.addEventListener("resize", initCanvas);
		return () => {
			window.removeEventListener("resize", initCanvas);
		};
	}, [initCanvas]);

	// Effect for handling mouse movement
	useEffect(() => {
		if (canvasRef.current) {
			const rect = canvasRef.current.getBoundingClientRect();
			const { w, h } = canvasSize.current;
			const x = mousePosition.x - rect.left - w / 2;
			const y = mousePosition.y - rect.top - h / 2;
			const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
			if (inside) {
				mouse.current.x = x;
				mouse.current.y = y;
			}
		}
	}, [mousePosition.x, mousePosition.y]);

	// Effect for triggering a refresh
	useEffect(() => {
		initCanvas();
	}, [initCanvas]);

	// ✨ FIX: The animation loop is now in its own effect.
	// It restarts if `animate` changes, ensuring it always uses the latest props.
	useEffect(() => {
		let animationFrameId: number;
		const loop = () => {
			animate();
			animationFrameId = window.requestAnimationFrame(loop);
		};
		animationFrameId = window.requestAnimationFrame(loop);
		return () => {
			window.cancelAnimationFrame(animationFrameId);
		};
	}, [animate]);

	return (
		<div className={className} ref={canvasContainerRef} aria-hidden="true">
			<canvas ref={canvasRef} />
		</div>
	);
}
