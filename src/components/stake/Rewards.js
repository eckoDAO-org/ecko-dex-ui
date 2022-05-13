import React from 'react';
import moment from 'moment';
import { commonColors } from '../../styles/theme';
import CustomButton from '../shared/CustomButton';
import Label from '../shared/Label';
import CommonWrapper from './CommonWrapper';
import PenaltyRewardsInfo from './PenaltyRewardsInfo';
import { extractDecimal, humanReadableNumber } from '../../utils/reduceBalance';
import { usePactContext } from '../../contexts';
import { getTimeByBlockchain } from '../../utils/string-utils';

const Rewards = ({ stakedAmount, rewardAccrued, stakedTimeStart, rewardsPenalty, lastRewardsClaim, disabled, onWithdrawClick }) => {
  const { kdxPrice } = usePactContext();

  /*
    If you unstake during the first 72hours you will incur in a penalty: 3% flat penalty on your staked amount. 
    If you withdraw your rewards during the first 60 days, you will incur in a penalty: the penalty will only affect your accumulated rewards 
    and exponentially decreases in time. Your initial capital will not be affected.
  */
  const getPenaltyRewardsString = () => {
    if (stakedTimeStart) {
      const rewardPenaltyPercentage = (100 * rewardsPenalty) / rewardAccrued;
      const penaltyObject = [extractDecimal(rewardsPenalty).toFixed(2), extractDecimal(rewardPenaltyPercentage).toFixed(2)];
      return penaltyObject;
    }
    return '-';
  };

  const getWaitingTimeRewardsPenalty = () => {
    if (stakedTimeStart) {
      const daysToWait = 60 - moment().diff(stakedTimeStart, 'days');
      //1440 = 24h * 60 days
      const hoursToWait = 1440 - moment().diff(stakedTimeStart, 'hours');
      if (daysToWait > 1) {
        return `${daysToWait} days left`;
      } else {
        if (hoursToWait > 1) {
          return `${hoursToWait} hours left`;
        } else if (hoursToWait < 1) {
          return '0 hours left';
        } else {
          return `${hoursToWait} hour left`;
        }
      }
    }
  };

  const getRewardsClaimTime = () => {
    if (lastRewardsClaim) {
      const daysToWait = 7 - moment().diff(getTimeByBlockchain(lastRewardsClaim), 'days');
      //168 = 24h * 7 days
      const hoursToWait = 168 - moment().diff(getTimeByBlockchain(lastRewardsClaim), 'hours');
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
    if (!rewardsPenalty) {
      return null;
    } else if (moment().diff(stakedTimeStart, 'days') >= 60) {
      return commonColors.green;
    } else {
      return commonColors.red;
    }
  };

  return (
    <CommonWrapper gap={16} title="rewards" popup={<PenaltyRewardsInfo />} popupTitle="Rewards Penalty">
      <div>
        <Label>KDX Collected</Label>
        <Label fontSize={30}>{humanReadableNumber(rewardAccrued)} KDX</Label>
        <Label fontSize={16} labelStyle={{ marginTop: 4, opacity: 0.7 }}>
          {humanReadableNumber(kdxPrice * rewardAccrued)} USD
        </Label>
      </div>
      <div>
        <Label>Waiting Time</Label>
        <Label fontSize={24} color={getPenaltyColor()}>
          {stakedTimeStart && stakedAmount > 0 ? getWaitingTimeRewardsPenalty() : '-'}
        </Label>
      </div>
      <div>
        <div className="flex align-ce">
          <Label>Rewards Penalty</Label>
        </div>

        <Label fontSize={24} color={getPenaltyColor()}>
          {getPenaltyRewardsString()[0] || '-'} KDX
        </Label>
        {rewardsPenalty && (
          <Label fontSize={16} color={getPenaltyColor()}>
            {getPenaltyRewardsString()[1] || '-'} %
          </Label>
        )}
      </div>
      <CustomButton type="primary" disabled={disabled} onClick={() => onWithdrawClick()}>
        {disabled && lastRewardsClaim ? getRewardsClaimTime() : 'withdraw'}
      </CustomButton>
    </CommonWrapper>
  );
};

export default Rewards;
