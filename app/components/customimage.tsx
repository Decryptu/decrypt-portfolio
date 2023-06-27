import React, { useState } from 'react';
import Lightbox from './lightbox';

type CustomImageProps = {
  src: string;
  alt: string;
};

const CustomImage: React.FC<CustomImageProps> = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img src={src} alt={alt} onClick={() => setIsOpen(true)} />
      <Lightbox isOpen={isOpen} src={src} onRequestClose={() => setIsOpen(false)} />
    </>
  );
};

export default CustomImage;
