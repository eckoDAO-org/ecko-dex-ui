/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Transition } from 'react-spring/renderprops';
import ModalContainer from '../../../components/shared/ModalContainer';
import { Loader, Icon } from 'semantic-ui-react';
import CustomButton from '../../../components/shared/CustomButton';
import GameEditionModalsContainer from '../../game-edition/GameEditionModalsContainer';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { WalletContext } from '../../../contexts/WalletContext';
import { WALLET } from '../../../constants/wallet';
import { openZelcore } from '../../../utils/zelcore';
import { theme } from '../../../styles/theme';
import { LightModeContext } from '../../../contexts/LightModeContext';

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
  width: 100%;
  justify-content: space-between;
`;

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 15px;
`;

const ContentContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SubTitle = styled.div`
  /* font-size: normal normal normal 12px/18px Montserrat; */

  width: ${({ gameEditionView }) => (gameEditionView ? '100%' : 'auto')};
  font-family: ${({ theme: { fontFamily }, gameEditionView }) => (gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold)};
  margin: ${({ gameEditionView }) => !gameEditionView && '16px 0px'};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '12px' : '14px')};
  color: ${({ theme: { colors }, gameEditionView }) => (gameEditionView ? colors.black : colors.primary)};
  text-align: left;
`;

const WalletRequestView = ({ show, onClose, error }) => {
  const wallet = useContext(WalletContext);
  const { themeMode } = useContext(LightModeContext);

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
          <ContentContainer>
            <Content gameEditionView={gameEditionView} style={{ marginBottom: '30px' }}>
              <SubTitle
                gameEditionView={gameEditionView}
                style={{
                  color: gameEditionView ? theme(themeMode).colors.black : theme(themeMode).colors.white,
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
              <Icon name="checkmark" /> Got it
            </CustomButton>{' '}
          </ContentContainer>
        ) : (
          <Content gameEditionView={gameEditionView}>
            <SubTitle
              gameEditionView={gameEditionView}
              style={{
                color: gameEditionView ? theme(themeMode).colors.black : theme(themeMode).colors.white,
              }}
            >
              Follow instructions in the wallet to preview and sign your transaction.
            </SubTitle>
            <LoaderContainer>
              <Loader
                active
                inline="centered"
                style={{
                  color: gameEditionView ? theme(themeMode).colors.black : theme(themeMode).colors.white,
                }}
              ></Loader>
            </LoaderContainer>
          </Content>
        )
      }
    />
  ) : (
    <Transition items={show} from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
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
                  <SubTitle style={{ color: theme(themeMode).colors.white }}>{error.content}</SubTitle>
                </Content>
                <CustomButton
                  onClick={() => {
                    onClose();
                  }}
                >
                  <Icon name="checkmark" /> Got it
                </CustomButton>
              </ModalContainer>
            ) : (
              /* <Backdrop onClose={onClose} /> */
              <ModalContainer
                title="Please Sign"
                containerStyle={{
                  maxHeight: '80vh',
                  maxWidth: '90vw',
                }} /* onClose={onClose} */
              >
                <Content>
                  <SubTitle style={{ color: theme(themeMode).colors.white }}>
                    Follow instructions in the wallet to preview and sign your transaction.
                  </SubTitle>
                  <LoaderContainer>
                    <Loader active inline="centered" style={{ color: theme(themeMode).colors.white }}></Loader>
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
