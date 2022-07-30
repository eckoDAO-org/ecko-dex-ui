/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { Transition } from 'react-spring/renderprops';
import ModalContainer from '../shared/ModalContainer';
import { Icon } from 'semantic-ui-react';
import CustomButton from '../shared/CustomButton';
import GameEditionModalsContainer from '../game-edition-v2/GameEditionModalsContainer';
import { WALLET } from '../../constants/wallet';
import { openZelcore } from '../../utils/zelcore';
import GameEditionLabel from '../game-edition-v2/components/GameEditionLabel';
import Label from '../shared/Label';
import LogoLoader from '../shared/Loader';
import { useApplicationContext, useGameEditionContext, useWalletContext } from '../../contexts';
import { theme } from '../../styles/theme';

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

const WalletRequestView = ({ show, onClose, error }) => {
  const wallet = useWalletContext();
  const { themeMode } = useApplicationContext();
  const { gameEditionView } = useGameEditionContext();

  useEffect(() => {
    if (show && wallet?.wallet?.name === WALLET.ZELCORE.name) {
      openZelcore();
    }
  }, [show]);

  return gameEditionView && show ? (
    <GameEditionModalsContainer
      containerStyle={{ zIndex: 1 }}
      title={error?.error ? error.title : 'Please Sign'}
      hideOnClose
      content={
        error?.error ? (
          <ContentContainer>
            <GameEditionLabel center color="yellow" style={{ padding: '0 30px' }}>
              {error?.content}
            </GameEditionLabel>
            <CustomButton
              geType="confirm"
              geButtonStyle={{ display: 'flex', justifyContent: 'center' }}
              onClick={() => {
                onClose();
              }}
            />
          </ContentContainer>
        ) : (
          <Content>
            <GameEditionLabel center color="yellow">
              Follow instructions in the wallet to preview and sign your transaction.
            </GameEditionLabel>
            <LoaderContainer>
              <LogoLoader />
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
                title={error?.title}
                containerStyle={{
                  maxHeight: '80vh',
                  maxWidth: '90vw',
                }}
                onClose={onClose}
              >
                <Label labelStyle={{ marginBottom: 30, marginTop: 24 }}>{error?.content}</Label>
                <CustomButton
                  buttonStyle={{ color: theme(themeMode).colors.white }}
                  onClick={() => {
                    onClose();
                  }}
                >
                  <Icon name="checkmark" /> Got it
                </CustomButton>
              </ModalContainer>
            ) : (
              <ModalContainer
                title="Please Sign"
                containerStyle={{
                  maxHeight: '80vh',
                  maxWidth: '90vw',
                }}
                onClose={onClose}
              >
                <Content style={{ marginTop: 16 }}>
                  <Label style={{ textAlign: 'center' }}>Follow instructions in the wallet to preview and sign your transaction.</Label>
                  <LoaderContainer>
                    <LogoLoader />
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
