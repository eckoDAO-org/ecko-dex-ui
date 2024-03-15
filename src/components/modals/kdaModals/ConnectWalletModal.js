import React, { useCallback, useState } from 'react';
import CustomButton from '../../../components/shared/CustomButton';
import { WALLET } from '../../../constants/wallet';
import { useKaddexWalletContext, useNotificationContext, useModalContext, useGameEditionContext, useAccountContext, useWalletConnectContext } from '../../../contexts';
import ConnectWalletZelcoreModal from './ConnectWalletZelcoreModal';
import ConnectWalletChainweaverModal from './ConnectWalletChainweaverModal';
import styled from 'styled-components';
import { FlexContainer } from '../../shared/FlexContainer';
import Label from '../../shared/Label';
import ConnectWalletWalletConnectModal from './ConnectWalletWalletConnectModal';
import { NETWORKID } from '../../../constants/contextConstants';
import GetWalletConnectAccountModal from './GetWalletConnectAccountModal';

const ConnectWalletModal = () => {
  const modalContext = useModalContext();
  const { account, setVerifiedAccount } = useAccountContext();
  const { STATUSES, showNotification } = useNotificationContext();
  const { initializeKaddexWallet, isInstalled } = useKaddexWalletContext();
  const { gameEditionView, openModal, closeModal, onWireSelect } = useGameEditionContext();

  const { connectWallet, requestGetAccounts } = useWalletConnectContext();
  const [_, setIsGettingAccounts] = useState(false);

  const onWalletDismiss = useCallback(
    (err) => {
      console.log(`onWalletDismiss err:`, err);
      setIsGettingAccounts(false);
      if (gameEditionView) {
        if (!account.account) {
          onWireSelect(null);
        } else {
          closeModal();
        }
      } else {
        modalContext.onBackModal();
      }
    },
    [gameEditionView, account, onWireSelect, closeModal, modalContext]
  );

  const onConnectWallet = useCallback(() => {
    let onConnectionSuccess;
    connectWallet()
      .then(async (responseNullable) => {
        if (responseNullable && responseNullable.accounts.length > 0) {
          setIsGettingAccounts(true);
          const wcAccounts = await requestGetAccounts(
            NETWORKID,
            responseNullable.accounts.map((a) => ({ account: a })),
            responseNullable.topic
          );
          setIsGettingAccounts(false);
          // call getAccounts
          const resultAccounts = [];
          wcAccounts.accounts.forEach((wcAcc) => wcAcc.kadenaAccounts.forEach((kAcc) => resultAccounts.push(kAcc.name)));

          if (resultAccounts.length === 1) {
            await setVerifiedAccount(resultAccounts[0], onConnectionSuccess);
            modalContext.closeModal();
          } else {
            if (gameEditionView) {
              openModal({
                hideOnClose: true,
                title: 'SELECT ACCOUNT',
                content: (
                  <GetWalletConnectAccountModal onClose={onWalletDismiss} accounts={resultAccounts} onConnectionSuccess={onConnectionSuccess} />
                ),
              });
            } else {
              modalContext.openModal({
                id: 'WALLETCONNECT_ACCOUNT',
                title: 'WalletConnect accounts',
                description: 'Select Account',
                onBack: () => modalContext.onBackModal(),
                content: (
                  <GetWalletConnectAccountModal
                    accounts={resultAccounts}
                    onClose={modalContext.closeModal}
                    onConnectionSuccess={onConnectionSuccess}
                  />
                ),
              });
            }
          }
        } else {
          onWalletDismiss();
          setIsGettingAccounts(false);
        }
      })
      .catch(onWalletDismiss);
  }, [gameEditionView, onWalletDismiss, openModal, setVerifiedAccount, modalContext, connectWallet]);

  const openWalletModal = (walletName) => {
    switch (walletName) {
      case WALLET.KOALAWALLET.name:
        onConnectWallet();
        break;

      case WALLET.ZELCORE.name:
        if (gameEditionView) {
          return openModal({
            title: 'ZELCORE',
            description: 'Zelcore Signing',
            content: <ConnectWalletZelcoreModal />,
          });
        } else {
          return modalContext.openModal({
            id: 'ZELCORE',
            title: 'connect wallet',
            description: 'Zelcore Signing',
            onBack: () => modalContext.onBackModal(),
            content: <ConnectWalletZelcoreModal />,
          });
        }

      case WALLET.CHAINWEAVER.name:
        if (gameEditionView) {
          return openModal({
            title: 'connect wallet',
            description: 'Chainweaver',
            content: <ConnectWalletChainweaverModal onClose={closeModal} />,
          });
        } else {
          return modalContext.openModal({
            id: 'CHIANWEAVER',
            title: 'connect wallet',
            description: 'Chainweaver',
            onBack: () => modalContext.onBackModal(),
            content: <ConnectWalletChainweaverModal onClose={() => modalContext.closeModal()} />,
          });
        }

      case WALLET.WALLETCONNECT.name:
        if (gameEditionView) {
          return openModal({
            title: 'connect wallet',
            description: 'WalletConnect',
            content: <ConnectWalletWalletConnectModal onClose={closeModal} />,
          });
        } else {
          return modalContext.openModal({
            id: 'CHIANWEAVER',
            title: 'connect wallet',
            description: 'WalletConnect',
            onBack: () => modalContext.onBackModal(),
            content: <ConnectWalletWalletConnectModal onClose={() => modalContext.closeModal()} />,
          });
        }

      case WALLET.ECKOWALLET.name:
        if (!isInstalled) {
          showNotification({
            title: 'Wallet not found',
            message: `Please install ${WALLET.ECKOWALLET.name}`,
            type: STATUSES.WARNING,
          });
        } else {
          initializeKaddexWallet();
          modalContext.closeModal();
        }
        break;

      default:
        return <div />;
    }
  };

  return (
    <Container className="column" gap={16} style={{ marginTop: !account.account && 24 }}>
      <CustomButton
        type="primary"
        onClick={() => {
          openWalletModal(WALLET.KOALAWALLET.name);
        }}
      >
        {!gameEditionView && WALLET.KOALAWALLET.logo}
        <Label outGameEditionView>{WALLET.KOALAWALLET.name}</Label>
      </CustomButton>

      <CustomButton
        type="gradient"
        onClick={() => {
          openWalletModal(WALLET.ECKOWALLET.name);
        }}
      >
        {WALLET.ECKOWALLET.name}
      </CustomButton>
      <CustomButton
        type="primary"
        onClick={() => {
          openWalletModal(WALLET.WALLETCONNECT.name);
        }}
      >
        {!gameEditionView && WALLET.WALLETCONNECT.logo}
        <Label outGameEditionView> {WALLET.WALLETCONNECT.name}</Label>
      </CustomButton>
      <CustomButton
        type="primary"
        onClick={() => {
          openWalletModal(WALLET.ZELCORE.name);
        }}
      >
        {!gameEditionView && WALLET.ZELCORE.logo}
        <Label outGameEditionView>{WALLET.ZELCORE.name}</Label>
      </CustomButton>
      <CustomButton
        type="primary"
        onClick={() => {
          openWalletModal(WALLET.CHAINWEAVER.name);
        }}
      >
        {!gameEditionView && WALLET.CHAINWEAVER.logo}
        <Label outGameEditionView> {WALLET.CHAINWEAVER.name}</Label>
      </CustomButton>
    </Container>
  );
};

export default ConnectWalletModal;

const Container = styled(FlexContainer)`
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;
