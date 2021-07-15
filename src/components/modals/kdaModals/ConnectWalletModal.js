import React, { useState, useContext } from "react";
import styled from "styled-components/macro";

import CustomButton from "../../../shared/CustomButton";

import { PactContext } from "../../../contexts/PactContext";
import reduceToken from "../../../utils/reduceToken";

import LayoutModal from "../LayoutModal";
import { AccountContext } from "../../../contexts/AccountContext";
import { WALLET } from "../../../constants/wallet";
import { ModalContext } from "../../../contexts/ModalContext";
import ConnectWalletZelcoreModal from "./ConnectWalletZelcoreModal";

const ConnectWalletModal = () => {
  const modalContext = useContext(ModalContext);
  const { account } = useContext(AccountContext);

  const openWalletModal = (walletName) => {
    switch (walletName) {
      default:
        return <div />;
      case "Zelcore":
        return modalContext.openModal({
          title: "connect wallet",
          description: "Zelcore Signing (Safest)",
          content: <ConnectWalletZelcoreModal />,
        });
      case "Torus":
        return <div />;
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
      onClick={() => openWalletModal(wallet.name)}
    >
      {wallet.logo}
      {` ${wallet.name}`}
    </CustomButton>
  ));
};

export default ConnectWalletModal;
