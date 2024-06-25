/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { ExplorerIcon } from '../../../assets';
import { NETWORK_TYPE } from '../../../constants/contextConstants';
import CopyPopup from '../../../components/shared/CopyPopup';
import CustomButton from '../../../components/shared/CustomButton';
import reduceToken from '../../../utils/reduceToken';
import { Container } from '../../layout/Containers';
import ConnectWalletModal from './ConnectWalletModal';
import Label from '../../shared/Label';
import PressButtonToActionLabel from '../../game-edition-v2/components/PressButtonToActionLabel';
import { FlexContainer } from '../../shared/FlexContainer';
import {
  useAccountContext,
  useGameEditionContext,
  useKaddexWalletContext,
  useModalContext,
  useWalletConnectContext,
  useWalletContext,
} from '../../../contexts';

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
  font-family: ${({ $gameEditionView, theme: { fontFamily } }) => ($gameEditionView ? fontFamily.pressStartRegular : fontFamily.syncopate)};
  & > *:not(:last-child) {
    margin-bottom: ${({ $gameEditionView }) => ($gameEditionView ? '8px' : '16px')};
  }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  font-size: ${({ $gameEditionView }) => ($gameEditionView ? '13px' : '16px')};

  font-family: ${({ $gameEditionView, theme: { fontFamily } }) => ($gameEditionView ? fontFamily.pressStartRegular : fontFamily.syncopate)};
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
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const AccountModal = ({ pathname }) => {
  const { account, logout } = useAccountContext();
  const modalContext = useModalContext();
  const { gameEditionView, setSelectedWire, setShowWires, setButtons, buttons } = useGameEditionContext();
  const { wallet } = useWalletContext();
  const { disconnectWallet } = useKaddexWalletContext();
  const { pairingTopic: isWalletConnectConnected, deleteWalletConnectSession } = useWalletConnectContext();

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
  }, [gameEditionView, pathname]);

  return (
    <AccountModalContainer>
      <Content>
        <Label geFontSize={20} geCenter geColor="yellow" geLabelStyle={{ textAlign: 'center' }} labelStyle={{ width: '100%' }}>
          Connected with {wallet?.name}
        </Label>

        {account?.account && (
          <AccountIdContainer $gameEditionView={gameEditionView}>
            <div className="flex justify-sb w-100">
              <Label geFontSize={20}>Account</Label>

              <RightContainer
                $gameEditionView={gameEditionView}
                onClick={() =>
                  process.env.REACT_APP_KDA_NETWORK_TYPE !== 'development' &&
                  window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/eventsearch?q=${account.account}`, '_blank', 'noopener,noreferrer')
                }
              >
                <ExplorerIcon />
                <Label geFontSize={20}>
                  {process.env.REACT_APP_KDA_NETWORK_TYPE !== 'development' ? 'View in Explorer' : 'Explorer not available in devnet'}
                </Label>
              </RightContainer>
            </div>
            <div className="flex justify-sb w-100">
              <Label geFontSize={20}>{reduceToken(account.account)}</Label>

              <CopyPopup textToCopy={account.account} title="Copy Address" containerStyle={{ textAlign: 'right' }} />
            </div>
          </AccountIdContainer>
        )}
        <div className="flex justify-sb w-100" style={{ margin: '16px 0' }}>
          <Label fontSize={14} geFontSize={24}>
            Balance
          </Label>
          <Label fontSize={14} geFontSize={24}>
            {account.balance} KDA
          </Label>
        </div>
      </Content>
      {!gameEditionView ? (
        <FlexContainer className="column w-100" gap={16} style={{ marginTop: 16 }}>
          <CustomButton
            type="primary"
            onClick={() => {
              modalContext.openModal({
                title: account?.account ? 'wallet connected' : 'connect wallet',
                description: account?.account ? `Account ID: ${reduceToken(account.account)}` : '',
                content: <ConnectWalletModal />,
              });
            }}
          >
            Change Method
          </CustomButton>

          <CustomButton
            type="secondary"
            onClick={() => {
              if (isWalletConnectConnected) {
                deleteWalletConnectSession();
              } else {
                disconnectWallet();
                logout();
              }
            }}
          >
            Disconnect Wallet
          </CustomButton>
        </FlexContainer>
      ) : (
        <PressButtonToActionLabel actionLabel="change method" />
      )}
    </AccountModalContainer>
  );
};

export default AccountModal;
