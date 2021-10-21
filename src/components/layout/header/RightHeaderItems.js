import React, { useContext } from 'react';
import styled from 'styled-components';
import HeaderItem from '../../../shared/HeaderItem';
import AccountInfo from './AccountInfo';
import Button from '../../../shared/CustomButton';
import CustomPopup from '../../../shared/CustomPopup';
import { PowerIcon, CogIcon, AboutBigIcon } from '../../../assets';
import headerLinks from '../../headerLinks';
import PopupContentList from './PopupContentList';
import { AccountContext } from '../../../contexts/AccountContext';
import reduceToken from '../../../utils/reduceToken';
import { reduceBalance } from '../../../utils/reduceBalance';
import SlippagePopupContent from './SlippagePopupContent';
import { ModalContext } from '../../../contexts/ModalContext';
import ConnectWalletModal from '../../modals/kdaModals/ConnectWalletModal';
import { GameEditionContext } from '../../../contexts/GameEditionContext';

const RightContainerHeader = styled.div`
  display: flex;
  align-items: center;
  & > *:first-child {
    margin-right: 13px;
  }
  & > *:not(:first-child):not(:last-child) {
    margin-right: 14px;
  }
  @media (min-width: ${({ theme: { mediaQueries } }) =>
      mediaQueries.mobileBreakpoint}) {
    & > *:not(:first-child):not(:last-child) {
      margin-right: 16px;
    }
  }
`;

const Label = styled.span`
  font-size: 13px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  text-transform: capitalize;
  padding: 10px 16px;
  color: white;
  font-size: 16;
`;

const RightHeaderItems = () => {
  const { account, logout } = useContext(AccountContext);
  const modalContext = useContext(ModalContext);
  const { gameEditionView } = useContext(GameEditionContext);

  return (
    <RightContainerHeader>
      <HeaderItem className='mobile-none'>
        <Label>mainnet BETA chain 2</Label>
      </HeaderItem>
      {account?.account ? (
        <HeaderItem className='mobile-none'>
          <AccountInfo
            onClick={() =>
              modalContext.openModal({
                title: account?.account ? 'wallet connected' : 'connect wallet',
                description: account?.account
                  ? `Account ID: ${reduceToken(account.account)}`
                  : 'Connect a wallet using one of the methods below',
                content: <ConnectWalletModal />,
              })
            }
            account={
              account.account ? `${reduceToken(account.account)}` : 'KDA'
            }
            balance={
              account.account ? `${reduceBalance(account.balance)} KDA` : ''
            }
          ></AccountInfo>
        </HeaderItem>
      ) : (
        <></>
      )}
      {!account.account && !gameEditionView && (
        <>
          <HeaderItem className='mobile-none'>
            <Button
              hover={true}
              buttonStyle={{ padding: '10px 16px' }}
              fontSize={14}
              onClick={() =>
                modalContext.openModal({
                  title: account?.account
                    ? 'wallet connected'
                    : 'connect wallet',
                  description: account?.account
                    ? `Account ID: ${reduceToken(account.account)}`
                    : 'Connect a wallet using one of the methods below',
                  content: <ConnectWalletModal />,
                })
              }
            >
              Connect Wallet
            </Button>
          </HeaderItem>
        </>
      )}
      {account.account && (
        <HeaderItem>
          <PowerIcon onClick={() => logout()} />
        </HeaderItem>
      )}
      <HeaderItem>
        <CustomPopup
          trigger={<CogIcon />}
          on='click'
          offset={[30, 10]}
          position='bottom right'
        >
          <SlippagePopupContent />
        </CustomPopup>
      </HeaderItem>
      <HeaderItem>
        <CustomPopup
          basic
          trigger={<AboutBigIcon />}
          on='click'
          offset={[0, 10]}
          position='bottom right'
        >
          <PopupContentList items={headerLinks} />
        </CustomPopup>
      </HeaderItem>
    </RightContainerHeader>
  );
};

export default RightHeaderItems;
