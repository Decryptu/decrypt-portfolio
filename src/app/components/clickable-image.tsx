"use client";

import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface ClickableImageProps {
  alt?: string;
  src: string;
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
      aria-labelledby="lightboxImage"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      tabIndex={-1}
    >
      <button
        aria-label="Close image preview"
        className="absolute inset-0 bg-black/50"
        onClick={() => setShow(false)}
        type="button"
      />
      <Image
        alt={alt}
        className="relative z-10 h-[95vh] w-auto max-w-full object-contain"
        height={1200}
        id="lightboxImage"
        sizes="100vw"
        src={src}
        unoptimized
        width={1600}
      />
    </div>
  );

  const lightbox =
    show && ReactDOM.createPortal(lightboxElement, document.body);

  return (
    <>
      <button
        aria-label={`Open image preview: ${alt}`}
        className="block rounded-md border border-zinc-200 dark:border-zinc-800"
        onClick={() => setShow(true)}
        type="button"
      >
        <Image
          alt={alt}
          className="rounded-md"
          height={900}
          sizes="(min-width: 768px) 896px, 100vw"
          src={src}
          unoptimized
          width={1200}
        />
      </button>
      {lightbox}
    </>
  );
};

export default ClickableImage;
