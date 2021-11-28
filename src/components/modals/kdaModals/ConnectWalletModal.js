import React from 'react';
import CustomButton from '../../../shared/CustomButton';
import { WALLET } from '../../../constants/wallet';
import { useKaddexWalletContext, useNotificationContext, useModalContext, useLightModeContext, useGameEditionContext } from '../../../contexts';
import ConnectWalletZelcoreModal from './ConnectWalletZelcoreModal';
import ConnecWalletTorusModal from './ConnectWalletTorusModal';
import ConnectWalletChainweaverModal from './ConnectWalletChainweaverModal';
import { theme } from '../../../styles/theme';

const ConnectWalletModal = () => {
  const modalContext = useModalContext();
  const { STATUSES, showNotification } = useNotificationContext();
  const { initializeKaddexWallet, isInstalled } = useKaddexWalletContext();
  const { gameEditionView, openModal } = useGameEditionContext();
  const { themeMode } = useLightModeContext();

  const openWalletModal = (walletName) => {
    switch (walletName) {
      default:
        return <div />;
      case WALLET.ZELCORE.name:
        if (gameEditionView) {
          return openModal({
            title: 'connect wallet',
            description: 'Zelcore Signing (Safest)',
            content: <ConnectWalletZelcoreModal onClose={modalContext.closeModal()} onBack={() => modalContext.onBackModal()} />,
          });
        } else {
          return modalContext.openModal({
            id: 'ZELCORE',
            title: 'connect wallet',
            description: 'Zelcore Signing (Safest)',
            onBack: () => modalContext.onBackModal(),
            content: <ConnectWalletZelcoreModal onClose={modalContext.closeModal()} onBack={() => modalContext.onBackModal()} />,
          });
        }
      case WALLET.TORUS.name:
        if (gameEditionView) {
          return openModal({
            title: 'connect wallet',
            description: 'Torus Signing',
            content: <ConnecWalletTorusModal onClose={() => modalContext.closeModal()} onBack={() => modalContext.onBackModal()} />,
          });
        } else {
          return modalContext.openModal({
            id: 'TORUS',
            title: 'connect wallet',
            description: 'Torus Signing',
            onBack: () => modalContext.onBackModal(),
            content: <ConnecWalletTorusModal onClose={() => modalContext.closeModal()} onBack={() => modalContext.onBackModal()} />,
          });
        }
      case WALLET.CHAINWEAVER.name:
        if (gameEditionView) {
          return openModal({
            title: 'connect wallet',
            description: 'Chainweaver',
            content: <ConnectWalletChainweaverModal onClose={() => modalContext.closeModal()} onBack={() => modalContext.onBackModal()} />,
          });
        } else {
          return modalContext.openModal({
            id: 'CHIANWEAVER',
            title: 'connect wallet',
            description: 'Chainweaver',
            onBack: () => modalContext.onBackModal(),
            content: <ConnectWalletChainweaverModal onClose={() => modalContext.closeModal()} onBack={() => modalContext.onBackModal()} />,
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
          modalContext.onBackModal();
        }
        break;
    }
  };

  return Object.values(WALLET).map((wallet, index) => (
    <CustomButton
      key={index}
      border={gameEditionView ? `2px dashed ${theme(themeMode).colors.black}` : `1px solid ${theme(themeMode).colors.white}99`}
      background="transparent"
      color={gameEditionView ? theme(themeMode).colors.black : theme(themeMode).colors.white}
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
