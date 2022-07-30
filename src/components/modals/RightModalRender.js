import React from 'react';
import { RightModalConsumer, RightModalProvider } from '../../contexts/RightModalContext';
import RightModal from '../shared/RightModal';

const NotificationModalRender = ({ children }) => {
  return (
    <RightModalProvider>
      {children}
      <RightModalConsumer>
        {(value) => {
          return (
            <RightModal
              className={value.className}
              open={value.open || false}
              title={value.title}
              content={value?.content ?? null}
              containerStyle={value.containerStyle}
              contentStyle={value.contentStyle}
              titleStyle={value.titleStyle}
              onClose={value.onClose || value.closeModal}
              footer={value?.footer}
            />
          );
        }}
      </RightModalConsumer>
    </RightModalProvider>
  );
};

export default NotificationModalRender;
