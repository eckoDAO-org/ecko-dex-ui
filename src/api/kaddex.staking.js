import moment from 'moment';
import Pact from 'pact-lang-api';
import { pactFetchLocal } from './pact';
import { getFloatPrecision } from '../utils/string-utils';
import { CHAIN_ID, GAS_PRICE, GAS_LIMIT, NETWORKID } from '../constants/contextConstants';
import { handleError } from './utils';

export const getPoolState = async () => {
  try {
    const stakingPoolStateData = await pactFetchLocal(`(kaddex.staking.get-pool-state)`);
    return stakingPoolStateData;
  } catch (e) {
    return handleError(e);
  }
};

export const estimateUnstake = async (account) => {
  try {
    const stakingPoolStateData = await pactFetchLocal(`(kaddex.staking.inspect-staker "${account}")`);
    return stakingPoolStateData;
  } catch (e) {
    return handleError(e);
  }
};

export const getAddStakeCommand = (verifiedAccount, amountToStake) => {
  const parsedAmount = parseFloat(amountToStake?.toString());
  const decimalPlaces = getFloatPrecision(parsedAmount);
  const pactCode = `(kaddex.staking.stake "${verifiedAccount.account}" ${parsedAmount.toFixed(decimalPlaces || 2)})`;
  return {
    pactCode,
    caps: [
      Pact.lang.mkCap('wrap capability', 'wrapping skdx', `kaddex.kdx.WRAP`, [
        'skdx',
        verifiedAccount.account,
        verifiedAccount.account,
        parsedAmount,
      ]),
      Pact.lang.mkCap('stake capability', 'staking', `kaddex.staking.STAKE`, [verifiedAccount.account, parsedAmount]),
      Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS'),
    ],
    sender: verifiedAccount.account,
    gasLimit: GAS_LIMIT,
    gasPrice: GAS_PRICE,
    chainId: CHAIN_ID,
    ttl: 600,
    envData: {
      'user-ks': verifiedAccount.guard,
    },
    signingPubKey: verifiedAccount.guard.keys[0],
    networkId: NETWORKID,
  };
};

export const geUnstakeCommand = (verifiedAccount, amountToUnstake) => {
  const parsedAmount = parseFloat(amountToUnstake?.toString());
  const decimalPlaces = getFloatPrecision(parsedAmount);
  const pactCode = `(kaddex.staking.unstake "${verifiedAccount.account}" ${parsedAmount.toFixed(decimalPlaces || 2)})`;
  return {
    pactCode,
    caps: [
      Pact.lang.mkCap('skdx DEBIT capability', 'debit skdx', `kaddex.skdx.DEBIT`),
      Pact.lang.mkCap('unstake capability', 'unstaking', `kaddex.staking.UNSTAKE`, [verifiedAccount.account]),
      Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS'),
    ],
    sender: verifiedAccount.account,
    gasLimit: GAS_LIMIT,
    gasPrice: GAS_PRICE,
    chainId: CHAIN_ID,
    ttl: 600,
    envData: {
      'user-ks': verifiedAccount.guard,
    },
    signingPubKey: verifiedAccount.guard.keys[0],
    networkId: NETWORKID,
  };
};

export const getRollupRewardsCommand = (verifiedAccount) => {
  const pactCode = `(kaddex.staking.rollup "${verifiedAccount.account}")`;
  return {
    pactCode,
    caps: [
      Pact.lang.mkCap('rollup capability', 'rollup', `kaddex.staking.ROLLUP`, [verifiedAccount.account]),
      Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS'),
    ],
    sender: verifiedAccount.account,
    gasLimit: GAS_LIMIT,
    gasPrice: GAS_PRICE,
    chainId: CHAIN_ID,
    ttl: 600,
    envData: {
      'user-ks': verifiedAccount.guard,
    },
    signingPubKey: verifiedAccount.guard.keys[0],
    networkId: NETWORKID,
  };
};

export const getRollupAndUnstakeCommand = (verifiedAccount, amountToUnstake) => {
  const parsedAmount = parseFloat(amountToUnstake?.toString());
  const decimalPlaces = getFloatPrecision(parsedAmount);
  const pactCode = `
  (kaddex.staking.rollup "${verifiedAccount.account}")
  (kaddex.staking.unstake "${verifiedAccount.account}" ${parsedAmount.toFixed(decimalPlaces || 2)})
  `;
  return {
    pactCode,
    caps: [
      Pact.lang.mkCap('rollup capability', 'rollup', `kaddex.staking.ROLLUP`, [verifiedAccount.account]),
      Pact.lang.mkCap('skdx DEBIT capability', 'debit skdx', `kaddex.skdx.DEBIT`),
      Pact.lang.mkCap('unstake capability', 'unstaking', `kaddex.staking.UNSTAKE`, [verifiedAccount.account]),
      Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS'),
    ],
    sender: verifiedAccount.account,
    gasLimit: GAS_LIMIT,
    gasPrice: GAS_PRICE,
    chainId: CHAIN_ID,
    ttl: 600,
    envData: {
      'user-ks': verifiedAccount.guard,
    },
    signingPubKey: verifiedAccount.guard.keys[0],
    networkId: NETWORKID,
  };
};

export const getRollupAndClaimCommand = (verifiedAccount) => {
  const pactCode = `
  (kaddex.staking.rollup "${verifiedAccount.account}")
  (kaddex.staking.claim "${verifiedAccount.account}")
  `;
  return {
    pactCode,
    caps: [
      Pact.lang.mkCap('rollup capability', 'rollup', `kaddex.staking.ROLLUP`, [verifiedAccount.account]),
      Pact.lang.mkCap('claim capability', 'claim', `kaddex.staking.CLAIM`, [verifiedAccount.account]),
      Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS'),
    ],
    sender: verifiedAccount.account,
    gasLimit: GAS_LIMIT,
    gasPrice: GAS_PRICE,
    chainId: CHAIN_ID,
    ttl: 600,
    envData: {
      'user-ks': verifiedAccount.guard,
    },
    signingPubKey: verifiedAccount.guard.keys[0],
    networkId: NETWORKID,
  };
};

export const getClaimRewardsCommand = (verifiedAccount) => {
  const pactCode = `(kaddex.staking.claim "${verifiedAccount.account}")`;
  return {
    pactCode,
    caps: [
      Pact.lang.mkCap('claim capability', 'claim', `kaddex.staking.CLAIM`, [verifiedAccount.account]),
      Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS'),
    ],
    sender: verifiedAccount.account,
    gasLimit: GAS_LIMIT,
    gasPrice: GAS_PRICE,
    chainId: CHAIN_ID,
    ttl: 600,
    envData: {
      'user-ks': verifiedAccount.guard,
    },
    signingPubKey: verifiedAccount.guard.keys[0],
    networkId: NETWORKID,
  };
};

/**
 * To simulate the increase in the reward penalty period for a stake operation
 */
export const calculateNewStart = async (effectiveStartDate, alreadyStakedAmount, addedStakedAmount) => {
  try {
    const currentTime = moment().utc().format(); // "2020-01-02T00:00:00Z"
    const calcNewStartData = await pactFetchLocal(
      `(kaddex.staking.calculate-new-start (time "${currentTime}") (time "${effectiveStartDate}") ${alreadyStakedAmount} ${addedStakedAmount})`
    );
    /**
     *  The returned value is the new effective start date, which is used in the reward penalty calculation;
     *  the penalty will last for kaddex.staking.MATURATION_PERIOD seconds after the effective start date.
     */
    return calcNewStartData;
  } catch (e) {
    if (process.env.REACT_APP_STAKING_SIMULATION) {
      return '2020-01-26T04:00:00Z';
    } else {
      return handleError(e);
    }
  }
};
