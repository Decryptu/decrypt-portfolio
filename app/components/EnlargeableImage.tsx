'use client'

import { useState } from "react";
import Modal from "react-modal";

type EnlargeableImageProps = {
  src: string;
  alt?: string;
};

const EnlargeableImage: React.FC<EnlargeableImageProps> = ({ src, alt }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <div>
      <img src={src} alt={alt} onClick={openModal} />
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} 
        style={{
          content: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        <div className="relative">
          <img src={src} alt={alt} className="max-w-full h-auto" />
          <button 
            onClick={closeModal} 
            className="absolute top-2 right-2 bg-white rounded-full p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EnlargeableImage;
