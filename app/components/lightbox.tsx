import React from 'react';
import Modal from 'react-modal';

type LightboxProps = {
  isOpen: boolean;
  src: string;
  onRequestClose: () => void;
};

const Lightbox: React.FC<LightboxProps> = ({ isOpen, src, onRequestClose }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Image Lightbox">
      <img src={src} alt="Enlarged" />
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default Lightbox;
