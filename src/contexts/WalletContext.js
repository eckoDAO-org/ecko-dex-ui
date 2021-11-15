import React, { createContext, useEffect, useState } from "react";
import Pact from "pact-lang-api";

export const WalletContext = createContext(null);

const savedWallet = localStorage.getItem("wallet");
const savedSigning = localStorage.getItem("signing");
const savedPrivKey = localStorage.getItem("pk");

export const WalletProvider = (props) => {
  const [wallet, setWallet] = useState(
    savedWallet ? JSON.parse(savedWallet) : null
  );
  const [signing, setSigning] = useState(
    savedSigning ? JSON.parse(savedSigning) : { method: "none", key: "" }
  );

  const [privKey, setPrivKey] = useState(savedPrivKey ? savedPrivKey : "");
  const keyPair = privKey
    ? Pact.crypto.restoreKeyPairFromSecretKey(privKey)
    : "";

  const [walletError, setWalletError] = useState(null);
  const [isWaitingForWalletAuth, setIsWaitingForWalletAuth] = useState(false);
  const [walletSuccess, setWalletSuccess] = useState(false);

  useEffect(() => {
    const store = async () =>
      localStorage.setItem("signing", JSON.stringify(signing));
    store();
  }, [signing]);

  const storePrivKey = async (pk) => {
    setSigning({ method: "pk", key: pk });
    await setPrivKey(pk);
    await localStorage.setItem("pk", pk);
  };

  const setSigningMethod = async (meth) => {
    await setSigning({ ...signing, method: meth });
  };

  const signingWallet = () => {
    setSigning({ method: "sign", key: "" });
  };

  const setSelectedWallet = (wallet) => {
    setWallet({ name: wallet.name });
    localStorage.setItem("wallet", JSON.stringify({ name: wallet.name }));
  };

  const disconnectWallet = () => {
    localStorage.removeItem("wallet", null);
    localStorage.removeItem("signing", null);
    window.location.reload();
  };

  const contextValues = {
    wallet,
    setSelectedWallet,
    signing,
    walletError,
    setWalletError,
    keyPair,
    isWaitingForWalletAuth,
    setIsWaitingForWalletAuth,
    walletSuccess,
    setWalletSuccess,
    disconnectWallet,
    storePrivKey,
    setSigningMethod,
    signingWallet,
  };
  return (
    <WalletContext.Provider value={contextValues}>
      {props.children}
    </WalletContext.Provider>
  );
};
