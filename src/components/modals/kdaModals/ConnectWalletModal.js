import React from 'react';
import CustomButton from '../../../components/shared/CustomButton';
import { WALLET } from '../../../constants/wallet';
import { useKaddexWalletContext, useNotificationContext, useModalContext, useGameEditionContext } from '../../../contexts';
import ConnectWalletZelcoreModal from './ConnectWalletZelcoreModal';
import ConnectWalletChainweaverModal from './ConnectWalletChainweaverModal';
import styled from 'styled-components';
import { FlexContainer } from '../../shared/FlexContainer';
import Label from '../../shared/Label';

const ConnectWalletModal = () => {
  const modalContext = useModalContext();
  const { STATUSES, showNotification } = useNotificationContext();
  const { initializeKaddexWallet, isInstalled } = useKaddexWalletContext();
  const { gameEditionView, openModal, closeModal } = useGameEditionContext();

  const openWalletModal = (walletName) => {
    switch (walletName) {
      default:
        return <div />;
      case WALLET.ZELCORE.name:
        if (gameEditionView) {
          return openModal({
            title: 'ZELCORE',
            description: 'Zelcore Signing (Safest)',
            content: <ConnectWalletZelcoreModal />,
          });
        } else {
          return modalContext.openModal({
            id: 'ZELCORE',
            title: 'connect wallet',
            description: 'Zelcore Signing (Safest)',
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
      case WALLET.KADDEX_WALLET.name:
        if (!isInstalled) {
          showNotification({
            title: 'Wallet not found',
            message: `Please install ${WALLET.KADDEX_WALLET.name}`,
            type: STATUSES.WARNING,
          });
        } else {
          initializeKaddexWallet();
          modalContext.closeModal();
        }
        break;
    }
  };

  return (
    <Container className="column" gap={16}>
      <CustomButton
        type="gradient"
        onClick={() => {
          openWalletModal(WALLET.KADDEX_WALLET.name);
        }}
      >
        {WALLET.KADDEX_WALLET.name}
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
