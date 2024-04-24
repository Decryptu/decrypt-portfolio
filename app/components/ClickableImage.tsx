"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface ClickableImageProps {
  src: string;
  alt?: string;
}

const ClickableImage: React.FC<ClickableImageProps> = ({ src, alt }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setShow(false);
        }
      };

      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "auto";
      };
    }
  }, [show]);

  const lightbox =
    show &&
    ReactDOM.createPortal(
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={() => setShow(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setShow(false);
          }
        }}
        tabIndex={-1} // Makes it focusable
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightboxImage"
      >
        <img
          id="lightboxImage"
          src={src}
          alt={alt || "image"}
          className="max-w-full h-[95vh] object-contain"
        />
      </div>,
      document.body
    );

  return (
    <>
      <img
        src={src}
        alt={alt || "image"}
        onClick={() => setShow(true)}
        className="cursor-pointer rounded-md border border-zinc-200 dark:border-zinc-800"
        role="button"
        tabIndex={0} // Makes it focusable
      />
      {lightbox}
    </>
  );
};

export default ClickableImage;
