'use client'

import { useState, useEffect } from "react";

interface ClickableImageProps {
  src: string;
  alt?: string;
}

const ClickableImage = ({ src, alt }: ClickableImageProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
  }, [show]);

  const handleClick = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        onClick={handleClick}
        className="cursor-pointer rounded-md border border-zinc-200"
      />
      {show && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <img src={src} alt={alt} className="max-w-full h-[95vh] object-contain" />
        </div>
      )}
    </>
  );
};

export default ClickableImage;
