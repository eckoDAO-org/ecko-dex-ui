import React from 'react';
import styled from 'styled-components/macro';
import { Transition } from 'react-spring/renderprops';
import Backdrop from '../../shared/Backdrop';
import ModalContainer from '../../shared/ModalContainer';

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
  max-width: 500px;
  width: 100%;
  z-index: 5;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-flow: column;

  & > *:not(:last-child) {
    margin-bottom: 24px;
  }
`;

const LayoutModal = ({
  title,
  description,
  open,
  onClose,
  onBack,
  containerStyle,
  children,
  content,
}) => {
  return (
    <Transition
      items={open}
      from={{ opacity: 0 }}
      enter={{ opacity: 1 }}
      leave={{ opacity: 0 }}
    >
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
                maxHeight: '80vh',
                maxWidth: '90vw',
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
