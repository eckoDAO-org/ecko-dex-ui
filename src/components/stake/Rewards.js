import React from 'react';
import moment from 'moment';
import { commonColors } from '../../styles/theme';
import CustomButton from '../shared/CustomButton';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';
import CommonWrapper from './CommonWrapper';
import PenaltyRewardsInfo from './PenaltyRewardsInfo';

const Rewards = ({ rewardAccrued, stakedTimeStart, rewardsPenalty, disabled, onWithdrawClick }) => {
  /*
    If you unstake during the first 72hours you will incur in a penalty: 3% flat penalty on your staked amount. 
    If you withdraw your rewards during the first 60 days, you will incur in a penalty: the penalty will only affect your accumulated rewards 
    and exponentially decreases in time. Your initial capital will not be affected.
  */
  const getPenaltyRewardsString = () => {
    if (stakedTimeStart) {
      const rewardPenaltyPercentage = (100 * rewardsPenalty) / rewardAccrued;
      const diffHours = moment().diff(stakedTimeStart, 'hours');
      if (diffHours < 72) {
        return `${rewardPenaltyPercentage.toFixed(2)}%`;
      } else {
        return `${(rewardsPenalty || 0).toFixed(2)} KDX`;
      }
    }
    return '-';
  };

  const getPenaltyColor = () => {
    if (!rewardsPenalty) {
      return null;
    } else if (moment().diff(moment(stakedTimeStart), 'day') >= 60) {
      return commonColors.green;
    } else {
      return commonColors.red;
    }
  };

  return (
    <CommonWrapper gap={16} title="rewards">
      <div>
        <Label>KDX Collected</Label>
        <Label fontSize={32}>{(rewardAccrued && rewardAccrued.toFixed(6)) || '-'} KDX</Label>
      </div>
      <div>
        <Label>Staking Time</Label>
        <Label fontSize={24} color={getPenaltyColor()}>
          {(stakedTimeStart && moment(stakedTimeStart).fromNow()) || '-'}
        </Label>
      </div>
      <div>
        <div className="flex align-ce">
          <Label>Claim Penalty</Label>
          <InfoPopup type="modal" title="Claim Penalty">
            <PenaltyRewardsInfo />
          </InfoPopup>
        </div>

        <Label fontSize={24} color={getPenaltyColor()}>
          {getPenaltyRewardsString() || '-'}
        </Label>
      </div>
      {/* <CustomButton type="gradient" disabled={disabled} buttonStyle={{ marginTop: 4 }} onClick={() => {}}>
        stake rewards
      </CustomButton> */}
      <CustomButton type="primary" disabled={disabled} onClick={() => onWithdrawClick()}>
        withdraw
      </CustomButton>
    </CommonWrapper>
  );
};

export default Rewards;
