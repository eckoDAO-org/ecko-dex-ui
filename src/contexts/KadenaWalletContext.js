import React, { useState, createContext } from "react";
import { network, NETWORKID } from "../constants/contextConstants";

const { kadena } = window;

export const KadenaWalletContext = createContext();

const initialKadenaWalletState = {
  isKDAWalletConnected: false,
  isKDAWalletInstalled: Boolean(kadena?.isKadena),
  network,
};

export const KadenaWalletProvider = (props) => {
  const [kadenaWalletState, setKadenaWalletState] = useState(
    initialKadenaWalletState
  );

  const initializeKDAWallet = async () => {
    try {
      const networkInfo = await kadena.request({
        method: "kda_getNetwork",
      });
      console.log("networkInfo", networkInfo);
      if (networkInfo.networkId !== NETWORKID) {
        alert("please set the correct network: " + NETWORKID);
      } else {
        await kadena.request({
          method: "kda_connect",
          networkId: NETWORKID,
        });
      }
    } catch (err) {}
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
