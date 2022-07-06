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
  const { tokensUsdPrice } = usePactContext();

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
      {
        /* change back to 60 (60days) */
      }
      /* const daysToWait = 60 - moment().diff(stakedTimeStart, 'days'); */
      const daysToWait = 0;
      //1440 = 24h * 60 days
      {
        /* change back to 1440 (24h * 60 days) */
      }
      const hoursToWait = 6 - moment().diff(stakedTimeStart, 'hours');
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
    if (rewardAccrued === 0) {
      return 'withdraw';
    } else if (lastRewardsClaim) {
      {
        /* change back to 7 (7days) */
      }
      /* const daysToWait = 7 - moment().diff(getTimeByBlockchain(lastRewardsClaim), 'days'); */
      const daysToWait = 0;
      //168 = 24h * 7 days
      {
        /* change back to 168 (24h * 7 days) */
      }
      const hoursToWait = 2 - moment().diff(getTimeByBlockchain(lastRewardsClaim), 'hours');
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
    } /* change back to: else if (moment().diff(stakedTimeStart, 'hours') >= 60) */ else if (moment().diff(stakedTimeStart, 'hours') >= 6) {
      return commonColors.green;
    } else {
      return commonColors.red;
    }
  };

  return (
    <CommonWrapper gap={16} title="rewards" popup={<PenaltyRewardsInfo />} popupTitle="Rewards Penalty">
      <div>
        <Label>KDX Collected</Label>
        <Label fontSize={30}>{rewardAccrued !== 0 ? humanReadableNumber(rewardAccrued) : '-'} KDX</Label>
        {rewardAccrued !== 0 && (
          <Label fontSize={16} labelStyle={{ marginTop: 4, opacity: 0.7 }}>
            $ {humanReadableNumber(tokensUsdPrice?.KDX * extractDecimal(rewardAccrued))}
          </Label>
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
          {getPenaltyRewardsString()[0] !== '0.00' ? getPenaltyRewardsString()[0] : '-'} KDX
        </Label>
        {rewardsPenalty ? (
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
