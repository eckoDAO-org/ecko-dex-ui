import React, { useContext } from 'react';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';
import { ExplorerIcon } from '../../../assets';
import { NETWORK_TYPE } from '../../../constants/contextConstants';
import { AccountContext } from '../../../contexts/AccountContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { LightModeContext } from '../../../contexts/LightModeContext';
import { ModalContext } from '../../../contexts/ModalContext';
import { WalletContext } from '../../../contexts/WalletContext';
import { KaddexWalletContext } from '../../../contexts/KaddexWalletContext';
import CopyPopup from '../../../shared/CopyPopup';
import CustomButton from '../../../shared/CustomButton';
import { theme } from '../../../styles/theme';
import reduceToken from '../../../utils/reduceToken';
import { BoldLabel, Container } from '../../layout/Containers';
import ConnectWalletModal from './ConnectWalletModal';

const AccountModalContainer = styled(Container)`
  margin-top: 24px;
  & > *:not(:last-child) {
    margin-bottom: 24px;
  }
  height: 100%;
`;

const AccountIdContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border: ${({ $gameEditionView, theme: { colors } }) => ($gameEditionView ? `2px dashed ${colors.black}` : `1px solid ${colors.white}99`)};
  padding: 14px 10px;
  align-items: center;
  font-size: ${({ $gameEditionView }) => ($gameEditionView ? '13px' : '16px')};
  font-family: ${({ $gameEditionView, theme: { fontFamily } }) => ($gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold)};
  & > *:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-flow: row;
`;

const SubTitle = styled.span`
  width: 100%;
  font-family: ${({ $gameEditionView, theme: { fontFamily } }) => ($gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular)};
  color: ${({ $gameEditionView, theme: { colors } }) => ($gameEditionView ? colors.black : colors.white)};
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '16px')};
  text-align: left;
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
    path {
      fill: ${({ $gameEditionView, theme: { colors } }) => ($gameEditionView ? colors.black : colors.white)};
    }
  }
`;

const ActionContainer = styled.div`
  display: flex;
  flex-flow: row;
  align-items: ${({ $gameEditionView }) => ($gameEditionView ? 'flex-end !important' : 'center')};
  width: 100%;
  justify-content: ${({ $gameEditionView }) => ($gameEditionView ? 'flex-end' : 'space-between')};
  width: 100%;
  height: 100%;
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
  const { gameEditionView, openModal } = useContext(GameEditionContext);
  const { themeMode } = useContext(LightModeContext);
  const { wallet } = useContext(WalletContext);
  const { disconnectWallet } = useContext(KaddexWalletContext);

  return (
    <AccountModalContainer>
      <SubTitle $gameEditionView={gameEditionView}>Connected with {wallet?.name}</SubTitle>

      {account?.account && (
        <AccountIdContainer $gameEditionView={gameEditionView}>
          <RowContainer>
            <span>Account</span>
            <RightContainer
              $gameEditionView={gameEditionView}
              onClick={() =>
                window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/eventsearch?q=${account.account}`, '_blank', 'noopener,noreferrer')
              }
            >
              <ExplorerIcon />
              <span>View in Explorer</span>
            </RightContainer>
          </RowContainer>
          <RowContainer>
            <span>{reduceToken(account.account)}</span>
            <span>
              <CopyPopup textToCopy={account.account} title="Copy Address" containerStyle={{ textAlign: 'right' }} />
            </span>
          </RowContainer>
        </AccountIdContainer>
      )}
      <RowContainer>
        <SubTitle $gameEditionView={gameEditionView} fontSize="13px">
          Balance
        </SubTitle>
        <BoldLabel $gameEditionView={gameEditionView}>{account.balance}</BoldLabel>
      </RowContainer>
      <ActionContainer $gameEditionView={gameEditionView}>
        <ButtonGroup $gameEditionView={gameEditionView} fluid>
          <CustomButton
            border="none"
            color={gameEditionView ? theme(themeMode).colors.black : theme(themeMode).colors.white}
            background="transparent"
            onClick={() => {
              if (gameEditionView) {
                return openModal({
                  isVisible: true,
                  title: account?.account ? 'wallet connected' : 'connect wallet',
                  description: account?.account ? `Account ID: ${reduceToken(account.account)}` : 'Connect a wallet using one of the methods below',
                  content: <ConnectWalletModal />,
                });
              } else {
                return modalContext.openModal({
                  title: account?.account ? 'wallet connected' : 'connect wallet',
                  description: account?.account ? `Account ID: ${reduceToken(account.account)}` : 'Connect a wallet using one of the methods below',
                  content: <ConnectWalletModal />,
                });
              }
            }}
          >
            Change Method
          </CustomButton>
          <CustomButton
            border={gameEditionView ? `2px dashed ${theme(themeMode).colors.black}` : `1px solid ${theme(themeMode).colors.white}99`}
            color={gameEditionView ? theme(themeMode).colors.black : theme(themeMode).colors.white}
            background="transparent"
            onClick={() => {
              disconnectWallet();
              logout();
            }}
          >
            Disconnect Wallet
          </CustomButton>
        </ButtonGroup>
      </ActionContainer>
    </AccountModalContainer>
  );
};

export default AccountModal;
