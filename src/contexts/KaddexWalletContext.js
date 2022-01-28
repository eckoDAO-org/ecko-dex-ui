/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, createContext, useEffect, useCallback } from 'react';
import { useAccountContext, useWalletContext, useNotificationContext } from '.';
import { network, NETWORKID, chainId } from '../constants/contextConstants';
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

  const { setVerifiedAccount, logout, account } = useAccountContext();
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

  const connectWallet = async () => {
    await kadenaExt.request({
      method: 'kda_connect',
      networkId: NETWORKID,
    });
  };

  const disconnectWallet = async () => {
    if (kadenaExt) {
      const result = await kadenaExt.request({
        method: 'kda_disconnect',
        networkId: NETWORKID,
      });
      if (result?.result?.status === 'success' && result?.result?.message === 'Disconnected') {
        logout();
        setKaddexWalletState({
          ...kaddexWalletState,
          isConnected: false,
        });
      }
    }
  };
  useEffect(() => {
    if (kaddexWalletState.isConnected && (!wallet || !account?.account)) {
      console.log('!!!DISCONNECTING');
      disconnectWallet();
    }
  }, [wallet, kaddexWalletState, account]);

  const getNetworkInfo = async () => {
    return await kadenaExt.request({
      method: 'kda_getNetwork',
    });
  };

  const getSelectedChain = async () => {
    return await kadenaExt.request({
      method: 'kda_getChain',
    });
  };

  const checkStatus = async () => {
    await kadenaExt?.request({
      method: 'kda_checkStatus',
      networkId: NETWORKID,
    });
  };

  const getAccountInfo = async () => {
    return await kadenaExt.request({
      method: 'kda_requestAccount',
      networkId: NETWORKID,
    });
  };

  const requestSign = async (signingCmd) => {
    const account = await getAccountInfo();
    if (account.status === 'fail') {
      alertDisconnect();
    } else {
      return await kadenaExt.request({
        method: 'kda_requestSign',
        data: {
          networkId: NETWORKID,
          signingCmd,
        },
      });
    }
  };

  const setAccountData = async () => {
    const acc = await getAccountInfo();
    if (acc.wallet) {
      await setVerifiedAccount(acc.wallet.account);
      await signingWallet();
      await setSelectedWallet(WALLET.KADDEX_WALLET);
      setKaddexWalletState({
        ...kaddexWalletState,
        isInstalled: true,
        isConnected: true,
      });
    } else if (kaddexWalletState.isConnected) {
      checkCorrectChain();
    }
  };

  useEffect(() => {
    window.addEventListener('load', initialize);
  }, [initialize]);

  const alertDisconnect = () => {
    console.log('!!!DISCONNECTING');
    showNotification({
      title: 'X Wallet error',
      message: 'Wallet not connected',
      type: STATUSES.ERROR,
    });
    logout();
  };

  const checkCorrectChain = async () => {
    const selectedChainId = await getSelectedChain();

    if (selectedChainId?.toString() !== chainId?.toString()) {
      showChainError(selectedChainId);
    }
  };

  useEffect(() => {
    const registerEvents = async () => {
      if (kadenaExt) {
        kadenaExt.on('res_accountChange', async (response) => {
          console.log('!!!res_accountChange', response);
          await checkStatus();
        });
        kadenaExt.on('res_checkStatus', async (response) => {
          console.log('!!!res_checkStatus', response);
          const selectedChainId = await getSelectedChain();
          const acc = await getAccountInfo();
          if (response?.result?.status === 'success' && !kaddexWalletState.isConnected) {
            setAccountData();
          }
          if (response?.result?.status === 'fail' && response?.result?.message === 'Invalid network') {
            showNetworkError();
          } else {
            if (selectedChainId?.toString() !== chainId?.toString()) {
              showChainError(selectedChainId);
            } else if (!kaddexWalletState.isConnected && acc.status === 'fail') {
              connectWallet();
            }
          }
        });
        kadenaExt.on('res_sendKadena', (response) => {
          console.log('!!!res_sendKadena ', response);
        });
      }
    };
    registerEvents();
    if (kadenaExt) {
      setAccountData();
    }
  }, [kadenaExt]);

  const showNetworkError = () => {
    showNotification({
      title: 'Wallet error',
      message: `Please set the correct network: ${NETWORKID}`,
      type: STATUSES.ERROR,
      autoClose: 5000,
      hideProgressBar: false,
    });
  };

  const showChainError = (selectedChain) => {
    showNotification({
      title: 'Wallet error',
      message: `Please set chain ${chainId} ${selectedChain ? `(chain ${selectedChain} selected)` : ''}`,
      type: STATUSES.WARNING,
      autoClose: 5000,
      hideProgressBar: false,
    });
  };

  const initializeKaddexWallet = async (clb) => {
    const networkInfo = await getNetworkInfo();
    if (networkInfo.networkId !== NETWORKID) {
      showNetworkError();
    } else {
      await connectWallet();
      if (clb) {
        await clb();
      }
    }
  };

  return (
    <KaddexWalletContext.Provider
      value={{
        ...kaddexWalletState,
        initializeKaddexWallet,
        disconnectWallet,
        requestSign,
      }}
    >
      {props.children}
    </KaddexWalletContext.Provider>
  );
};

export const KaddexWalletCunsomer = KaddexWalletContext.Consumer;
