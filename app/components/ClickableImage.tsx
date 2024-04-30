"use client";

import type React from "react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface ClickableImageProps {
	src: string;
	alt?: string;
}

const ClickableImage: React.FC<ClickableImageProps> = ({
	src,
	alt = "image",
}) => {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setShow(false);
			}
		};

		if (show) {
			document.body.style.overflow = "hidden";
			window.addEventListener("keydown", handleKeyDown);
		}
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "auto";
		};
	}, [show]);

	const lightboxElement = (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
			onClick={() => setShow(false)}
			onKeyDown={(event) => {
				if (event.key === "Escape") {
					setShow(false);
				}
			}}
			tabIndex={-1}
			role="dialog"
			aria-modal="true"
			aria-labelledby="lightboxImage"
		>
			<img
				id="lightboxImage"
				src={src}
				alt={alt}
				className="max-w-full h-[95vh] object-contain"
			/>
		</div>
	);

	const lightbox =
		show && ReactDOM.createPortal(lightboxElement, document.body);

	return (
		<>
			<img
				src={src}
				alt={alt}
				onClick={() => setShow(true)}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						setShow(true);
					}
				}}
				className="cursor-pointer rounded-md border border-zinc-200 dark:border-zinc-800"
			/>
			{lightbox}
		</>
	);
};

export default ClickableImage;
