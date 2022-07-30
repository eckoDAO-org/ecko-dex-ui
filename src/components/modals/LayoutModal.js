import React from 'react';
import styled from 'styled-components/macro';
import { Transition } from 'react-spring/renderprops';
import Backdrop from '../../components/shared/Backdrop';
import ModalContainer from '../../components/shared/ModalContainer';

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: fit-content;
  width: 100%;
  z-index: 100;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-flow: column;

  & > *:not(:last-child) {
    margin-bottom: 24px;
  }
`;

const LayoutModal = ({ title, description, open, onClose, onBack, containerStyle, children, content }) => {
  return (
    <Transition items={open} from={{ opacity: 1 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
      {(open) =>
        open &&
        ((props) => (
          <Container style={props}>
            <Backdrop
              onClose={() => {
                onClose();
              }}
            />
            <ModalContainer
              title={title}
              description={description}
              containerStyle={{
                maxWidth: '90vw',
                width: 550,
                ...containerStyle,
              }}
              onClose={() => {
                onClose();
              }}
              onBack={onBack ? () => onBack() : null}
            >
              <ContentContainer> {content || children}</ContentContainer>
            </ModalContainer>
          </Container>
        ))
      }
    </Transition>
  );
};

export default LayoutModal;
