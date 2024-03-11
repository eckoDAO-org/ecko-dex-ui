import moment from 'moment';
import { getTimeByBlockchain } from '../utils/string-utils';

const environment = process.env.REACT_APP_KDA_NETWORK_TYPE || 'testnet';

const stakingConfiguration = {
  testnet: {
    rewardsPenaltyDaysToWait: (_) => 0,
    rewardsPenaltyHoursToWait: 6,
    rewardsClaimDaysToWait: (_) => 0,
    rewardsClaimHoursToWait: 2,
    percentagePenaltyHours: 1,
    dynamicPenaltyDays: 0,
  },
  development: {
    rewardsPenaltyDaysToWait: (_) => 0,
    rewardsPenaltyHoursToWait: 6,
    rewardsClaimDaysToWait: (_) => 0,
    rewardsClaimHoursToWait: 2,
    percentagePenaltyHours: 1,
    dynamicPenaltyDays: 0,
  },
  mainnet: {
    rewardsPenaltyDaysToWait: (stakedTimeStart) => 60 - moment().diff(stakedTimeStart, 'days'),
    rewardsPenaltyHoursToWait: 1440,
    rewardsClaimDaysToWait: () => (lastRewardsClaim) => 7 - moment().diff(getTimeByBlockchain(lastRewardsClaim), 'days'),
    rewardsClaimHoursToWait: 168,
    percentagePenaltyHours: 72,
    dynamicPenaltyDays: 60,
  },
};

export const STAKING_CONSTANTS = stakingConfiguration[environment];
