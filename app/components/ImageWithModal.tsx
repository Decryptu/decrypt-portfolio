import React, { useState } from 'react';
import Modal from 'react-modal';
import Lightbox from 'react-image-lightbox';

Modal.setAppElement('#__next'); // assuming your Next.js app is mounted on this element

const ImageWithModal = ({ src }) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  return (
    <div>
      <img src={src} onClick={openModal} style={{cursor: 'pointer'}} />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
      >
        <Lightbox
          mainSrc={src}
          onCloseRequest={closeModal}
          enableZoom={true}
        />
      </Modal>
    </div>
  );
}

export default ImageWithModal;
