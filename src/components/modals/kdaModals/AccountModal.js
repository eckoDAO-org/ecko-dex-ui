/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import { ExplorerIcon } from '../../../assets';
import { NETWORK_TYPE } from '../../../constants/contextConstants';
import { AccountContext } from '../../../contexts/AccountContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { ModalContext } from '../../../contexts/ModalContext';
import { WalletContext } from '../../../contexts/WalletContext';
import { KaddexWalletContext } from '../../../contexts/KaddexWalletContext';
import CopyPopup from '../../../components/shared/CopyPopup';
import CustomButton from '../../../components/shared/CustomButton';
import reduceToken from '../../../utils/reduceToken';
import { Container } from '../../layout/Containers';
import ConnectWalletModal from './ConnectWalletModal';
import Label from '../../shared/Label';
import PressButtonToActionLabel from '../../game-edition-v2/components/PressButtonToActionLabel';

const AccountModalContainer = styled(Container)`
  justify-content: space-between;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  & > *:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const AccountIdContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border: ${({ $gameEditionView, theme: { colors } }) => ($gameEditionView ? `2px dashed #ffffff` : `1px solid ${colors.white}99`)};
  padding: 14px 10px;
  align-items: center;
  font-size: ${({ $gameEditionView }) => ($gameEditionView ? '13px' : '16px')};
  font-family: ${({ $gameEditionView, theme: { fontFamily } }) => ($gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold)};
  & > *:not(:last-child) {
    margin-bottom: ${({ $gameEditionView }) => ($gameEditionView ? '8px' : '16px')};
  }
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-flow: row;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  font-size: ${({ $gameEditionView }) => ($gameEditionView ? '13px' : '16px')};

  font-family: ${({ $gameEditionView, theme: { fontFamily } }) => ($gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold)};
  & > *:not(:last-child) {
    margin-right: 8px;
  }

  & > span {
    @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
      text-align: end;
      width: min-content;
    }
  }
  cursor: pointer;

  svg {
    height: 24px;
    height: 24px;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  margin-top: 16px;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }

  & > button {
    width: 100%;
  }
`;

const ButtonGroup = styled(Button.Group)`
  flex-direction: ${({ $gameEditionView }) => ($gameEditionView ? 'column !important' : 'row')};
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel}px`}) {
    flex-direction: column !important;
  }
`;

const AccountModal = () => {
  const { account, logout } = useContext(AccountContext);
  const modalContext = useContext(ModalContext);
  const { gameEditionView, setSelectedWire, setShowWires, setButtons, buttons } = useContext(GameEditionContext);
  const { wallet } = useContext(WalletContext);
  const { disconnectWallet } = useContext(KaddexWalletContext);

  useEffect(() => {
    const oldButtons = buttons;
    if (gameEditionView) {
      setButtons({
        A: () => {
          setSelectedWire(null);
          setShowWires(true);
        },
      });
    }
    return () => {
      setButtons({ ...oldButtons });
    };
  }, [gameEditionView]);

  return (
    <AccountModalContainer>
      <Content>
        <Label geFontSize={20} geCenter geColor="yellow" geLabelStyle={{ textAlign: 'center' }} labelStyle={{ marginTop: 16, width: '100%' }}>
          Connected with {wallet?.name}
        </Label>

        {account?.account && (
          <AccountIdContainer $gameEditionView={gameEditionView}>
            <RowContainer>
              <Label fontFamily="bold" geFontSize={20}>
                Account
              </Label>

              <RightContainer
                $gameEditionView={gameEditionView}
                onClick={() =>
                  window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/eventsearch?q=${account.account}`, '_blank', 'noopener,noreferrer')
                }
              >
                <ExplorerIcon />
                <Label fontFamily="bold" geFontSize={20}>
                  View in Explorer
                </Label>
              </RightContainer>
            </RowContainer>
            <RowContainer>
              <Label fontFamily="bold" geFontSize={20}>
                {reduceToken(account.account)}
              </Label>

              <CopyPopup textToCopy={account.account} title="Copy Address" containerStyle={{ textAlign: 'right' }} />
            </RowContainer>
          </AccountIdContainer>
        )}
        <RowContainer>
          <Label fontSize={14} geFontSize={24}>
            Balance
          </Label>
          <Label fontFamily="bold" fontSize={14} geFontSize={24}>
            {account.balance}
          </Label>
        </RowContainer>
      </Content>
      {!gameEditionView ? (
        <ActionContainer>
          <ButtonGroup fluid>
            <CustomButton
              type="basic"
              onClick={() => {
                modalContext.openModal({
                  title: account?.account ? 'wallet connected' : 'connect wallet',
                  description: account?.account ? `Account ID: ${reduceToken(account.account)}` : 'Connect a wallet using one of the methods below',
                  content: <ConnectWalletModal />,
                });
              }}
            >
              Change Method
            </CustomButton>

            <CustomButton
              type="primary"
              onClick={() => {
                disconnectWallet();
                logout();
              }}
            >
              Disconnect Wallet
            </CustomButton>
          </ButtonGroup>
        </ActionContainer>
      ) : (
        <PressButtonToActionLabel actionLabel="change method" />
      )}
    </AccountModalContainer>
  );
};

export default AccountModal;
