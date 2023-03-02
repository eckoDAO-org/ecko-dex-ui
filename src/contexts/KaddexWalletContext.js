/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, createContext, useEffect, useCallback } from 'react';
import { useAccountContext, useWalletContext, useNotificationContext } from '.';
import { NETWORK, NETWORKID } from '../constants/contextConstants';
import { WALLET } from '../constants/wallet';
import useLocalStorage from '../hooks/useLocalStorage';
import { genRandomString } from '../utils/string-utils';

export const KaddexWalletContext = createContext();

const initialKaddexWalletState = {
  isConnected: false,
  isInstalled: false,
  NETWORK,
  account: null,
};

export const KaddexWalletProvider = (props) => {
  const [kadenaExt, setKadenaExt] = useState(null);
  const [kaddexWalletState, setKaddexWalletState] = useLocalStorage('kaddexWalletState', initialKaddexWalletState);

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

  useEffect(() => {
    window.addEventListener('load', initialize);
  }, [initialize]);

  useEffect(() => {
    const registerEvents = async () => {
      if (kadenaExt) {
        kadenaExt.on('res_accountChange', async (response) => {
          console.log('X-Wallet: LISTEN res_accountChange', response);
          await checkStatus();
        });
        kadenaExt.on('res_checkStatus', onCheckStatusResponse);
        kadenaExt.on('res_sendKadena', (response) => {
          console.log('X-Wallet: LISTEN res_SendKadena', response);
        });
        kadenaExt.on('res_disconnect', () => {});
      }
    };
    registerEvents();
    if (kadenaExt && kaddexWalletState.isConnected) {
      setAccountData();
    }
  }, [kadenaExt]);

  useEffect(() => {
    if (kaddexWalletState.isConnected && (!wallet || !account?.account)) {
      disconnectWallet();
    }
  }, [wallet, kaddexWalletState, account]);

  /**
   * Used by ConnectModal
   */
  const initializeKaddexWallet = async () => {
    console.log('!!!initializeKaddexWallet');
    const networkInfo = await getNetworkInfo();
    console.log('networkInfo', networkInfo);
    if (networkInfo.networkId !== NETWORKID) {
      showNetworkError();
    } else {
      const connectResponse = await connectWallet();
      console.log('connectResponse', connectResponse);
      if (connectResponse?.status === 'success') {
        await setAccountData();
      }
    }
  };

  const connectWallet = async () => {
    const connect = await kadenaExt.request({
      method: 'kda_connect',
      networkId: NETWORKID,
    });
    return connect;
  };

  const disconnectWallet = async () => {
    if (kadenaExt) {
      console.log('X-Wallet: SEND disconnect request');
      setKaddexWalletState({
        ...kaddexWalletState,
        account: null,
        isConnected: false,
      });
      await kadenaExt.request({
        method: 'kda_disconnect',
        networkId: NETWORKID,
      });
      logout();
    }
  };

  const getNetworkInfo = async () => {
    console.log('getNetworkInfo');
    const network = await kadenaExt.request({
      method: 'kda_getNetwork',
    });
    console.log('X-Wallet: SEND kda_getNetwork request', network);
    return network;
  };

  const checkStatus = async () => {
    console.log('X-Wallet: SEND kda_checkStatus request');
    await kadenaExt?.request({
      method: 'kda_checkStatus',
      networkId: NETWORKID,
    });
  };

  const getAccountInfo = async () => {
    const account = await kadenaExt.request({
      method: 'kda_requestAccount',
      networkId: NETWORKID,
    });
    console.log('X-Wallet: SEND kda_requestAccount request', account);
    return account;
  };

  const requestSign = async (signingCmd) => {
    const account = await getAccountInfo();
    if (account.status === 'fail') {
      alertDisconnect();
    } else {
      console.log('X-Wallet: SEND kda_requestSign request');
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
    console.log('X-Wallet: SETTING ACCOUNT DATA');
    const acc = await getAccountInfo();
    if (acc.wallet) {
      console.log('X-Wallet: SETTING ACCOUNT DATA - WALLET FOUNDED', acc);
      await setVerifiedAccount(acc.wallet.account);
      await signingWallet();
      await setSelectedWallet(WALLET.ECKOWALLET);
      setKaddexWalletState({
        account: acc.wallet.account,
        isInstalled: true,
        isConnected: true,
      });
      showNotification({
        toastId: genRandomString(),
        title: `${WALLET.ECKOWALLET.name} was connected`,
        type: 'game-mode',
        icon: WALLET.ECKOWALLET.notificationLogo,
        closeButton: false,
        titleStyle: { fontSize: 13 },
        autoClose: 2000,
      });
    } else if (kaddexWalletState.isConnected) {
      console.log('X-Wallet: SETTING ACCOUNT DATA - WALLET NOT FOUND CONNECTING');
      const connectRes = await connectWallet();
      if (connectRes.status === 'success') {
        await setAccountData();
      }
    } else {
      console.log('X-Wallet: SETTING ACCOUNT DATA - NOT CONNECTED');
    }
  };

  const alertDisconnect = () => {
    console.log('!!!DISCONNECTING');
    showNotification({
      title: 'X Wallet error',
      message: 'Wallet not connected',
      type: STATUSES.ERROR,
    });
    logout();
  };

  const onCheckStatusResponse = async (response) => {
    // I have to use local storage directly because of state is null on callback listener
    const localState = localStorage.getItem('kaddexWalletState') && JSON.parse(localStorage.getItem('kaddexWalletState'));
    if (localState?.isConnected && response?.result?.status === 'fail' && response?.result?.message === 'Not connected') {
      const connectRes = await connectWallet();
      if (connectRes.status === 'success') {
        await setAccountData();
      }
    }
  };

  const showNetworkError = () => {
    showNotification({
      title: 'Wallet error',
      message: `Please set the correct network: ${NETWORKID}`,
      type: STATUSES.ERROR,
      autoClose: 5000,
      hideProgressBar: false,
    });
  };

  // const showChainError = (selectedChain) => {
  //   showNotification({
  //     title: 'Wallet error',
  //     message: `Please set chain ${CHAIN_ID} ${selectedChain ? `(chain ${selectedChain} selected)` : ''}`,
  //     type: STATUSES.WARNING,
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //   });
  // };

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
