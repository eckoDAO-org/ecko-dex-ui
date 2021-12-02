import React from 'react';
import { RightModalConsumer, RightModalProvider } from '../../contexts/RightModalContext';
import RightModal from './RightModal';

const RightModalRender = ({ children }) => {
  return (
    <RightModalProvider>
      {children}
      <RightModalConsumer>
        {(value) =>
          value.open && (
            <RightModal
              mountNode={value.mountNode || document.getElementById('main-content')}
              open={value.open || false}
              title={value.title}
              content={value?.content ?? null}
              containerStyle={value.containerStyle}
              contentStyle={value.contentStyle}
              titleStyle={value.titleStyle}
              onClose={value.onClose || value.closeModal}
              footerButton={value?.footer}
              duration={5000}
            />
          )
        }
      </RightModalConsumer>
    </RightModalProvider>
  );
};

export default RightModalRender;
