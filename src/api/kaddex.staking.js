import moment from 'moment';
import { handleError, pactFetchLocal } from './pact';
import { estimateUnstakeSampleData, poolStateData } from './sample-data/staking';

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

export const addStake = async (account, amount) => {
  try {
    const addStakeData = await pactFetchLocal(`(kaddex.staking.stake "${account}" ${amount}))`);
    /**
     *  with the following capabilities: (kaddex.kdx.WRAP “skdx” k:4c9ce8d8530503ba05ca9dfa476d0829dd861909df0b625d2eada9d7ce64eb3a k:4c9ce8d8530503ba05ca9dfa476d0829dd861909df0b625d2eada9d7ce64eb3a 10.0) and (kaddex.staking.STAKE “account” 20.0) ??
    (kaddex.kdx.WRAP "skdx" "k:4c9ce8d8530503ba05ca9dfa476d0829dd861909df0b625d2eada9d7ce64eb3a" "k:4c9ce8d8530503ba05ca9dfa476d0829dd861909df0b625d2eada9d7ce64eb3a" 10.0)
    (kaddex.staking.STAKE "k:4c9ce8d8530503ba05ca9dfa476d0829dd861909df0b625d2eada9d7ce64eb3a" 10.0)
    */

    return addStakeData;
  } catch (e) {
    return _managePactError(e, estimateUnstakeSampleData());
  }
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
