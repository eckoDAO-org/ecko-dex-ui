import React, { useState, createContext } from 'react';
import Pact from 'pact-lang-api';
import { CHAIN_ID, NETWORK, NETWORKID, PRECISION, KADDEX_NAMESPACE } from '../constants/contextConstants';
import { useKaddexWalletContext, usePactContext, useWalletContext, useAccountContext, useWalletConnectContext } from '.';
import { extractDecimal, reduceBalance } from '../utils/reduceBalance';
import { handleError, mkReq, parseRes } from '../api/utils';
import { getOneSideLiquidityPairInfo, getPairAccount, getTokenBalanceAccount, pactFetchLocal } from '../api/pact';

export const LiquidityContext = createContext(null);

export const LiquidityProvider = (props) => {
  const pact = usePactContext();
  const { account, setLocalRes } = useAccountContext();
  const { isConnected: isXWalletConnected, requestSign: xWalletRequestSign } = useKaddexWalletContext();
  const {
    pairingTopic: isWalletConnectConnected,
    requestSignTransaction: walletConnectRequestSign,
    sendTransactionUpdateEvent: walletConnectSendTransactionUpdateEvent,
  } = useWalletConnectContext();
  const wallet = useWalletContext();
  const [pairListAccount, setPairListAccount] = useState(pact.allPairs);
  const [wantsKdxRewards, setWantsKdxRewards] = useState(true);

  const addLiquidityWallet = async (token0, token1, amountDesired0, amountDesired1) => {
    try {
      let pair = await getPairAccount(token0.code, token1.code);

      let newAmountDesired0 = amountDesired0;
      let newAmountDesired1 = amountDesired1;
      const pairExists = pact.allPairs[`${token0.code}:${token1.code}`];
      let pairConfig = null;

      if (!pairExists) {
        newAmountDesired0 = amountDesired1;
        newAmountDesired1 = amountDesired0;
        pairConfig = pact.allPairs[`${token1.code}:${token0.code}`];
      } else {
        pairConfig = pairExists;
      }

      const contractName = pairConfig.isBoosted ? 'wrapper' : 'exchange';
      const signCmd = {
        pactCode: `(${KADDEX_NAMESPACE}.${contractName}.add-liquidity
            ${pact.allTokens[pairConfig.token0].code}
            ${pact.allTokens[pairConfig.token1].code}
            (read-decimal 'amountDesired0)
            (read-decimal 'amountDesired1)
            (read-decimal 'amountMinimum0)
            (read-decimal 'amountMinimum1)
            ${JSON.stringify(account.account)}
            ${JSON.stringify(account.account)}
            (read-keyset 'user-ks)
          )`,
        caps: [
          ...(pact.enableGasStation
            ? [Pact.lang.mkCap('Gas Station', 'free gas', `${KADDEX_NAMESPACE}.gas-station.GAS_PAYER`, ['kaddex-free-gas', { int: 1 }, 1.0])]
            : [Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS')]),
          Pact.lang.mkCap('transfer capability', 'Transfer Token to Pool', `${pact.allTokens[pairConfig.token0].code}.TRANSFER`, [
            account.account,
            pair,
            Number(newAmountDesired0),
          ]),
          Pact.lang.mkCap('transfer capability', 'Transfer Token to Pool', `${pact.allTokens[pairConfig.token1].code}.TRANSFER`, [
            account.account,
            pair,
            Number(newAmountDesired1),
          ]),
        ],
        sender: pact.enableGasStation ? 'kaddex-free-gas' : account.account,
        gasLimit: Number(pact.gasConfiguration.gasLimit),
        gasPrice: parseFloat(pact.gasConfiguration.gasPrice),
        chainId: CHAIN_ID,
        ttl: 600,
        envData: {
          'user-ks': account.guard,
          amountDesired0: reduceBalance(newAmountDesired0, pact.allTokens[pairConfig.token0].precision),
          amountDesired1: reduceBalance(newAmountDesired1, pact.allTokens[pairConfig.token1].precision),
          amountMinimum0: reduceBalance(newAmountDesired0 * (1 - parseFloat(pact.slippage)), pact.allTokens[pairConfig.token0].precision),
          amountMinimum1: reduceBalance(newAmountDesired1 * (1 - parseFloat(pact.slippage)), pact.allTokens[pairConfig.token1].precision),
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
      } else if (isWalletConnectConnected) {
        const res = await walletConnectRequestSign(account.account, NETWORKID, {
          code: signCmd.pactCode,
          data: signCmd.envData,
          ...signCmd,
        });
        command = res.body;
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
      const eventData = {
        ...data,
        amountFrom: Math.max(
          reduceBalance(newAmountDesired0 * (1 - parseFloat(pact.slippage)), pact.allTokens[pairConfig.token0].precision),
          reduceBalance(newAmountDesired0, pact.allTokens[pairConfig.token0].precision)
        ),
        amountTo: Math.max(
          reduceBalance(newAmountDesired1 * (1 - parseFloat(pact.slippage)), pact.allTokens[pairConfig.token1].precision),
          reduceBalance(newAmountDesired1, pact.allTokens[pairConfig.token1].precision)
        ),
        tokenAddressFrom: pact.allTokens[pairConfig.token0].code,
        tokenAddressTo: pact.allTokens[pairConfig.token1].code,
        coinFrom: pact.allTokens[pairConfig.token0].name,
        coinTo: pact.allTokens[pairConfig.token1].name,
        type: 'LIQUIDITY DOUBLE SIDE',
      };
      if (isWalletConnectConnected) {
        await walletConnectSendTransactionUpdateEvent(NETWORKID, eventData);
      }
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
            'You cancelled the transaction or did not sign it correctly. Please make sure you sign with the keys of the account linked in eckoDEX.',
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
        const pairConfig = pact.allPairs[`${token0.code}:${token1.code}`] || pact.allPairs[`${token1.code}:${token0.code}`];
        const useWrapper = pairConfig.isBoosted ? true : false;

        const signCmd = {
          pactCode: `(${KADDEX_NAMESPACE}.liquidity-helper.add-liquidity-one-sided
            ${token0.code}
            ${token1.code}
            (read-decimal 'amountDesired0)
            (read-decimal 'amountMinimum0)
            (read-decimal 'amountMinimum1)
            ${JSON.stringify(account.account)}
            (read-keyset 'user-ks)
            ${JSON.stringify(account.account)}
            (read-keyset 'user-ks)
            ${useWrapper}
          )`,
          caps: [
            ...(pact.enableGasStation
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
          sender: pact.enableGasStation ? 'kaddex-free-gas' : account.account,
          gasLimit: Number(pact.gasConfiguration.gasLimit),
          gasPrice: parseFloat(pact.gasConfiguration.gasPrice),
          chainId: CHAIN_ID,
          ttl: 600,
          envData: {
            'user-ks': accountDetails.result.data.guard,
            amountDesired0: reduceBalance(amountDesired0, pact.allTokens[token0.name].precision),
            amountMinimum0: reduceBalance(args['amountA-min'], pact.allTokens[token0.name].precision),
            amountMinimum1: reduceBalance(args['amountB-min'], pact.allTokens[token1.name].precision),
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
        } else if (isWalletConnectConnected) {
          const res = await walletConnectRequestSign(account.account, NETWORKID, {
            code: signCmd.pactCode,
            data: signCmd.envData,
            ...signCmd,
          });
          if (res?.status === 'fail') {
            wallet.setWalletError({
              error: true,
              title: 'Wallet Signing Failure',
              content: res.message || 'You cancelled the transaction or did not sign it correctly.',
            });
            return;
          }
          command = res.body;
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
        const eventData = {
          ...data,
          amountFrom: Math.max(
            reduceBalance(amountDesired0, pact.allTokens[token0.name].precision),
            reduceBalance(args['amountA-min'], pact.allTokens[token0.name].precision)
          ),
          amountTo: reduceBalance(args['amountB-min'], pact.allTokens[token1.name].precision),
          tokenAddressFrom: pact.allTokens[token0.name].code,
          tokenAddressTo: pact.allTokens[token1.name].code,
          coinFrom: pact.allTokens[token0.name].name,
          coinTo: pact.allTokens[token1.name].name,
          type: 'LIQUIDITY SINGLE SIDE',
        };
        if (isWalletConnectConnected) {
          await walletConnectSendTransactionUpdateEvent(NETWORKID, eventData);
        }
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
              'You cancelled the transaction or did not sign it correctly. Please make sure you sign with the keys of the account linked in eckoDEX.',
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

  const removeDoubleSideLiquidityWallet = async (token0, token1, liquidity, previewAmount) => {
    try {
      let pair = await getPairAccount(token0.code, token1.code);

      const pairConfig = pact.allPairs[`${token0.code}:${token1.code}`] || pact.allPairs[`${token1.code}:${token0.code}`];

      const pactCode = pairConfig.isBoosted
        ? `(${KADDEX_NAMESPACE}.wrapper.remove-liquidity
        ${token0.code}
        ${token1.code}
        (read-decimal 'liquidity)
        0.0
        0.0
        ${JSON.stringify(account.account)}
        ${JSON.stringify(account.account)}
        (read-keyset 'user-ks)
        ${wantsKdxRewards}
      )`
        : `(${KADDEX_NAMESPACE}.exchange.remove-liquidity
        ${token0.code}
        ${token1.code}
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
          ...(pact.enableGasStation
            ? [Pact.lang.mkCap('Gas Station', 'free gas', `${KADDEX_NAMESPACE}.gas-station.GAS_PAYER`, ['kaddex-free-gas', { int: 1 }, 1.0])]
            : [Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS')]),
          Pact.lang.mkCap('transfer capability', 'Transfer Token to Pool', `${KADDEX_NAMESPACE}.tokens.TRANSFER`, [
            pairConfig.name,
            account.account,
            pair,
            reduceBalance(liquidity, PRECISION),
          ]),
        ],
        sender: pact.enableGasStation ? 'kaddex-free-gas' : account.account,
        gasLimit: Number(pact.gasConfiguration.gasLimit),
        gasPrice: parseFloat(pact.gasConfiguration.gasPrice),
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
      } else if (isWalletConnectConnected) {
        const res = await walletConnectRequestSign(account.account, NETWORKID, signCmd);
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
      const eventData = {
        ...data,
        amountFrom: reduceBalance(liquidity, PRECISION),
        tokenAddressFrom: token0.code,
        tokenAddressTo: token1.code,
        coinFrom: token0.name,
        coinTo: token1.name,
        type: 'LIQUIDITY REMOVE',
      };
      if (isWalletConnectConnected) {
        await walletConnectSendTransactionUpdateEvent(NETWORKID, eventData);
      }
      let previewData = await removeLiquidityPreview(token0.code, token1.code);
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
            'You cancelled the transaction or did not sign it correctly. Please make sure you sign with the keys of the account linked in eckoDEX.',
        });
      console.log(e);
    }
  };

  const removeSingleSideLiquidityWallet = async (token0, token1, tokenOutCode, liquidity) => {
    try {
      let pair = await getPairAccount(token0.code, token1.code);
      const pairConfig = pact.allPairs[`${token0.code}:${token1.code}`] || pact.allPairs[`${token1.code}:${token0.code}`];

      const useWrapper = pairConfig.isBoosted ? true : false;

      const tokenOtherCode = tokenOutCode === token0.code ? token1.code : token0.code;
      const slippage = 1 - pact.slippage;

      const pactCode = `(${KADDEX_NAMESPACE}.liquidity-helper.remove-liquidity-one-sided
        ${tokenOutCode}
        ${tokenOtherCode}
        (read-decimal 'liquidity)
        0.0
        0.0
        (read-decimal 'slippage)
        ${JSON.stringify(account.account)}
        ${JSON.stringify(account.account)}
        (read-keyset 'user-ks)
        ${useWrapper}
        ${wantsKdxRewards}
      )`;
      const signCmd = {
        pactCode,
        caps: [
          ...(pact.enableGasStation
            ? [Pact.lang.mkCap('Gas Station', 'free gas', `${KADDEX_NAMESPACE}.gas-station.GAS_PAYER`, ['kaddex-free-gas', { int: 1 }, 1.0])]
            : [Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS')]),
          Pact.lang.mkCap('transfer capability', 'Transfer Token to Pool', `${KADDEX_NAMESPACE}.tokens.TRANSFER`, [
            pairConfig.name,
            account.account,
            pair,
            reduceBalance(liquidity, PRECISION),
          ]),
        ],
        sender: pact.enableGasStation ? 'kaddex-free-gas' : account.account,
        gasLimit: Number(pact.gasConfiguration.gasLimit),
        gasPrice: parseFloat(pact.gasConfiguration.gasPrice),
        chainId: CHAIN_ID,
        ttl: 600,
        envData: {
          'user-ks': account.guard,
          liquidity: reduceBalance(liquidity, PRECISION),
          slippage: slippage,
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
      } else if (isWalletConnectConnected) {
        const res = await walletConnectRequestSign(account.account, NETWORKID, signCmd);
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
      const eventData = {
        ...data,
        amountFrom: reduceBalance(liquidity, PRECISION),
        tokenAddressFrom: token0.code,
        tokenAddressTo: token1.code,
        coinFrom: token0.name,
        coinTo: token1.name,
        type: 'LIQUIDITY REMOVE',
      };
      if (isWalletConnectConnected) {
        await walletConnectSendTransactionUpdateEvent(NETWORKID, eventData);
      }

      let previewData = await removeLiquidityPreview(token0.code, token1.code);
      if (!previewData.errorMessage) {
        const result = { ...data, resPreview: { ...previewData } };
        setLocalRes(result);
        return result;
      } else {
        setLocalRes(data);
        return data;
      }
    } catch (error) {}
  };

  const removeLiquidityPreview = async (token0, token1) => {
    try {
      const pactCode = `(${KADDEX_NAMESPACE}.wrapper.preview-remove-liquidity
        ${token0}
        ${token1}
        ${JSON.stringify(account.account)}
        (at 'liquidity-tokens (${KADDEX_NAMESPACE}.wrapper.get-liquidity-position ${token0} ${token1} ${JSON.stringify(account.account)}))
      )`;
      return await pactFetchLocal(pactCode);
    } catch (e) {
      return handleError(e);
    }
  };

  const contextValue = {
    pairListAccount,
    setPairListAccount,
    addLiquidityWallet,
    addOneSideLiquidityWallet,
    removeDoubleSideLiquidityWallet,
    removeSingleSideLiquidityWallet,
    removeLiquidityPreview,
    wantsKdxRewards,
    setWantsKdxRewards,
  };

  return <LiquidityContext.Provider value={contextValue}>{props.children}</LiquidityContext.Provider>;
};

export const LiquidityConsumer = LiquidityContext.Consumer;
