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
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <img src={src} alt={alt} />
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default EnlargeableImage;
