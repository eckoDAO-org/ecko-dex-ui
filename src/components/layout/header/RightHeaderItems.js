import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import useWindowSize from '../../../hooks/useWindowSize';
import { ModalContext } from '../../../contexts/ModalContext';
import ConnectWalletModal from '../../modals/kdaModals/ConnectWalletModal';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import BellNotification from '../../right-modal-notification/BellNotification';

import { AccountContext } from '../../../contexts/AccountContext';
import AccountInfo from './AccountInfo';
import Button from '../../../components/shared/CustomButton';
import headerLinks from '../../headerLinks';
import PopupContentList from './PopupContentList';
import reduceToken from '../../../utils/reduceToken';
import SlippagePopupContent from './SlippagePopupContent';
import AccountModal from '../../modals/kdaModals/AccountModal';
import theme, { commonTheme } from '../../../styles/theme';
import { CoinKaddexIcon, ThreeDotsIcon } from '../../../assets';
import { reduceBalance } from '../../../utils/reduceBalance';
import Label from '../../shared/Label';
import { RightModalContext } from '../../../contexts/RightModalContext';
import CustomButton from '../../../components/shared/CustomButton';
import NotificationCard from '../../right-modal-notification/NotificationCard';
import { useLocation } from 'react-router-dom';
import { chainId } from '../../../constants/contextConstants';

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
  const { pathname } = useLocation();
  const [width] = useWindowSize();

  const { account, notificationList, removeAllNotifications, removeNotification } = useContext(AccountContext);
  const modalContext = useContext(ModalContext);
  const { gameEditionView, openModal } = useContext(GameEditionContext);
  const rightModalContext = useContext(RightModalContext);

  return (
    <RightContainerHeader>
      {/* TODO: make kdx price dynamic after mint */}
      {width >= theme.mediaQueries.desktopPixel && (
        <div className="flex align-ce">
          <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 8 }} />
          <Label outGameEditionView fontSize={13} className="mainnet-chain-2">
            $ 0.16
          </Label>
        </div>
      )}

      <Label outGameEditionView fontSize={13} class1Name="mainnet-chain-2 desktop-only">{`Chain ${chainId}`}</Label>
      {account?.account && width >= commonTheme.mediaQueries.desktopPixel && (
        <AccountInfo
          onClick={() => {
            if (gameEditionView) {
              return openModal({
                title: 'Account',
                content: <AccountModal pathname={pathname} />,
              });
            } else {
              modalContext.openModal({
                title: 'Account',
                content: <AccountModal pathname={pathname} />,
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
        hasNotification={notificationList?.some((notif) => notif.isRead === false)}
        onClick={() => {
          rightModalContext.openModal({
            title: 'notifications',
            titleStyle: { padding: '10px 22px 10px 26px' },
            content: [...notificationList]?.reverse().map((notif, index) => {
              return (
                <NotificationCard
                  key={index}
                  index={index}
                  type={notif?.type}
                  time={notif?.time}
                  date={notif?.date}
                  title={notif?.title}
                  isHighlight={!notif?.isRead}
                  description={notif?.description}
                  removeItem={removeNotification}
                  link={notif?.link}
                />
              );
            }),
            footer: (
              <CustomButton
                onClick={() => {
                  removeAllNotifications();
                }}
                fontSize="12px"
                buttonStyle={{ width: '100%' }}
                outGameEditionView
              >
                Remove All Notification
              </CustomButton>
            ),
          });
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
