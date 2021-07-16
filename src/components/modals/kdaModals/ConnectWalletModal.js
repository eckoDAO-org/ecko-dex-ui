import React, { useContext } from "react";

import CustomButton from "../../../shared/CustomButton";

import { WALLET } from "../../../constants/wallet";
import { ModalContext } from "../../../contexts/ModalContext";
import ConnectWalletZelcoreModal from "./ConnectWalletZelcoreModal";
import ConnecWalletTorusModal from "./ConnectWalletTorusModal";

const ConnectWalletModal = () => {
  const modalContext = useContext(ModalContext);

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
      case "Torus":
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
      case "Chainweaver":
        return <div />;
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
