import React, { useState, useContext, Children, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Transition } from 'react-spring/renderprops';
import Search from '../../../shared/Search';
import Backdrop from '../../../shared/Backdrop';
import ModalContainer from '../../../shared/ModalContainer';
import { SwapContext } from '../../../contexts/SwapContext';
import { reduceBalance } from '../../../utils/reduceBalance';
import TokenSelectorModalContent from './TokenSelectorModalContent';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import GameEditionModalsContainer from '../../game-edition/GameEditionModalsContainer';

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
  const game = useContext(GameEditionContext);
  const [searchValue, setSearchValue] = useState('');

  /*  useEffect(() => {
    if (show && game.gameEditionView) {
      game.openModal({
        title: 'select a token',
        description: '',
        content: (
          <TokenSelectorModalContent
            selectedToken={selectedToken}
            onTokenClick={onTokenClick}
            onClose={onClose}
            fromToken={fromToken}
            toToken={toToken}
          />
        ),
      });
    }
  }, [show]); */

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
                    setSearchValue('');
                    onClose();
                  }}
                />
                <ModalContainer
                  title="select a token"
                  containerStyle={{
                    //height: "100%",
                    maxHeight: '80vh',
                    maxWidth: '90vw'
                  }}
                  onClose={() => {
                    setSearchValue('');
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
