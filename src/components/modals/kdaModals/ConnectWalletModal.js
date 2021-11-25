import React, { useContext } from 'react';

import CustomButton from '../../../shared/CustomButton';

import { WALLET } from '../../../constants/wallet';
import { ModalContext } from '../../../contexts/ModalContext';
import ConnectWalletZelcoreModal from './ConnectWalletZelcoreModal';
import ConnecWalletTorusModal from './ConnectWalletTorusModal';
import ConnectWalletChainweaverModal from './ConnectWalletChainweaverModal';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { theme } from '../../../styles/theme';
import { LightModeContext } from '../../../contexts/LightModeContext';
import { useKadenaWalletContext } from '../../../contexts';

const ConnectWalletModal = () => {
  const modalContext = useContext(ModalContext);
  const { initializeKDAWallet, isInstalled } = useKadenaWalletContext();
  const { gameEditionView, openModal } = useContext(GameEditionContext);
  const { themeMode } = useContext(LightModeContext);

  const openWalletModal = (walletName) => {
    switch (walletName) {
      default:
        return <div />;
      case WALLET.ZELCORE.name:
        if (gameEditionView) {
          return openModal({
            title: 'connect wallet',
            description: 'Zelcore Signing (Safest)',
            content: <ConnectWalletZelcoreModal onClose={modalContext.closeModal()} onBack={() => modalContext.onBackModal()} />
          });
        } else {
          return modalContext.openModal({
            id: 'ZELCORE',
            title: 'connect wallet',
            description: 'Zelcore Signing (Safest)',
            onBack: () => modalContext.onBackModal(),
            content: <ConnectWalletZelcoreModal onClose={modalContext.closeModal()} onBack={() => modalContext.onBackModal()} />
          });
        }
      case WALLET.TORUS.name:
        if (gameEditionView) {
          return openModal({
            title: 'connect wallet',
            description: 'Torus Signing',
            content: <ConnecWalletTorusModal onClose={() => modalContext.closeModal()} onBack={() => modalContext.onBackModal()} />
          });
        } else {
          return modalContext.openModal({
            id: 'TORUS',
            title: 'connect wallet',
            description: 'Torus Signing',
            onBack: () => modalContext.onBackModal(),
            content: <ConnecWalletTorusModal onClose={() => modalContext.closeModal()} onBack={() => modalContext.onBackModal()} />
          });
        }
      case WALLET.CHAINWEAVER.name:
        if (gameEditionView) {
          return openModal({
            title: 'connect wallet',
            description: 'Chainweaver',
            content: <ConnectWalletChainweaverModal onClose={() => modalContext.closeModal()} onBack={() => modalContext.onBackModal()} />
          });
        } else {
          return modalContext.openModal({
            id: 'CHIANWEAVER',
            title: 'connect wallet',
            description: 'Chainweaver',
            onBack: () => modalContext.onBackModal(),
            content: <ConnectWalletChainweaverModal onClose={() => modalContext.closeModal()} onBack={() => modalContext.onBackModal()} />
          });
        }
      case WALLET.KADENA_WALLET.name:
        if (!isInstalled) {
          alert('Please install Kda Wallet extension');
        } else {
          initializeKDAWallet();
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
