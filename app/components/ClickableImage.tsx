"use client";

import React, { useState, useEffect } from 'react';

interface ClickableImageProps {
  src: string;
  alt?: string;
}

const ClickableImage: React.FC<ClickableImageProps> = ({ src, alt }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShow(false);
      }
    };

    // Effect to handle the Escape key
    document.body.style.overflow = show ? 'hidden' : 'auto';
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show]);

  return (
    <>
      <img
        src={src}
        alt={alt || 'image'}
        onClick={() => setShow(true)}
        className="cursor-pointer rounded-md border border-zinc-200"
      />
      {show && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShow(false)}
        >
          <img
            src={src}
            alt={alt || 'image'}
            className="max-w-full h-[95vh] object-contain"
          />
        </div>
      )}
    </>
  );
};

export default ClickableImage;
