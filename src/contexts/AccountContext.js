/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useState } from 'react';
import Pact from 'pact-lang-api';
import { getCorrectBalance } from '../utils/reduceBalance';
import { CHAIN_ID, creationTime, GAS_PRICE, NETWORK } from '../constants/contextConstants';
import useLocalStorage from '../hooks/useLocalStorage';
import { useGameEditionContext } from '.';
import { getTokenBalanceAccount } from '../api/pact';
// import { useWalletConnect } from '../utils/walletConnect';

export const AccountContext = createContext();
export const AccountProvider = (props) => {
  const [fetchAccountBalance, setFetchAccountBalance] = useState(false);
  const [localRes, setLocalRes] = useState(null);
  const { gameEditionView } = useGameEditionContext();

  const [account, setAccount, removeAccount] = useLocalStorage('acct', { account: null, guard: null, balance: 0 });
  const [privKey, setPrivKey, removePrivKey] = useLocalStorage('pk', '');

  const [registered, setRegistered] = useState(false);

  const [tokenFromAccount, setTokenFromAccount] = useState({
    account: null,
    guard: null,
    balance: 0,
  });
  const [tokenToAccount, setTokenToAccount] = useState({
    account: null,
    guard: null,
    balance: 0,
  });

  useEffect(() => {
    if (account.account) setVerifiedAccount(account.account);
  }, [fetchAccountBalance]);

  useEffect(() => {
    if (account.account) setRegistered(true);
  }, [registered]);

  // const { subscribeToEvents } = useWalletConnect();
  /* useEffect(() => {
    subscribeToEvents({
      onPing: () => {},
      onAccountChange: (data) => {},
      onChainIdChange: (data) => {},
    });
  }, []); */

  const setVerifiedAccount = async (accountName, onConnectionSuccess) => {
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: `(coin.details ${JSON.stringify(accountName)})`,
          meta: Pact.lang.mkMeta('', CHAIN_ID, GAS_PRICE, 3000, creationTime(), 600),
        },
        NETWORK
      );
      if (data.result.status === 'success') {
        await setAccount({
          ...data.result.data,
          balance: getCorrectBalance(data.result.data.balance),
        });
        if (onConnectionSuccess) {
          onConnectionSuccess();
        }
      } else {
        await setAccount({ account: accountName, guard: null, balance: 0 });
        /* await swal({
          text: `Please make sure the account ${reduceToken(accountName)} exist on chain 2 of the kadena blockchain`,
          title: 'Connection Issue: How to fix this?',
        }); */
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getTokenAccount = async (token, account, first) => {
    try {
      let data = await getTokenBalanceAccount(token, account);

      if (data.result.status === 'success') {
        // setTokenAccount({...data.result.data, balance: getCorrectBalance(data.result.data.balance)});
        first ? setTokenFromAccount(data.result.data) : setTokenToAccount(data.result.data);
        return data.result.data;
      } else if (data.result.status === 'failure') {
        first ? setTokenFromAccount({ account: null, guard: null, balance: 0 }) : setTokenToAccount({ account: null, guard: null, balance: 0 });
        return { account: null, guard: null, balance: 0 };
      }
    } catch (e) {
      console.log(e);
    } finally {
      setFetchAccountBalance(false);
    }
  };

  const logout = () => {
    removeAccount();
    localStorage.removeItem('signing', null);
    removePrivKey();
    localStorage.removeItem('wallet');
    if (!gameEditionView) {
      window.location.reload();
    }
  };

  const contextValues = {
    account,
    privKey,
    setPrivKey,
    fetchAccountBalance,
    setFetchAccountBalance,
    localRes,
    setLocalRes,
    setVerifiedAccount,
    registered,
    setRegistered,
    getTokenAccount,
    tokenToAccount,
    tokenFromAccount,
    logout,
  };

  return <AccountContext.Provider value={contextValues}>{props.children}</AccountContext.Provider>;
};

export const AccountConsumer = AccountContext.Consumer;
