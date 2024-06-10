import Pact from 'pact-lang-api';
import { CHAIN_ID, NETWORKID, KADDEX_NAMESPACE } from '../constants/contextConstants';
import { pactFetchLocal } from './pact';
import { handleError } from './utils';
import {tokenData} from '../constants/cryptoCurrencies';

export const createPairCommand = async (token0, token1, hint, gasStation, gasLimit, gasPrice, account) => {
  const pactCode = `(${KADDEX_NAMESPACE}.exchange.create-pair ${token0} ${token1} "")`;
  return {
    pactCode,
    caps: [
      ...(gasStation
        ? [Pact.lang.mkCap('Gas Station', 'free gas', `${KADDEX_NAMESPACE}.gas-station.GAS_PAYER`, ['kaddex-free-gas', { int: 1 }, 1.0])]
        : [Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS')]),
    ],
    sender: gasStation ? 'kaddex-free-gas' : account.account,
    gasLimit: Number(gasLimit),
    gasPrice: parseFloat(gasPrice),
    chainId: CHAIN_ID,
    ttl: 600,
    signingPubKey: account?.guard?.keys[0],
    networkId: NETWORKID,
  };
};

export const checkTokenModule = async (moduleName) => {
  try {
    let data = await pactFetchLocal(`(${moduleName}.precision)`);
    if (data) {
      return data;
    }
  } catch (e) {
    return handleError(e);
  }
};

export const getPairModuleDetails = async (moduleName, account) => {
  try {
    let data = await pactFetchLocal(`(${moduleName}.details "${account}")`);
    if (data) {
      return data;
    }
  } catch (e) {
    return handleError(e);
  }
};

export const getPairs = async () => {
  try {
    let data = await pactFetchLocal(`(${KADDEX_NAMESPACE}.exchange.get-pairs)`);
    if (data) {
      return data;
    }
  } catch (e) {
    return handleError(e);
  }
};

export const getModuleList = async () => {
  try {
    let data = await pactFetchLocal(`(list-modules)`);
    if (data) {
      return data;
    }
  } catch (e) {
    return handleError(e);
  }
};

export const getTokenNameFromAddress = (token, communityTokenList) => {
  let tokenVerified = null;
  Object.keys(tokenData).forEach((item) => {
    if (tokenData[item].code === token) {
      tokenVerified = tokenData[item].name;
    }
  });

  if (tokenVerified) return tokenVerified;
  const nameSpace = token.split('.')[0];
  const moduleName = token.split('.')[1];
  const prefix = `${nameSpace[0]}.`;
  const computedTokenName = moduleName.substr(0, moduleName.length >= 3 ? 3 : moduleName.length).toUpperCase();

  const alreadyExists = tokenData[computedTokenName];

  let finalTokenName = '';

  if (alreadyExists) {
    finalTokenName = `${prefix}nv${computedTokenName}`;
  } else {
    finalTokenName = `${prefix}${computedTokenName}`;
  }

  if (communityTokenList[finalTokenName]) {
    let i = 1;
    let newNameToCheckExistance = finalTokenName + i;
    while (communityTokenList[newNameToCheckExistance]) {
      i++;
      newNameToCheckExistance = finalTokenName + i;
    }
    return newNameToCheckExistance;
  } else {
    return finalTokenName;
  }
};

export const getVerifiedPairs = (pairs) => {
  return Object.values(pairs).filter((pair) => pair.isVerified);
};

export const getCommunityPairs = (pairs) => {
  return Object.values(pairs).filter((pair) => !pair.isVerified);
};
