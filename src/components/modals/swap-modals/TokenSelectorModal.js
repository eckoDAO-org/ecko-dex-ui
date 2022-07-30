import React from 'react';
import styled from 'styled-components/macro';
import { Transition } from 'react-spring/renderprops';
import Backdrop from '../../../components/shared/Backdrop';
import ModalContainer from '../../../components/shared/ModalContainer';
import TokenSelectorModalContent from './TokenSelectorModalContent';
import { useGameEditionContext } from '../../../contexts';

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
  max-width: 385px;
  width: 100%;
  z-index: 5;
`;

const TokenSelectorModal = ({ show, selectedToken, onTokenClick, onClose, fromToken, toToken }) => {
  const game = useGameEditionContext();

  return (
    <>
      {!game.gameEditionView && (
        <Transition items={show} from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
          {(show) =>
            show &&
            ((props) => (
              <Container style={props}>
                <Backdrop
                  onClose={() => {
                    onClose();
                  }}
                />
                <ModalContainer
                  title="Select Token"
                  onClose={() => {
                    onClose();
                  }}
                >
                  <TokenSelectorModalContent
                    selectedToken={selectedToken}
                    onTokenClick={onTokenClick}
                    onClose={onClose}
                    fromToken={fromToken}
                    toToken={toToken}
                  />
                </ModalContainer>
              </Container>
            ))
          }
        </Transition>
      )}
    </>
  );
};

export default TokenSelectorModal;
