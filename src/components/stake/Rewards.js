import React from 'react';
import moment from 'moment';
import { commonColors } from '../../styles/theme';
import CustomButton from '../shared/CustomButton';
import Label from '../shared/Label';
import CommonWrapper from './CommonWrapper';
import { extractDecimal, getDecimalPlaces, humanReadableNumber } from '../../utils/reduceBalance';
import { usePactContext } from '../../contexts';
import { getTimeByBlockchain } from '../../utils/string-utils';
import { STAKING_CONSTANTS } from '../../constants/stakingConstants';

const Rewards = ({ stakedAmount, rewardAccrued, stakedTimeStart, rewardsPenalty, lastRewardsClaim, disabled, onWithdrawClick }) => {
  const { tokensUsdPrice } = usePactContext();

  /*
    If you unstake during the first 72hours you will incur in a penalty: 3% flat penalty on your staked amount. 
    If you withdraw your rewards during the first 60 days, you will incur in a penalty: the penalty will only affect your accumulated rewards 
    and exponentially decreases in time. Your initial capital will not be affected.
  */
  const getPenaltyRewardsString = () => {
    if (stakedTimeStart) {
      const rewardPenaltyPercentage = (100 * rewardsPenalty) / rewardAccrued;
      const penaltyObject = [getDecimalPlaces(extractDecimal(rewardsPenalty)), extractDecimal(rewardPenaltyPercentage).toFixed(2)];
      return penaltyObject;
    }
    return '-';
  };

  const getWaitingTimeRewardsPenalty = () => {
    if (stakedTimeStart) {
      /* 60 days */
      const daysToWait = STAKING_CONSTANTS.rewardsPenaltyDaysToWait(stakedTimeStart);
      //1440 = 24h * 60 days
      const hoursToWait = STAKING_CONSTANTS.rewardsPenaltyHoursToWait - moment().diff(stakedTimeStart, 'hours');
      const minutesToWait = STAKING_CONSTANTS.rewardsPenaltyHoursToWait * 60 - moment().diff(stakedTimeStart, 'minutes');
      if (daysToWait > 1) {
        return `${daysToWait} days`;
      } else {
        if (hoursToWait > 1) {
          return `${hoursToWait} hours`;
        } else {
          if (minutesToWait > 1) {
            return `${minutesToWait} minutes`;
          } else if (minutesToWait === 1) {
            return `${minutesToWait} minute`;
          } else {
            return '0 seconds';
          }
        }
      }
    }
  };

  const getRewardsClaimTime = () => {
    if (rewardAccrued === 0) {
      return 'withdraw';
    } else if (lastRewardsClaim) {
      // 7 days
      const daysToWait = STAKING_CONSTANTS.rewardsClaimDaysToWait(lastRewardsClaim);
      //168 = 24h * 7 days
      const hoursToWait = STAKING_CONSTANTS.rewardsClaimHoursToWait - moment().diff(getTimeByBlockchain(lastRewardsClaim), 'hours');
      if (daysToWait > 1) {
        return `withdraw in ${daysToWait} days`;
      } else {
        if (hoursToWait > 1) {
          return `withdraw in ${hoursToWait} hours`;
        } else {
          return `withdraw in ${hoursToWait} hour`;
        }
      }
    }
  };

  const getPenaltyColor = () => {
    if (!rewardsPenalty && !rewardAccrued) {
      return null;
    } else if (moment().diff(stakedTimeStart, 'hours') >= STAKING_CONSTANTS.rewardsPenaltyHoursToWait) {
      return commonColors.green;
    } else {
      return commonColors.red;
    }
  };

  return (
    <CommonWrapper gap={16} title="rewards" popup={<PenaltyRewardsInfo />} popupTitle="Rewards Penalty">
      <div>
        <Label fontSize={13}>KDX Collected</Label>
        <Label fontSize={24}>{rewardAccrued !== 0 ? getDecimalPlaces(extractDecimal(rewardAccrued)) : '-'} KDX</Label>
        {rewardAccrued !== 0 && tokensUsdPrice?.KDX ? (
          <Label fontSize={12} mobileFontSize={12} labelStyle={{ marginTop: 4, opacity: 0.7 }}>
            $ {humanReadableNumber(tokensUsdPrice?.KDX * extractDecimal(rewardAccrued))}
          </Label>
        ) : (
          ''
        )}
      </div>
      <div>
        <Label>Waiting Time</Label>
        <Label fontSize={24} color={getPenaltyColor()}>
          {stakedTimeStart && rewardAccrued > 0 ? getWaitingTimeRewardsPenalty() : '-'}
        </Label>
      </div>
      <div>
        <div className="flex align-ce">
          <Label>Rewards Penalty</Label>
        </div>

        <Label fontSize={24} color={getPenaltyColor()}>
          {Number(getPenaltyRewardsString()[0]) > 0 ? `${getPenaltyRewardsString()[0]} KDX` : 'None'}
        </Label>
        {rewardsPenalty && Number(getPenaltyRewardsString()[0]) > 0 ? (
          <Label fontSize={16} color={getPenaltyColor()}>
            {getPenaltyRewardsString()[1] || '-'} %
          </Label>
        ) : (
          ''
        )}
      </div>
      <CustomButton type="primary" disabled={disabled} onClick={() => onWithdrawClick()}>
        {disabled && lastRewardsClaim ? getRewardsClaimTime() : 'withdraw'}
      </CustomButton>
    </CommonWrapper>
  );
};

export default Rewards;
