import React, { useState, createContext } from 'react';
import pairTokens from '../constants/pairsConfig';
import Pact from 'pact-lang-api';
import { CHAIN_ID, GAS_PRICE, NETWORK, NETWORKID, PRECISION, ENABLE_GAS_STATION, KADDEX_NAMESPACE } from '../constants/contextConstants';
import { useKaddexWalletContext, usePactContext, useWalletContext, useAccountContext } from '.';
import { extractDecimal, reduceBalance } from '../utils/reduceBalance';
import tokenData from '../constants/cryptoCurrencies';
import { handleError, mkReq, parseRes } from '../api/utils';
import { getOneSideLiquidityPairInfo, getPairAccount, getTokenBalanceAccount, pactFetchLocal } from '../api/pact';

export const LiquidityContext = createContext(null);

export const LiquidityProvider = (props) => {
  const pact = usePactContext();
  const { account, setLocalRes } = useAccountContext();
  const { isConnected: isXWalletConnected, requestSign: xWalletRequestSign } = useKaddexWalletContext();
  const wallet = useWalletContext();
  const [liquidityProviderFee, setLiquidityProviderFee] = useState(0.003);
  const [pairListAccount, setPairListAccount] = useState(pairTokens);
  const [wantsKdxRewards, setWantsKdxRewards] = useState(true);

  const addLiquidityWallet = async (token0, token1, amountDesired0, amountDesired1) => {
    try {
      let pair = await getPairAccount(token0.code, token1.code);

      let newAmountDesired0 = amountDesired0;
      let newAmountDesired1 = amountDesired1;
      const pairExists = pairTokens[`${token0.code}:${token1.code}`];
      let pairConfig = null;

      if (!pairExists) {
        newAmountDesired0 = amountDesired1;
        newAmountDesired1 = amountDesired0;
        pairConfig = pairTokens[`${token1.code}:${token0.code}`];
      } else {
        pairConfig = pairExists;
      }

      const contractName = pairConfig.isBoosted ? 'wrapper' : 'exchange';
      const signCmd = {
        pactCode: `(${KADDEX_NAMESPACE}.${contractName}.add-liquidity
            ${tokenData[pairConfig.token0].code}
            ${tokenData[pairConfig.token1].code}
            (read-decimal 'amountDesired0)
            (read-decimal 'amountDesired1)
            (read-decimal 'amountMinimum0)
            (read-decimal 'amountMinimum1)
            ${JSON.stringify(account.account)}
            ${JSON.stringify(account.account)}
            (read-keyset 'user-ks)
          )`,
        caps: [
          ...(ENABLE_GAS_STATION
            ? [Pact.lang.mkCap('Gas Station', 'free gas', `${KADDEX_NAMESPACE}.gas-station.GAS_PAYER`, ['kaddex-free-gas', { int: 1 }, 1.0])]
            : [Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS')]),
          Pact.lang.mkCap('transfer capability', 'Transfer Token to Pool', `${tokenData[pairConfig.token0].code}.TRANSFER`, [
            account.account,
            pair,
            Number(newAmountDesired0),
          ]),
          Pact.lang.mkCap('transfer capability', 'Transfer Token to Pool', `${tokenData[pairConfig.token1].code}.TRANSFER`, [
            account.account,
            pair,
            Number(newAmountDesired1),
          ]),
        ],
        sender: ENABLE_GAS_STATION ? 'kaddex-free-gas' : account.account,
        gasLimit: 16000,
        gasPrice: GAS_PRICE,
        chainId: CHAIN_ID,
        ttl: 600,
        envData: {
          'user-ks': account.guard,
          amountDesired0: reduceBalance(newAmountDesired0, tokenData[pairConfig.token0].precision),
          amountDesired1: reduceBalance(newAmountDesired1, tokenData[pairConfig.token1].precision),
          amountMinimum0: reduceBalance(newAmountDesired0 * (1 - parseFloat(pact.slippage)), tokenData[pairConfig.token0].precision),
          amountMinimum1: reduceBalance(newAmountDesired1 * (1 - parseFloat(pact.slippage)), tokenData[pairConfig.token1].precision),
        },
        signingPubKey: account.guard.keys[0],
        networkId: NETWORKID,
      };
      //alert to sign tx
      wallet.setIsWaitingForWalletAuth(true);
      let command = null;
      if (isXWalletConnected) {
        const res = await xWalletRequestSign(signCmd);
        command = res.signedCmd;
      } else {
        command = await Pact.wallet.sign(signCmd);
      }
      //close alert programmatically
      wallet.setIsWaitingForWalletAuth(false);
      wallet.setWalletSuccess(true);
      //set signedtx
      pact.setPactCmd(command);
      let data = await fetch(`${NETWORK}/api/v1/local`, mkReq(command));
      data = await parseRes(data);
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
      else
        wallet.setWalletError({
          error: true,
          title: 'Wallet Signing Failure',
          content:
            'You cancelled the transaction or did not sign it correctly. Please make sure you sign with the keys of the account linked in Kaddex.',
        });
      console.log(e);
    }
  };

  const addOneSideLiquidityWallet = async (token0, token1, amountDesired0) => {
    const accountDetails = await getTokenBalanceAccount(token0.code, account.account);
    if (accountDetails.result.status === 'success') {
      try {
        const args = await getOneSideLiquidityPairInfo(amountDesired0, pact.slippage, token0.code, token1.code);
        let pair = await getPairAccount(token0.code, token1.code);
        const signCmd = {
          pactCode: `(${KADDEX_NAMESPACE}.wrapper.add-liquidity-one-sided
            ${token0.code}
            ${token1.code}
            (read-decimal 'amountDesired0)
            (read-decimal 'amountMinimum0)
            (read-decimal 'amountMinimum1)
            ${JSON.stringify(account.account)}
            (read-keyset 'user-ks)
            ${JSON.stringify(account.account)}
            (read-keyset 'user-ks)
          )`,
          caps: [
            ...(ENABLE_GAS_STATION
              ? [Pact.lang.mkCap('Gas Station', 'free gas', `${KADDEX_NAMESPACE}.gas-station.GAS_PAYER`, ['kaddex-free-gas', { int: 1 }, 1.0])]
              : [Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS')]),
            Pact.lang.mkCap('transfer capability', 'Transfer Token to Pool', `${token0.code}.TRANSFER`, [
              account.account,
              pair,
              Number(amountDesired0),
            ]),
            Pact.lang.mkCap('transfer capability', 'Transfer Token to Pool', `${token1.code}.TRANSFER`, [
              account.account,
              pair,
              extractDecimal(args.amountB),
            ]),
          ],
          sender: ENABLE_GAS_STATION ? 'kaddex-free-gas' : account.account,
          gasLimit: 16000,
          gasPrice: GAS_PRICE,
          chainId: CHAIN_ID,
          ttl: 600,
          envData: {
            'user-ks': accountDetails.result.data.guard,
            amountDesired0: reduceBalance(amountDesired0, tokenData[token0.name].precision),
            amountMinimum0: reduceBalance(args['amountA-min'], tokenData[token0.name].precision),
            amountMinimum1: reduceBalance(args['amountB-min'], tokenData[token1.name].precision),
          },
          signingPubKey: accountDetails.result.data.guard.keys[0],
          networkId: NETWORKID,
        };
        //alert to sign tx
        wallet.setIsWaitingForWalletAuth(true);
        let command = null;
        if (isXWalletConnected) {
          const res = await xWalletRequestSign(signCmd);
          command = res.signedCmd;
        } else {
          command = await Pact.wallet.sign(signCmd);
        }
        //close alert programmatically
        wallet.setIsWaitingForWalletAuth(false);
        wallet.setWalletSuccess(true);
        //set signedtx
        pact.setPactCmd(command);
        let data = await fetch(`${NETWORK}/api/v1/local`, mkReq(command));
        data = await parseRes(data);
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
        else
          wallet.setWalletError({
            error: true,
            title: 'Wallet Signing Failure',
            content:
              'You cancelled the transaction or did not sign it correctly. Please make sure you sign with the keys of the account linked in Kaddex.',
          });
        console.log(e);
      }
    } else {
      wallet.setWalletError({
        error: true,
        title: 'Invalid Action',
        content: `You cannot perform this action with this account. Make sure you have the selected token on chain ${CHAIN_ID}`,
      });
    }
  };

  const removeLiquidityWallet = async (token0, token1, liquidity, previewAmount) => {
    try {
      let pair = await getPairAccount(token0, token1);

      const pairConfig = pairTokens[`${token0}:${token1}`] || pairTokens[`${token1}:${token0}`];
      const pactCode = pairConfig.isBoosted
        ? `(${KADDEX_NAMESPACE}.wrapper.remove-liquidity
        ${token0}
        ${token1}
        (read-decimal 'liquidity)
        0.0
        0.0
        ${JSON.stringify(account.account)}
        ${JSON.stringify(account.account)}
        (read-keyset 'user-ks)
        ${wantsKdxRewards}
      )`
        : `(${KADDEX_NAMESPACE}.exchange.remove-liquidity
        ${token0}
        ${token1}
        (read-decimal 'liquidity)
        0.0
        0.0
        ${JSON.stringify(account.account)}
        ${JSON.stringify(account.account)}
        (read-keyset 'user-ks)
      )`;
      const signCmd = {
        pactCode,
        caps: [
          ...(ENABLE_GAS_STATION
            ? [Pact.lang.mkCap('Gas Station', 'free gas', `${KADDEX_NAMESPACE}.gas-station.GAS_PAYER`, ['kaddex-free-gas', { int: 1 }, 1.0])]
            : [Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS')]),
          Pact.lang.mkCap('transfer capability', 'Transfer Token to Pool', `${KADDEX_NAMESPACE}.tokens.TRANSFER`, [
            pairConfig.name,
            account.account,
            pair,
            Number(liquidity),
          ]),
        ],
        sender: ENABLE_GAS_STATION ? 'kaddex-free-gas' : account.account,
        gasLimit: 16000,
        gasPrice: GAS_PRICE,
        chainId: CHAIN_ID,
        ttl: 600,
        envData: {
          'user-ks': account.guard,
          liquidity: reduceBalance(liquidity, PRECISION),
        },
        signingPubKey: account.guard.keys[0],
        networkId: NETWORKID,
      };
      //alert to sign tx
      wallet.setIsWaitingForWalletAuth(true);
      let cmd = null;
      if (isXWalletConnected) {
        const res = await xWalletRequestSign(signCmd);
        cmd = res.signedCmd;
      } else {
        cmd = await Pact.wallet.sign(signCmd);
      }
      //close alert programmatically
      wallet.setIsWaitingForWalletAuth(false);
      wallet.setWalletSuccess(true);
      pact.setPactCmd(cmd);
      let data = await fetch(`${NETWORK}/api/v1/local`, mkReq(cmd));
      data = await parseRes(data);
      let previewData = await removeLiquidityPreview(token0, token1, previewAmount);
      if (!previewData.errorMessage) {
        const result = { ...data, resPreview: { ...previewData } };
        setLocalRes(result);
        return result;
      } else {
        setLocalRes(data);
        return data;
      }
    } catch (e) {
      setLocalRes({});
      if (e.message.includes('Failed to fetch'))
        wallet.setWalletError({
          error: true,
          title: 'No Wallet',
          content: 'Please make sure you open and login to your wallet.',
        });
      else
        wallet.setWalletError({
          error: true,
          title: 'Wallet Signing Failure',
          content:
            'You cancelled the transaction or did not sign it correctly. Please make sure you sign with the keys of the account linked in Kaddex.',
        });
      console.log(e);
    }
  };

  const removeLiquidityPreview = async (token0, token1, amount) => {
    try {
      const pactCode = `(${KADDEX_NAMESPACE}.wrapper.preview-remove-liquidity
        ${token0}
        ${token1}
        ${JSON.stringify(account.account)}
        (* (at 'liquidity-tokens (kaddex.wrapper.get-liquidity-position ${token0} ${token1} ${JSON.stringify(account.account)})) ${amount})
      )`;
      return await pactFetchLocal(pactCode);
    } catch (e) {
      return handleError(e);
    }
  };

  const contextValue = {
    liquidityProviderFee,
    setLiquidityProviderFee,
    pairListAccount,
    setPairListAccount,
    addLiquidityWallet,
    addOneSideLiquidityWallet,
    removeLiquidityWallet,
    removeLiquidityPreview,
    wantsKdxRewards,
    setWantsKdxRewards,
  };

  return <LiquidityContext.Provider value={contextValue}>{props.children}</LiquidityContext.Provider>;
};

export const LiquidityConsumer = LiquidityContext.Consumer;
