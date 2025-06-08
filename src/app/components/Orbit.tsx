"use client";
import OrbitingCircles from "@/app/components/OrbitingCircles";
import { Eclipse, Globe, Moon, Satellite } from "lucide-react";

export function OrbitingCirclesDemo() {
	return (
		<div className="relative flex h-[500px] w-full max-w-[32rem] items-center justify-center overflow-hidden">
			<span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-black to-zinc-300/80 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
				Decrypt
			</span>

			{/* Inner circles */}
			<OrbitingCircles
				className="h-[30px] w-[30px] border-none bg-transparent"
				duration={20}
				delay={20}
				radius={80}
			>
				<Moon size={30} />
			</OrbitingCircles>
			<OrbitingCircles
				className="h-[30px] w-[30px] border-none bg-transparent"
				duration={20}
				delay={10}
				radius={80}
			>
				<Globe size={30} />
			</OrbitingCircles>

			{/* Outer circles (reverse) */}
			<OrbitingCircles
				className="h-[50px] w-[50px] border-none bg-transparent"
				reverse
				radius={190}
				duration={20}
			>
				<Satellite size={50} />
			</OrbitingCircles>
			<OrbitingCircles
				className="h-[50px] w-[50px] border-none bg-transparent"
				reverse
				radius={190}
				duration={20}
				delay={20}
			>
				<Eclipse size={50} />
			</OrbitingCircles>
		</div>
	);
}
