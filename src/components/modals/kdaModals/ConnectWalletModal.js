import React, { useState, useContext } from "react";
import styled from "styled-components/macro";

import CustomButton from "../../../shared/CustomButton";

import { PactContext } from "../../../contexts/PactContext";
import reduceToken from "../../../utils/reduceToken";

import LayoutModal from "../LayoutModal";
import { AccountContext } from "../../../contexts/AccountContext";
import { WALLET } from "../../../constants/wallet";

const ConnectWalletModal = () => {
  const pact = useContext(PactContext);
  const { account } = useContext(AccountContext);
  const [openWalletConnect, setOpenConnectWallet] = useState("");

  const [
    openConnectWalletChainweaverModal,
    setOpenConnectWalletChainweaverModal,
  ] = useState(false);
  const [openConnectWalletZelcoreModal, setOpenConnectWalletZelcoreModal] =
    useState(false);
  const [openConnectWalletTorusModal, setOpenConnectWalletTorusModal] =
    useState(false);

  return Object.values(WALLET).map((wallet, index) => (
    <CustomButton
      key={index}
      buttonStyle={{
        border: "1px solid #424242",
      }}
      background="transparent"
      onClick={() => setOpenConnectWallet(wallet.name)}
    >
      {wallet.icon}
      {wallet.name}
    </CustomButton>
  ));
};

export default ConnectWalletModal;
