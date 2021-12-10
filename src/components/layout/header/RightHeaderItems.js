import React, { useContext } from 'react';
import styled from 'styled-components';
import HeaderItem from '../../../shared/HeaderItem';
import AccountInfo from './AccountInfo';
import Button from '../../../shared/CustomButton';
import CustomPopup from '../../../shared/CustomPopup';
import { CogIcon, ThreeDotsIcon } from '../../../assets';
import headerLinks from '../../headerLinks';
import PopupContentList from './PopupContentList';
import { AccountContext } from '../../../contexts/AccountContext';
import reduceToken from '../../../utils/reduceToken';
import { reduceBalance } from '../../../utils/reduceBalance';
import SlippagePopupContent from './SlippagePopupContent';
import { ModalContext } from '../../../contexts/ModalContext';
import ConnectWalletModal from '../../modals/kdaModals/ConnectWalletModal';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import BellNotification from '../../right-modal-notification/BellNotification';
import { NotificationContext } from '../../../contexts/NotificationContext';
import AccountModal from '../../modals/kdaModals/AccountModal';
import { NotificationModalContext } from '../../../contexts/NotificationModalContext';
import PowerIconWrapper from './PowerIconWrapper';

const RightContainerHeader = styled.div`
  display: flex;
  align-items: center;
  & > *:first-child {
    margin-right: 13px;
  }
  & > *:not(:first-child):not(:last-child) {
    margin-right: 14px;
  }
  @media (min-width: ${({ theme: { mediaQueries } }) => mediaQueries.mobileBreakpoint}) {
    & > *:not(:first-child):not(:last-child) {
      margin-right: 16px;
    }
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
`;

const FadeContainer = styled.div``;

const RightHeaderItems = () => {
  const { account } = useContext(AccountContext);
  const modalContext = useContext(ModalContext);
  const { gameEditionView, openModal, setGameEditionView, closeModal } = useContext(GameEditionContext);
  const notificationModalContext = useContext(NotificationModalContext);
  const notification = useContext(NotificationContext);

  return (
    <RightContainerHeader>
      {account?.account ? (
        <HeaderItem className="mobile-none">
          <AccountInfo
            onClick={() => {
              if (gameEditionView) {
                return openModal({
                  isVisible: true,
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
        </HeaderItem>
      ) : (
        <></>
      )}
      {!account.account && (
        <FadeContainer style={{ display: gameEditionView && 'none' }}>
          <HeaderItem className="mobile-none">
            <Button
              hover={true}
              buttonStyle={{ padding: '10px 16px' }}
              fontSize={14}
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
              Connect Wallet
            </Button>
          </HeaderItem>
        </FadeContainer>
      )}
      <HeaderItem disableHover>
        <PowerIconWrapper
          onClick={() => {
            setGameEditionView(!gameEditionView);
            closeModal();
          }}
        />
      </HeaderItem>
      <HeaderItem>
        <BellNotification
          hasNotification={notification.notificationList?.some((notif) => notif.isReaded === false)}
          onClick={() => {
            notificationModalContext.openModal({
              footer: (
                <Button
                  onClick={() => {
                    notification.removeAllItem();
                  }}
                  label=" Remove All Notification"
                  fontSize="12px"
                  buttonStyle={{ width: '100%' }}
                  outGameEditionView
                />
              ),
            });
          }}
        />
      </HeaderItem>
      {gameEditionView && (
        <HeaderItem headerItemStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '4px' }}>
          <CustomPopup trigger={<CogIcon />} on="click" offset={[30, 10]} position="bottom right">
            <SlippagePopupContent />
          </CustomPopup>
        </HeaderItem>
      )}

      <HeaderItem headerItemStyle={{ height: '100%', display: 'flex' }}>
        <CustomPopup
          basic
          trigger={
            <div style={{ height: '100%', display: 'flex' }}>
              <ThreeDotsIcon style={{ height: '100%' }} />
            </div>
          }
          on="click"
          offset={[0, -14]}
          position="bottom right"
        >
          <PopupContentList items={headerLinks} viewOtherComponents withLogout PopupContentListStyle={{ minWidth: 170 }} />
        </CustomPopup>
      </HeaderItem>
    </RightContainerHeader>
  );
};

export default RightHeaderItems;
