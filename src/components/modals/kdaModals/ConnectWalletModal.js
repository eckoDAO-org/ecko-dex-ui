import React from 'react';
import CustomButton from '../../../components/shared/CustomButton';
import { WALLET } from '../../../constants/wallet';
import { useKaddexWalletContext, useNotificationContext, useModalContext, useGameEditionContext } from '../../../contexts';
import ConnectWalletZelcoreModal from './ConnectWalletZelcoreModal';
import ConnecWalletTorusModal from './ConnectWalletTorusModal';
import ConnectWalletChainweaverModal from './ConnectWalletChainweaverModal';

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
      case WALLET.TORUS.name:
        if (gameEditionView) {
          return openModal({
            title: 'connect wallet',
            description: 'Torus Signing',
            content: <ConnecWalletTorusModal onClose={closeModal} />,
          });
        } else {
          return modalContext.openModal({
            id: 'TORUS',
            title: 'connect wallet',
            description: 'Torus Signing',
            onBack: () => modalContext.onBackModal(),
            content: <ConnecWalletTorusModal onClose={() => modalContext.closeModal()} />,
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

  return Object.values(WALLET).map((wallet, index) => (
    <CustomButton
      key={index}
      onClick={() => {
        openWalletModal(wallet.name);
      }}
    >
      {!gameEditionView && wallet.logo}
      {` ${wallet.name}`}
    </CustomButton>
  ));
};

export default ConnectWalletModal;
