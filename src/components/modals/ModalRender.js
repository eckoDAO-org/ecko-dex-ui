import React from 'react';
import { ModalConsumer, ModalProvider } from '../../contexts/ModalContext';
import LayoutModal from './LayoutModal';

const ModalRender = ({ children }) => {
  return (
    <ModalProvider>
      {children}
      <ModalConsumer>
        {(value) => (
          <LayoutModal
            title={value.title}
            description={value.description}
            open={value.open}
            onClose={value.onClose || value.closeModal}
            onBack={null || value.onBack}
            containerStyle={value.containerStyle}
            content={value.content}
          />
        )}
      </ModalConsumer>
    </ModalProvider>
  );
};

export default ModalRender;
