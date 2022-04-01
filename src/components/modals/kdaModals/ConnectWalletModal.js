import React, { useContext } from "react";

import CustomButton from "../../../shared/CustomButton";

import { WALLET } from "../../../constants/wallet";
import { ModalContext } from "../../../contexts/ModalContext";
import ConnectWalletZelcoreModal from "./ConnectWalletZelcoreModal";
import ConnectWalletChainweaverModal from "./ConnectWalletChainweaverModal";
import { useKaddexWalletContext, useNotificationContext } from "../../../contexts";

const ConnectWalletModal = () => {
  const modalContext = useContext(ModalContext);
  const { STATUSES, showNotification } = useNotificationContext();
  const { initializeKaddexWallet, isInstalled } = useKaddexWalletContext();

  const openWalletModal = (walletName) => {
    switch (walletName) {
      default:
        return <div />;
      case "Zelcore":
        return modalContext.openModal({
          id: "ZELCORE",
          title: "connect wallet",
          description: "Zelcore Signing (Safest)",
          onBack: () => modalContext.onBackModal(),
          content: (
            <ConnectWalletZelcoreModal
              onClose={modalContext.closeModal()}
              onBack={() => modalContext.onBackModal()}
            />
          ),
        });
      case "Chainweaver":
        return modalContext.openModal({
          id: "CHIANWEAVER",
          title: "connect wallet",
          description: "Chainweaver",
          onBack: () => modalContext.onBackModal(),
          content: (
            <ConnectWalletChainweaverModal
              onClose={() => modalContext.closeModal()}
              onBack={() => modalContext.onBackModal()}
            />
          ),
        });
        case "X-Wallet":
          if (!isInstalled) {
            showNotification({
              title: 'Wallet not found',
              message: `Please install ${WALLET.KADDEX_WALLET.name}`,
              type: STATUSES.WARNING,
            });
          } else {
            initializeKaddexWallet();
            modalContext.closeModal();
          };
    }
  };

  return Object.values(WALLET).map((wallet, index) => (
    <CustomButton
      key={index}
      buttonStyle={{
        border: "1px solid #424242",
      }}
      background="transparent"
      onClick={() => {
        openWalletModal(wallet.name);
      }}
    >
      {wallet.logo}
      {` ${wallet.name}`}
    </CustomButton>
  ));
};

export default ConnectWalletModal;
