import Pact from 'pact-lang-api';
import { CHAIN_ID, GAS_PRICE, GAS_LIMIT, NETWORKID, ENABLE_GAS_STATION, KADDEX_NAMESPACE } from '../constants/contextConstants';
import { pactFetchLocal } from './pact';
import { handleError } from './utils';

export const createPairCommand = async (token0, token1, hint, gasStation, gasLimit, gasPrice, account) => {
  const pactCode = `(${KADDEX_NAMESPACE}.exchange.create-pair ${token0} ${token1} "${hint}")`;
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
