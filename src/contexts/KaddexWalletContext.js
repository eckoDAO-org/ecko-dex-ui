import React, { useState, createContext, useEffect, useCallback } from 'react';
import { useAccountContext, useWalletContext, useNotificationContext } from '.';
import { network, NETWORKID } from '../constants/contextConstants';
import { WALLET } from '../constants/wallet';

export const KaddexWalletContext = createContext();

const initialKaddexWalletState = {
  isConnected: false,
  isInstalled: false,
  network,
};

export const KaddexWalletProvider = (props) => {
  const [kadenaExt, setKadenaExt] = useState(null);
  const [kaddexWalletState, setKaddexWalletState] = useState(initialKaddexWalletState);

  const accountContextData = useAccountContext();
  const { wallet, setSelectedWallet, signingWallet } = useWalletContext();
  const { showNotification, STATUSES } = useNotificationContext();

  const initialize = useCallback(() => {
    const { kadena } = window;
    setKadenaExt(kadena);
    setKaddexWalletState({
      ...kaddexWalletState,
      isInstalled: Boolean(kadena?.isKadena),
    });
  }, [kaddexWalletState]);

  const getNetworkInfo = async () => {
    return await kadenaExt.request({
      method: 'kda_getNetwork',
    });
  };

  const getAccountInfo = async () => {
    return await kadenaExt.request({
      method: 'kda_requestAccount',
      networkId: NETWORKID,
    });
  };

  const requestSign = async (signingCmd) => {
    return await kadenaExt.request({
      method: 'kda_requestSign',
      data: {
        networkId: NETWORKID,
        signingCmd,
      },
    });
  };

  const setAccountData = async () => {
    const acc = await getAccountInfo();
    if (acc.wallet) {
      await accountContextData.setVerifiedAccount(acc.wallet.account);
      await signingWallet();
      await setSelectedWallet(WALLET.KADDEX_WALLET);
      setKaddexWalletState({
        ...kaddexWalletState,
        isConnected: true,
      });
    }
  };

  useEffect(() => {
    window.addEventListener('load', initialize);
  }, [initialize]);

  useEffect(() => {
    const registerEvents = async () => {
      if (kadenaExt) {
        kadenaExt.on('res_accountChange', async (response) => {
          console.log('!!!res_accountChange', response);
          await setAccountData();
        });
        kadenaExt.on('res_checkStatus', (response) => {
          console.log('!!!res_checkStatus', response);
        });
        kadenaExt.on('res_sendKadena', (response) => {
          console.log('!!!res_sendKadena ', response);
        });
        if (wallet?.name === WALLET.KADDEX_WALLET.name) {
          setKaddexWalletState({
            ...kaddexWalletState,
            isConnected: true,
          });
        }
      }
    };
    registerEvents();
  }, [kadenaExt]);

  const initializeKaddexWallet = async () => {
    try {
      const networkInfo = await getNetworkInfo();
      if (networkInfo.networkId !== NETWORKID) {
        showNotification({
          title: 'Wallet not found',
          message: `Please set the correct network: ${NETWORKID}`,
          type: STATUSES.WARNING,
        });
      } else {
        await kadenaExt.request({
          method: 'kda_connect',
          networkId: NETWORKID,
        });
        await setAccountData();
      }
    } catch (err) {
      showNotification({
        title: 'Wallet error',
        message: `Please check ${WALLET.KADDEX_WALLET.name}`,
        type: STATUSES.ERROR,
      });
    }
  };

  return (
    <KaddexWalletContext.Provider
      value={{
        ...kaddexWalletState,
        initializeKaddexWallet,
        requestSign,
      }}
    >
      {props.children}
    </KaddexWalletContext.Provider>
  );
};

export const KaddexWalletCunsomer = KaddexWalletContext.Consumer;
