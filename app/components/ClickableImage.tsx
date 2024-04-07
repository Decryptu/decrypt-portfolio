"use client";

import type React from "react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
interface ClickableImageProps {
  src: string;
  alt?: string;
}

const ClickableImage: React.FC<ClickableImageProps> = ({ src, alt }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShow(false);
      }
    };

    document.body.style.overflow = show ? "hidden" : "auto";
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show]);

  // Here we use React Portal to render the lightbox outside the normal DOM hierarchy
  const lightbox = show
    ? ReactDOM.createPortal(
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShow(false)}
        >
          <img
            src={src}
            alt={alt || "image"}
            className="max-w-full h-[95vh] object-contain"
          />
        </div>,
        document.body // Target container is the body element
      )
    : null;

  return (
    <>
      <img
        src={src}
        alt={alt || "image"}
        onClick={() => setShow(true)}
        className="cursor-pointer rounded-md border border-zinc-200"
      />
      {lightbox}
    </>
  );
};

export default ClickableImage;
