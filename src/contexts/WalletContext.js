import React, { createContext, useState } from "react";

export const WalletContext = createContext(null);

const savedWallet = localStorage.getItem("wallet");

export const WalletProvider = (props) => {
  const [openConnectModal, setOpenConnectModal] = useState(false);

  const [wallet, setWallet] = useState(
    savedWallet ? JSON.parse(savedWallet) : null
  );

  const disconnectWallet = () => {
    localStorage.removeItem("wallet", null);
    //localStorage.removeItem("signing", null);
    window.location.reload();
  };

  const contextValues = {
    openConnectModal,
    setOpenConnectModal,
    wallet,
    disconnectWallet,
  };
  return (
    <WalletContext.Provider value={contextValues}>
      {props.children}
    </WalletContext.Provider>
  );
};
