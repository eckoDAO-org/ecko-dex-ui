import moment from 'moment';
import Pact from 'pact-lang-api';
import { handleError, pactFetchLocal } from './pact';
import { estimateUnstakeSampleData, poolStateData } from './sample-data/staking';
import { chainId, GAS_PRICE, NETWORKID } from '../constants/contextConstants';

const _managePactError = (e, fakeData) => {
  if (process.env.REACT_APP_STAKING_SIMULATION === 'true') {
    return fakeData;
  } else {
    return handleError(e);
  }
};

export const getPoolState = async () => {
  try {
    const stakingPoolStateData = await pactFetchLocal(`(kaddex.staking.get-pool-state)`);
    return stakingPoolStateData;
  } catch (e) {
    return _managePactError(e, poolStateData);
  }
};

export const estimateUnstake = async (account) => {
  try {
    const stakingPoolStateData = await pactFetchLocal(`(kaddex.staking.estimate-unstake "${account}")`);
    return stakingPoolStateData;
  } catch (e) {
    return _managePactError(e, estimateUnstakeSampleData());
  }
};

export const getAddStakeCommand = (verifiedAccount, amountToStake) => {
  // TODO: set precision
  const parsedAmount = parseFloat(amountToStake?.toString());
  const pactCode = `(kaddex.staking.stake "${verifiedAccount.account}" ${parsedAmount.toFixed(2)})`;
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
    gasLimit: 3000,
    gasPrice: GAS_PRICE,
    chainId: chainId,
    ttl: 600,
    envData: {
      'user-ks': verifiedAccount.guard,
    },
    signingPubKey: verifiedAccount.guard.keys[0],
    networkId: NETWORKID,
  };
};

export const geUnstakeCommand = (verifiedAccount) => {
  const pactCode = `(kaddex.staking.unstake "${verifiedAccount.account}")`;
  return {
    pactCode,
    caps: [
      Pact.lang.mkCap('skdx DEBIT capability', 'debit skdx', `kaddex.skdx.DEBIT`),
      Pact.lang.mkCap('unstake capability', 'unstaking', `kaddex.staking.UNSTAKE`, [verifiedAccount.account]),
      Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS'),
    ],
    sender: verifiedAccount.account,
    gasLimit: 3000,
    gasPrice: GAS_PRICE,
    chainId: chainId,
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
      // Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS'), // no gas needed?
    ],
    sender: verifiedAccount.account,
    gasLimit: 3000,
    gasPrice: GAS_PRICE,
    chainId: chainId,
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
    gasLimit: 3000,
    gasPrice: GAS_PRICE,
    chainId: chainId,
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
