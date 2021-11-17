import React, { useState, createContext, useEffect, useCallback } from "react";
import { useAccountContext, useWalletContext } from ".";
import { network, NETWORKID } from "../constants/contextConstants";
import { WALLET } from "../constants/wallet";

export const KadenaWalletContext = createContext();

const initialKadenaWalletState = {
  isConnected: false,
  isInstalled: false,
  network,
};

export const KadenaWalletProvider = (props) => {
  const [kadenaExt, setKadenaExt] = useState(null);
  const [kadenaWalletState, setKadenaWalletState] = useState(
    initialKadenaWalletState
  );

  const accountContextData = useAccountContext();
  const walletContextData = useWalletContext();
  console.log("accountContextData", accountContextData);

  const initialize = useCallback(() => {
    const { kadena } = window;
    setKadenaExt(kadena);
    setKadenaWalletState({
      ...kadenaWalletState,
      isInstalled: Boolean(kadena?.isKadena),
    });
  }, [kadenaWalletState]);

  const getNetworkInfo = async () => {
    return await kadenaExt.request({
      method: "kda_getNetwork",
    });
  };

  const getAccountInfo = async () => {
    return await kadenaExt.request({
      method: "kda_requestAccount",
      networkId: NETWORKID,
    });
  };

  useEffect(() => {
    window.addEventListener("load", initialize);
  }, [initialize]);

  useEffect(() => {
    if (kadenaExt) {
      kadenaExt.on("res_accountChange", (response) => {
        console.log("!!!res_accountChange", response);
      });
      kadenaExt.on("res_checkStatus", (response) => {
        console.log("!!!res_checkStatus", response);
      });
      kadenaExt.on("res_sendKadena", (response) => {
        console.log("!!!res_sendKadena ", response);
      });
    }
  }, [kadenaExt]);

  const initializeKDAWallet = async (clb) => {
    return new Promise(async (resolve, reject) => {
      try {
        const networkInfo = await getNetworkInfo();
        if (networkInfo.networkId !== NETWORKID) {
          reject(() => alert("please set the correct network: " + NETWORKID));
        } else {
          await kadenaExt.request({
            method: "kda_connect",
            networkId: NETWORKID,
          });
          const acc = await getAccountInfo();
          await accountContextData.setVerifiedAccount(acc.wallet.account);
          console.log("!!!acc", acc);
          await walletContextData.signingWallet();
          await walletContextData.setSelectedWallet(WALLET.KADENA_WALLET);
          resolve(clb);
        }
      } catch (err) {
        console.log("initializeKDAWallet error", err);
        reject(err);
      }

      resolve(clb);
    });
  };

  return (
    <KadenaWalletContext.Provider
      value={{
        ...kadenaWalletState,
        initializeKDAWallet,
      }}
    >
      {props.children}
    </KadenaWalletContext.Provider>
  );
};

export const KadenaWalletCunsomer = KadenaWalletContext.Consumer;
