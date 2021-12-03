import React, { useState, createContext } from 'react';
import pairTokens from '../constants/pairs.json';
import Pact from 'pact-lang-api';
import { chainId, creationTime, GAS_PRICE, network, NETWORKID, PRECISION, ENABLE_GAS_STATION } from '../constants/contextConstants';
import { useKaddexWalletContext, useSwapContext, usePactContext, useWalletContext, useAccountContext } from '.';
import { reduceBalance } from '../utils/reduceBalance';
import tokenData from '../constants/cryptoCurrencies';
import pwPrompt from '../components/alerts/pwPrompt';
import { decryptKey } from '../utils/keyUtils';

export const LiquidityContext = createContext(null);

export const LiquidityProvider = (props) => {
  const pact = usePactContext();
  const { account, setLocalRes } = useAccountContext();
  const { isConnected: isKadenaWalletConnected, requestSign: kadenaRequestSign } = useKaddexWalletContext();
  const wallet = useWalletContext();
  const swap = useSwapContext();
  const [liquidityProviderFee, setLiquidityProviderFee] = useState(0.003);
  const [pairListAccount, setPairListAccount] = useState(pairTokens);

  const getPairListAccountBalance = async (account) => {
    try {
      let currentPair = pact.pairList.length ? pairTokens : pact.pairList;
      const tokenPairList = Object.keys(currentPair).reduce((accum, pair) => {
        accum += `[${pair.split(':').join(' ')}] `;
        return accum;
      }, '');
      let data = await Pact.fetch.local(
        {
          pactCode: `
            (namespace 'free)

            (module kswap-read G

              (defcap G ()
                true)

              (defun pair-info (pairList:list)
                (let* (
                  (token0 (at 0 pairList))
                  (token1 (at 1 pairList))
                  (p (kswap.exchange.get-pair token0 token1))
                  (reserveA (kswap.exchange.reserve-for p token0))
                  (reserveB (kswap.exchange.reserve-for p token1))
                  (totalBal (kswap.tokens.total-supply (kswap.exchange.get-pair-key token0 token1)))
                  (acctBal
                      (try 0.0 (kswap.tokens.get-balance (kswap.exchange.get-pair-key token0 token1) ${JSON.stringify(account)})
                    ))
                )
                [(kswap.exchange.get-pair-key token0 token1)
                 reserveA
                 reserveB
                 totalBal
                 acctBal
                 (* reserveA (/ acctBal totalBal))
                 (* reserveB (/ acctBal totalBal))
               ]
              ))
            )
            (map (kswap-read.pair-info) [${tokenPairList}])
             `,
          meta: Pact.lang.mkMeta('', chainId, GAS_PRICE, 3000, creationTime(), 600),
        },
        network
      );
      if (data.result.status === 'success') {
        let dataList = data.result.data.reduce((accum, data) => {
          accum[data[0]] = {
            balance: data[4],
            supply: data[3],
            reserves: [data[1], data[2]],
            pooledAmount: [data[5], data[6]],
          };
          return accum;
        }, {});

        const pairList = Object.values(pairTokens).map((pair) => {
          return {
            ...pair,
            ...dataList[pair.name],
          };
        });
        setPairListAccount(pairList);
      } else {
        setPairListAccount({ error: data.result.status });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const createTokenPairLocal = async (token0, token1, amountDesired0, amountDesired1) => {
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: `(kswap.exchange.create-pair
              ${token0.code}
              ${token1.code}
              ""
            )`,
          meta: Pact.lang.mkMeta('', chainId, GAS_PRICE, 5000, creationTime(), 28800),
          networkId: NETWORKID,
        },
        network
      );
      let pair = data.result.data.account;
      try {
        let cmd = {
          pactCode: `
            (kswap.exchange.create-pair
                ${token0.code}
                ${token1.code}
                ""
            )
            (kswap.exchange.add-liquidity
                ${token0.code}
                ${token1.code}
                (read-decimal 'amountDesired0)
                (read-decimal 'amountDesired1)
                (read-decimal 'amountMinimum0)
                (read-decimal 'amountMinimum1)
                ${JSON.stringify(account.account)}
                ${JSON.stringify(account.account)}
                (read-keyset 'user-ks)
              )`,
          keyPairs: {
            ...wallet.keyPair,
            clist: [
              {
                name: `${token0.code}.TRANSFER`,
                args: [account.account, pair, Number(amountDesired0)],
              },
              {
                name: `${token1.code}.TRANSFER`,
                args: [account.account, pair, Number(amountDesired1)],
              },
              ...(ENABLE_GAS_STATION
                ? [
                    {
                      name: 'kswap.gas-station.GAS_PAYER',
                      args: ['free-gas', { int: 1 }, 1.0],
                    },
                  ]
                : [Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS').cap]),
            ],
          },
          envData: {
            'user-ks': [wallet.keyPair.publicKey],
            amountDesired0: reduceBalance(amountDesired0, tokenData[token0.name].precision),
            amountDesired1: reduceBalance(amountDesired1, tokenData[token1.name].precision),
            amountMinimum0: reduceBalance(amountDesired0 * (1 - parseFloat(pact.slippage)), tokenData[token0.name].precision),
            amountMinimum1: reduceBalance(amountDesired1 * (1 - parseFloat(pact.slippage)), tokenData[token1.name].precision),
          },
          meta: Pact.lang.mkMeta(ENABLE_GAS_STATION ? 'kswap-free-gas' : account.account, chainId, GAS_PRICE, 5000, creationTime(), 600),
          networkId: NETWORKID,
        };
        let data = await Pact.fetch.local(cmd, network);
        swap.setCmd(cmd);
        setLocalRes(data);
        return data;
      } catch (e) {
        setLocalRes({});
        console.log(e);
        return -1;
      }
    } catch (e) {
      console.log(e);
    }
  };
  const addLiquidityLocal = async (token0, token1, amountDesired0, amountDesired1) => {
    try {
      let privKey = wallet.signing.key;
      if (wallet.signing.method === 'pk+pw') {
        // mod with new wallet json
        const pw = await pwPrompt();
        privKey = await decryptKey(pw);
      }
      if (privKey.length !== 64) {
        return;
      }
      let pair = await swap.getPairAccount(token0.code, token1.code);
      let cmd = {
        pactCode: `(kswap.exchange.add-liquidity
              ${token0.code}
              ${token1.code}
              (read-decimal 'amountDesired0)
              (read-decimal 'amountDesired1)
              (read-decimal 'amountMinimum0)
              (read-decimal 'amountMinimum1)
              ${JSON.stringify(account.account)}
              ${JSON.stringify(account.account)}
              (read-keyset 'user-ks)
            )`,
        keyPairs: {
          publicKey: account.guard.keys[0],
          secretKey: privKey,
          clist: [
            {
              name: `${token0.code}.TRANSFER`,
              args: [account.account, pair, Number(amountDesired0)],
            },
            {
              name: `${token1.code}.TRANSFER`,
              args: [account.account, pair, Number(amountDesired1)],
            },
            ...(ENABLE_GAS_STATION
              ? [
                  {
                    name: 'kswap.gas-station.GAS_PAYER',
                    args: ['free-gas', { int: 1 }, 1.0],
                  },
                ]
              : [Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS').cap]),
          ],
        },
        envData: {
          'user-ks': account.guard,
          amountDesired0: reduceBalance(amountDesired0, tokenData[token0.name].precision),
          amountDesired1: reduceBalance(amountDesired1, tokenData[token1.name].precision),
          amountMinimum0: reduceBalance(amountDesired0 * (1 - parseFloat(pact.slippage)), tokenData[token0.name].precision),
          amountMinimum1: reduceBalance(amountDesired1 * (1 - parseFloat(pact.slippage)), tokenData[token1.name].precision),
        },
        meta: Pact.lang.mkMeta(ENABLE_GAS_STATION ? 'kswap-free-gas' : account.account, chainId, GAS_PRICE, 3000, creationTime(), 600),
        networkId: NETWORKID,
      };
      let data = await Pact.fetch.local(cmd, network);
      swap.setCmd(cmd);
      setLocalRes(data);
      return data;
    } catch (e) {
      setLocalRes({});
      console.log(e);
      return -1;
    }
  };

  const addLiquidityWallet = async (token0, token1, amountDesired0, amountDesired1) => {
    try {
      let pair = await swap.getPairAccount(token0.code, token1.code);
      const signCmd = {
        pactCode: `(kswap.exchange.add-liquidity
            ${token0.code}
            ${token1.code}
            (read-decimal 'amountDesired0)
            (read-decimal 'amountDesired1)
            (read-decimal 'amountMinimum0)
            (read-decimal 'amountMinimum1)
            ${JSON.stringify(account.account)}
            ${JSON.stringify(account.account)}
            (read-keyset 'user-ks)
          )`,
        caps: [
          ...(ENABLE_GAS_STATION ? [Pact.lang.mkCap('Gas Station', 'free gas', 'kswap.gas-station.GAS_PAYER', ['free-gas', { int: 1 }, 1.0])] : []),
          Pact.lang.mkCap('transfer capability', 'Transfer Token to Pool', `${token0.code}.TRANSFER`, [
            account.account,
            pair,
            Number(amountDesired0),
          ]),
          Pact.lang.mkCap('transfer capability', 'Transfer Token to Pool', `${token1.code}.TRANSFER`, [
            account.account,
            pair,
            Number(amountDesired1),
          ]),
          ...(!ENABLE_GAS_STATION ? [Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS')] : []),
        ],
        sender: ENABLE_GAS_STATION ? 'kswap-free-gas' : account.account,
        gasLimit: 3000,
        gasPrice: GAS_PRICE,
        chainId: chainId,
        ttl: 600,
        envData: {
          'user-ks': account.guard,
          amountDesired0: reduceBalance(amountDesired0, tokenData[token0.name].precision),
          amountDesired1: reduceBalance(amountDesired1, tokenData[token1.name].precision),
          amountMinimum0: reduceBalance(amountDesired0 * (1 - parseFloat(pact.slippage)), tokenData[token0.name].precision),
          amountMinimum1: reduceBalance(amountDesired1 * (1 - parseFloat(pact.slippage)), tokenData[token1.name].precision),
        },
        signingPubKey: account.guard.keys[0],
        networkId: NETWORKID,
      };
      //alert to sign tx
      /* walletLoading(); */
      wallet.setIsWaitingForWalletAuth(true);
      let command = null;
      if (isKadenaWalletConnected) {
        const res = await kadenaRequestSign(signCmd);
        command = res.signedCmd;
      } else {
        command = await Pact.wallet.sign(signCmd);
      }
      //close alert programmatically
      /* swal.close(); */
      wallet.setIsWaitingForWalletAuth(false);
      wallet.setWalletSuccess(true);
      //set signedtx
      swap.setCmd(command);
      let data = await fetch(`${network}/api/v1/local`, swap.mkReq(command));
      data = await swap.parseRes(data);
      setLocalRes(data);
      return data;
    } catch (e) {
      //wallet error alert
      if (e.message.includes('Failed to fetch'))
        wallet.setWalletError({
          error: true,
          title: 'No Wallet',
          content: 'Please make sure you open and login to your wallet.',
        });
      //walletError();
      else
        wallet.setWalletError({
          error: true,
          title: 'Wallet Signing Failure',
          content:
            'You cancelled the transaction or did not sign it correctly. Please make sure you sign with the keys of the account linked in Kadenaswap.',
        }); //walletSigError();
      console.log(e);
    }
  };

  const removeLiquidityLocal = async (token0, token1, liquidity) => {
    try {
      let privKey = wallet.signing.key;
      if (wallet.signing.method === 'pk+pw') {
        const pw = await pwPrompt();
        privKey = await decryptKey(pw);
      }
      if (privKey.length !== 64) {
        return;
      }
      let pairKey = await pact.getPairKey(token0, token1);
      let pair = await swap.getPairAccount(token0, token1);
      let cmd = {
        pactCode: `(kswap.exchange.remove-liquidity
              ${token0}
              ${token1}
              (read-decimal 'liquidity)
              0.0
              0.0
              ${JSON.stringify(account.account)}
              ${JSON.stringify(account.account)}
              (read-keyset 'user-ks)
            )`,
        networkId: NETWORKID,
        keyPairs: {
          publicKey: account.guard.keys[0],
          secretKey: privKey,
          clist: [
            {
              name: `kswap.tokens.TRANSFER`,
              args: [pairKey, account.account, pair, Number(liquidity)],
            },
            {
              name: `kswap.tokens.TRANSFER`,
              args: [pairKey, account.account, pair, Number(liquidity)],
            },
            ...(ENABLE_GAS_STATION
              ? [
                  {
                    name: 'kswap.gas-station.GAS_PAYER',
                    args: ['free-gas', { int: 1 }, 1.0],
                  },
                ]
              : [Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS').cap]),
          ],
        },
        envData: {
          'user-ks': account.guard,
          liquidity: reduceBalance(liquidity, PRECISION),
        },
        meta: Pact.lang.mkMeta(ENABLE_GAS_STATION ? 'kswap-free-gas' : account.account, chainId, GAS_PRICE, 3000, creationTime(), 600),
      };
      swap.setCmd(cmd);
      let data = await Pact.fetch.local(cmd, network);
      setLocalRes(data);
      return data;
    } catch (e) {
      setLocalRes({});
      if (e.message.includes('Failed to fetch')) wallet.walletError();
      else wallet.walletSigError();
      return -1;
    }
  };

  const removeLiquidityWallet = async (token0, token1, liquidity) => {
    try {
      let pairKey = await pact.getPairKey(token0, token1);
      let pair = await swap.getPairAccount(token0, token1);
      const signCmd = {
        pactCode: `(kswap.exchange.remove-liquidity
            ${token0}
            ${token1}
            (read-decimal 'liquidity)
            0.0
            0.0
            ${JSON.stringify(account.account)}
            ${JSON.stringify(account.account)}
            (read-keyset 'user-ks)
          )`,
        caps: [
          ...(ENABLE_GAS_STATION ? [Pact.lang.mkCap('Gas Station', 'free gas', 'kswap.gas-station.GAS_PAYER', ['free-gas', { int: 1 }, 1.0])] : []),
          Pact.lang.mkCap('transfer capability', 'Transfer Token to Pool', `kswap.tokens.TRANSFER`, [
            pairKey,
            account.account,
            pair,
            Number(liquidity),
          ]),
          Pact.lang.mkCap('transfer capability', 'Transfer Token to Pool', `kswap.tokens.TRANSFER`, [
            pairKey,
            account.account,
            pair,
            Number(liquidity),
          ]),
          ...(!ENABLE_GAS_STATION ? [Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS')] : []),
        ],
        sender: ENABLE_GAS_STATION ? 'kswap-free-gas' : account.account,
        gasLimit: 3000,
        gasPrice: GAS_PRICE,
        chainId: chainId,
        ttl: 600,
        envData: {
          'user-ks': account.guard,
          liquidity: reduceBalance(liquidity, PRECISION),
        },
        signingPubKey: account.guard.keys[0],
        networkId: NETWORKID,
      };
      //alert to sign tx
      /* walletLoading(); */
      wallet.setIsWaitingForWalletAuth(true);
      const cmd = await Pact.wallet.sign(signCmd);
      //close alert programmatically
      /* swal.close(); */
      wallet.setIsWaitingForWalletAuth(false);
      wallet.setWalletSuccess(true);
      swap.setCmd(cmd);
      let data = await fetch(`${network}/api/v1/local`, swap.mkReq(cmd));
      data = await swap.parseRes(data);
      setLocalRes(data);
      return data;
    } catch (e) {
      //wallet error alert
      setLocalRes({});
      if (e.message.includes('Failed to fetch'))
        wallet.setWalletError({
          error: true,
          title: 'No Wallet',
          content: 'Please make sure you open and login to your wallet.',
        });
      //walletError();
      else
        wallet.setWalletError({
          error: true,
          title: 'Wallet Signing Failure',
          content:
            'You cancelled the transaction or did not sign it correctly. Please make sure you sign with the keys of the account linked in Kadenaswap.',
        }); //walletSigError();
      console.log(e);
    }
  };

  const contextValue = {
    liquidityProviderFee,
    setLiquidityProviderFee,
    pairListAccount,
    setPairListAccount,
    getPairListAccountBalance,
    createTokenPairLocal,
    addLiquidityLocal,
    addLiquidityWallet,
    removeLiquidityLocal,
    removeLiquidityWallet,
  };

  return <LiquidityContext.Provider value={contextValue}>{props.children}</LiquidityContext.Provider>;
};

export const LiquidityConsumer = LiquidityContext.Consumer;
