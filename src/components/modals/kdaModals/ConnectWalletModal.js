import React, { useContext } from "react";

import CustomButton from "../../../shared/CustomButton";

import { WALLET } from "../../../constants/wallet";
import { ModalContext } from "../../../contexts/ModalContext";
import ConnectWalletZelcoreModal from "./ConnectWalletZelcoreModal";
import ConnecWalletTorusModal from "./ConnectWalletTorusModal";
import ConnectWalletChainweaverModal from "./ConnectWalletChainweaverModal";
import { useKadenaWalletContext } from "../../../contexts";

const ConnectWalletModal = () => {
  const modalContext = useContext(ModalContext);
  const { initializeKDAWallet, isKDAWalletInstalled } =
    useKadenaWalletContext();

  const openWalletModal = (walletName) => {
    switch (walletName) {
      default:
        return <div />;
      case WALLET.ZELCORE.name:
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
      case WALLET.TORUS.name:
        return modalContext.openModal({
          id: "TORUS",
          title: "connect wallet",
          description: "Torus Signing",
          onBack: () => modalContext.onBackModal(),
          content: (
            <ConnecWalletTorusModal
              onClose={() => modalContext.closeModal()}
              onBack={() => modalContext.onBackModal()}
            />
          ),
        });
      case WALLET.KADENA_WALLET.name:
        if (!isKDAWalletInstalled) {
          alert("Please install Kda Wallet extension");
        } else {
          initializeKDAWallet();
        }
        break;
      case WALLET.CHAINWEAVER.name:
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
