import React from 'react';
import { NotificationModalConsumer, NotificationModalProvider } from '../../contexts/NotificationModalContext';
import NotificationModal from './NotificationModal';

const NotificationModalRender = ({ children }) => {
  return (
    <NotificationModalProvider>
      {children}
      <NotificationModalConsumer>
        {(value) => {
          return (
            <NotificationModal
              open={value.open || false}
              title={value.title}
              content={value?.content ?? null}
              containerStyle={value.containerStyle}
              contentStyle={value.contentStyle}
              titleStyle={value.titleStyle}
              onClose={value.onClose || value.closeModal}
              footerButton={value?.footer}
            />
          );
        }}
      </NotificationModalConsumer>
    </NotificationModalProvider>
  );
};

export default NotificationModalRender;
