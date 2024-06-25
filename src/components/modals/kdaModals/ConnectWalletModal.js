import React from 'react';
import CustomButton from '../../../components/shared/CustomButton';
import { WALLET } from '../../../constants/wallet';
import { useKaddexWalletContext, useNotificationContext, useModalContext, useGameEditionContext, useAccountContext } from '../../../contexts';
import ConnectWalletZelcoreModal from './ConnectWalletZelcoreModal';
import ConnectWalletChainweaverModal from './ConnectWalletChainweaverModal';
import styled from 'styled-components';
import { FlexContainer } from '../../shared/FlexContainer';
import Label from '../../shared/Label';
import ConnectWalletWalletConnectModal from './ConnectWalletWalletConnectModal';

const ConnectWalletModal = () => {
  const modalContext = useModalContext();
  const { account } = useAccountContext();
  const { STATUSES, showNotification } = useNotificationContext();
  const { initializeKaddexWallet, isInstalled } = useKaddexWalletContext();
  const { gameEditionView, openModal, closeModal } = useGameEditionContext();

  const openWalletModal = (walletName) => {
    switch (walletName) {
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
        type="secondary"
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
