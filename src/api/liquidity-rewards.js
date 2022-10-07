import Pact from 'pact-lang-api';
import { CHAIN_ID, KADDEX_NAMESPACE, NETWORK, NETWORKID } from '../constants/contextConstants';
import { extractDecimal } from '../utils/reduceBalance';
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
      return extractDecimal(data);
    }
  } catch (e) {
    return handleError(e);
  }
};

export const getPairsMultiplier = async (pairList) => {
  const tokenPairList = pairList.reduce((accum, pair) => {
    accum += `[${pair.name.split(':').join(' ')}] `;
    return accum;
  }, '');
  const pactCode = `
  (namespace 'free)
              (module ${KADDEX_NAMESPACE}-read G
  
                (defcap G ()
                  true)
  
                (defun multipliers (pairList:list)
                  (let* (
                    (token0 (at 0 pairList))
                    (token1 (at 1 pairList))
                    (multiplier (try 1.0 (${KADDEX_NAMESPACE}.wrapper.get-pair-multiplier token0 token1)))
                    )
                  {'pair: (format "{}:{}" [token0 token1]), 'multiplier: multiplier}
                ))
              )
              (map (${KADDEX_NAMESPACE}-read.multipliers) [${tokenPairList}])
  `;
  try {
    let data = await pactFetchLocal(pactCode);
    if (data) {
      return data.map((x) => ({ ...x, multiplier: extractDecimal(x.multiplier) }));
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

export const claimLiquidityRewardsCommandToSign = (requestId, account, gasStation, gasLimit, gasPrice) => {
  try {
    const pactCode = `(${KADDEX_NAMESPACE}.wrapper.withdraw-claim
        ${JSON.stringify(account.account)}
        ${JSON.stringify(requestId)}

      )`;

    const cmdToSign = {
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
  const listenResponse = await listen(data.requestKeys[0]);
  return { listen: listenResponse?.result?.status, data };
};
