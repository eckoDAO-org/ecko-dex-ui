import React, { useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Transition } from 'react-spring/renderprops';
import ModalContainer from '../../../shared/ModalContainer';
import { Loader, Icon } from 'semantic-ui-react';
import CustomButton from '../../../shared/CustomButton';
import GameEditionModalsContainer from '../../game-edition/GameEditionModalsContainer';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import theme from '../../../styles/theme';
import { WalletContext } from '../../../contexts/WalletContext';
import { WALLET } from '../../../constants/wallet';
import { openZelcore } from '../../../utils/zelcore';

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

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  svg {
    display: ${({ gameEditionView }) => gameEditionView && 'none '};
  }
  width: 97%;
  position: ${({ gameEditionView }) => gameEditionView && 'absolute'};
  bottom: ${({ gameEditionView }) => gameEditionView && '285px'};
`;

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 15px;
`;

const SubTitle = styled.div`
  /* font-size: normal normal normal 12px/18px Montserrat; */

  width: ${({ gameEditionView }) => (gameEditionView ? '100%' : 'auto')};
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '12px' : '18px')};
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : colors.primary};
  text-align: ${({ gameEditionView }) => (gameEditionView ? 'left' : 'center')};
`;

const WalletRequestView = ({ show, onClose, error }) => {
  const wallet = useContext(WalletContext);

  useEffect(() => {
    if (show && wallet.wallet.name === WALLET.ZELCORE.name) {
      openZelcore();
    }
  }, [show]);

  const { gameEditionView } = useContext(GameEditionContext);

  return gameEditionView && show ? (
    <GameEditionModalsContainer
      modalStyle={{ zIndex: 1 }}
      title={error?.error ? error.title : 'Please Sign'}
      onClose={onClose}
      content={
        error?.error ? (
          <>
            <Content
              gameEditionView={gameEditionView}
              style={{ marginBottom: '30px' }}
            >
              <SubTitle
                gameEditionView={gameEditionView}
                style={{
                  color: gameEditionView
                    ? theme.colors.black
                    : theme.colors.white,
                }}
              >
                {error.content}
              </SubTitle>
            </Content>
            <CustomButton
              onClick={() => {
                onClose();
              }}
            >
              <Icon name='checkmark' /> Got it
            </CustomButton>{' '}
          </>
        ) : (
          <Content gameEditionView={gameEditionView}>
            <SubTitle
              gameEditionView={gameEditionView}
              style={{
                color: gameEditionView
                  ? theme.colors.black
                  : theme.colors.white,
              }}
            >
              Follow instructions in the wallet to preview and sign your
              transaction.
            </SubTitle>
            <LoaderContainer>
              <Loader
                active
                inline='centered'
                style={{
                  color: gameEditionView
                    ? theme.colors.black
                    : theme.colors.white,
                }}
              ></Loader>
            </LoaderContainer>
          </Content>
        )
      }
    />
  ) : (
    <Transition
      items={show}
      from={{ opacity: 0 }}
      enter={{ opacity: 1 }}
      leave={{ opacity: 0 }}
    >
      {(show) =>
        show &&
        ((props) => (
          <Container style={props}>
            {error?.error ? (
              <ModalContainer
                title={error.title}
                containerStyle={{
                  maxHeight: '80vh',
                  maxWidth: '90vw',
                }}
                onClose={onClose}
              >
                <Content style={{ marginBottom: '30px' }}>
                  <SubTitle style={{ color: '#FFFFFF' }}>
                    {error.content}
                  </SubTitle>
                </Content>
                <CustomButton
                  onClick={() => {
                    onClose();
                  }}
                >
                  <Icon name='checkmark' /> Got it
                </CustomButton>
              </ModalContainer>
            ) : (
              /* <Backdrop onClose={onClose} /> */
              <ModalContainer
                title='Please Sign'
                containerStyle={{
                  maxHeight: '80vh',
                  maxWidth: '90vw',
                }} /* onClose={onClose} */
              >
                <Content>
                  <SubTitle style={{ color: '#FFFFFF' }}>
                    Follow instructions in the wallet to preview and sign your
                    transaction.
                  </SubTitle>
                  <LoaderContainer>
                    <Loader
                      active
                      inline='centered'
                      style={{ color: '#FFFFFF' }}
                    ></Loader>
                  </LoaderContainer>
                </Content>
              </ModalContainer>
            )}
          </Container>
        ))
      }
    </Transition>
  );
};

export default WalletRequestView;
