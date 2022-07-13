import Pact from 'pact-lang-api';
import { CHAIN_ID, ENABLE_GAS_STATION, GAS_PRICE, KADDEX_NAMESPACE, NETWORK, NETWORKID } from '../constants/contextConstants';
import { pactFetchLocal } from './pact';
import { handleError, listen } from './utils';

// used in rewards table

const getLiquidityRewards = async (account) => {
  try {
    let data = await pactFetchLocal(`(${KADDEX_NAMESPACE}.wrapper.get-user-pending-requests-info ${JSON.stringify(account)})`);
    if (data) {
      return data;
    }
  } catch (e) {
    return handleError(e);
  }
};

export const getPairMultiplier = async (tokenA, tokenB) => {
  try {
    let data = await pactFetchLocal(`(${KADDEX_NAMESPACE}.wrapper.get-pair-multiplier ${tokenA} ${tokenB})`);
    if (data) {
      return data;
    }
  } catch (e) {
    return handleError(e);
  }
};

export const getKdxRewardsAvailable = async () => {
  try {
    let data = await pactFetchLocal(`(${KADDEX_NAMESPACE}.wrapper.total-kdx-rewards-available)`);
    if (data) {
      return data;
    }
  } catch (e) {
    return handleError(e);
  }
};

export const getAccountLiquidityRewards = async (account) => {
  try {
    const res = await getLiquidityRewards(account);

    return res;
  } catch (e) {
    return handleError(e);
  }
};
export const getLiquidityRewardsByRequestId = async (requestId) => {
  try {
    let data = await pactFetchLocal(`(${KADDEX_NAMESPACE}.wrapper.get-request-info ${JSON.stringify(requestId)})`);
    if (data) {
      return data;
    }
  } catch (e) {
    return handleError(e);
  }
};

export const claimLiquidityRewardsCommandToSign = (requestId, account) => {
  try {
    const pactCode = `(${KADDEX_NAMESPACE}.wrapper.withdraw-claim
        ${JSON.stringify(account.account)}
        ${JSON.stringify(requestId)}

      )`;

    const cmdToSign = {
      pactCode,
      caps: [
        ...(ENABLE_GAS_STATION
          ? [Pact.lang.mkCap('Gas Station', 'free gas', `${KADDEX_NAMESPACE}.gas-station.GAS_PAYER`, ['kaddex-free-gas', { int: 1 }, 1.0])]
          : [Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS')]),
      ],
      sender: ENABLE_GAS_STATION ? 'kaddex-free-gas' : account.account,
      gasLimit: 100000,
      gasPrice: GAS_PRICE,
      chainId: CHAIN_ID,
      ttl: 600,
      signingPubKey: account.guard.keys[0],
      networkId: NETWORKID,
    };
    return cmdToSign;
  } catch (e) {
    return handleError(e);
  }
};

export const claimRewards = async (signedCmd, notification) => {
  let data = null;
  if (signedCmd.pactCode) {
    data = await Pact.fetch.send(signedCmd, NETWORK);
  } else {
    data = await Pact.wallet.sendSigned(signedCmd, NETWORK);
  }
  if (notification) notification(data.requestKeys[0], 'Claim rewards Pending');
  console.log('liquidity claim data', data);
  return { listen: await listen(data.requestKeys[0]), data };
};
