import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import useWindowSize from '../../../hooks/useWindowSize';
import { ModalContext } from '../../../contexts/ModalContext';
import ConnectWalletModal from '../../modals/kdaModals/ConnectWalletModal';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import BellNotification from '../../right-modal-notification/BellNotification';
import { NotificationContext } from '../../../contexts/NotificationContext';
import { NotificationModalContext } from '../../../contexts/NotificationModalContext';
import { AccountContext } from '../../../contexts/AccountContext';
import AccountInfo from './AccountInfo';
import Button from '../../../components/shared/CustomButton';
import headerLinks from '../../headerLinks';
import PopupContentList from './PopupContentList';
import reduceToken from '../../../utils/reduceToken';
import SlippagePopupContent from './SlippagePopupContent';
import AccountModal from '../../modals/kdaModals/AccountModal';
import { commonTheme } from '../../../styles/theme';
import { CoinKaddexIcon, ThreeDotsIcon } from '../../../assets';
import { reduceBalance } from '../../../utils/reduceBalance';
import Label from '../../shared/Label';

const RightContainerHeader = styled.div`
  display: flex;
  align-items: center;
  & > * {
    z-index: 10;
  }
  & > *:not(:last-child) {
    margin-right: 14px;
  }

  .fadeOut {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 1s, opacity 1s linear;
  }
  .fadeIn {
    visibility: visible;
    opacity: 1;
    transition: opacity 1s linear;
  }

  svg:not(.kaddex-price) {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const FadeContainer = styled.div``;

const RightHeaderItems = () => {
  const [width] = useWindowSize();

  const { account } = useContext(AccountContext);
  const modalContext = useContext(ModalContext);
  const { gameEditionView, openModal } = useContext(GameEditionContext);
  const notificationModalContext = useContext(NotificationModalContext);
  const notification = useContext(NotificationContext);

  return (
    <RightContainerHeader>
      {/* TODO: make kdx price dynamic after mint */}
      <div className="desktop-only flex align-ce">
        <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 8 }} />
        <Label outGameEditionView fontSize={13} className="mainnet-chain-2">
          $0.16
        </Label>
      </div>

      <Label outGameEditionView fontSize={13} class1Name="mainnet-chain-2 desktop-only">
        Chain 2
      </Label>
      {account?.account && width >= commonTheme.mediaQueries.desktopPixel && (
        <AccountInfo
          onClick={() => {
            if (gameEditionView) {
              return openModal({
                title: 'Account',
                content: <AccountModal />,
              });
            } else {
              modalContext.openModal({
                title: 'Account',
                content: <AccountModal />,
              });
            }
          }}
          account={account.account ? `${reduceToken(account.account)}` : 'KDA'}
          balance={account.account ? `${reduceBalance(account.balance)} KDA` : ''}
        />
      )}

      {!account.account && (
        <FadeContainer className="mobile-none" style={{ display: gameEditionView && 'none' }}>
          <Button
            hover={true}
            buttonStyle={{ padding: '10px 16px' }}
            fontSize={14}
            onClick={() => {
              if (gameEditionView) {
                return openModal({
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
            Connect Wallet
          </Button>
        </FadeContainer>
      )}

      {gameEditionView && <SlippagePopupContent className="header-item w-fit-content" />}

      <BellNotification
        hasNotification={notification.notificationList?.some((notif) => notif.isRead === false)}
        onClick={() => {
          notificationModalContext.openModal();
        }}
      />

      <PopupContentList
        icon={<ThreeDotsIcon />}
        items={headerLinks}
        className="w-fit-content"
        viewOtherComponents
        withLogout
        PopupContentListStyle={{ minWidth: 100 }}
      />
    </RightContainerHeader>
  );
};

export default RightHeaderItems;
