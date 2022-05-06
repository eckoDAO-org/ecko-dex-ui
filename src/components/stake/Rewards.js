import React from 'react';
import moment from 'moment';
import { commonColors } from '../../styles/theme';
import CustomButton from '../shared/CustomButton';
import Label from '../shared/Label';
import CommonWrapper from './CommonWrapper';
import PenaltyRewardsInfo from './PenaltyRewardsInfo';
import { humanReadableNumber } from '../../utils/reduceBalance';
import { usePactContext } from '../../contexts';

const Rewards = ({ rewardAccrued, stakedTimeStart, rewardsPenalty, disabled, onWithdrawClick }) => {
  const { kdxPrice } = usePactContext();
  /*
    If you unstake during the first 72hours you will incur in a penalty: 3% flat penalty on your staked amount. 
    If you withdraw your rewards during the first 60 days, you will incur in a penalty: the penalty will only affect your accumulated rewards 
    and exponentially decreases in time. Your initial capital will not be affected.
  */
  const getPenaltyRewardsString = () => {
    if (stakedTimeStart) {
      const rewardPenaltyPercentage = (100 * rewardsPenalty) / rewardAccrued;
      const penaltyObject = [rewardsPenalty.toFixed(2), rewardPenaltyPercentage.toFixed(2)];
      return penaltyObject;
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
    <CommonWrapper gap={16} title="rewards" popup={<PenaltyRewardsInfo />} popupTitle="Rewards Penalty">
      <div>
        <Label>KDX Collected</Label>
        <Label fontSize={30}>{humanReadableNumber(rewardAccrued)} KDX</Label>
        <Label fontSize={16} labelStyle={{ marginTop: 4, opacity: 0.7 }}>
          {humanReadableNumber(kdxPrice * rewardAccrued)} USD
        </Label>
      </div>
      <div>
        <Label>Elapsed Time</Label>
        <Label fontSize={24} color={getPenaltyColor()}>
          {(stakedTimeStart && moment(stakedTimeStart).fromNow()) || '-'}
        </Label>
      </div>
      <div>
        <div className="flex align-ce">
          <Label>Rewards Penalty</Label>
        </div>

        <Label fontSize={24} color={getPenaltyColor()}>
          {getPenaltyRewardsString()[0] || '-'} KDX
        </Label>
        <Label fontSize={16} color={getPenaltyColor()}>
          {getPenaltyRewardsString()[1] || '-'} %
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
