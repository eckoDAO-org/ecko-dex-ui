import React from 'react';
import { commonColors } from '../../styles/theme';
import { humanReadableNumber } from '../../utils/reduceBalance';
import CustomButton from '../shared/CustomButton';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';
import CommonWrapper from './CommonWrapper';

const Rewards = ({ amount, stakedTime, rewardsPenality, disabled }) => {
  return (
    <CommonWrapper gap={16} title="rewards">
      <div>
        <Label>Rewards Collected</Label>
        <Label fontSize={32}>{humanReadableNumber(amount)}</Label>
      </div>
      <div>
        <Label>Stake Time</Label>
        <Label fontSize={24} color={commonColors.green}>
          {stakedTime} days
        </Label>
      </div>
      <div>
        <div className="flex align-ce">
          <Label>Rewards Penality</Label>
          <InfoPopup>
            The penalty structure of the KDX Staking tool is designed to achieve two objectives: to reward long-term holders and to prevent
            manipulation and spam of the smart contract involved. If you unstake during the first 72hours you will incur in a penalty: 3% flat penalty
            on your staked amount. If you withdraw your rewards during the first 60 days, you will incur in a penalty: the penalty will only affect
            your accumulated rewards and exponentially decreases in time. Your initial capital will not be affected.
          </InfoPopup>
        </div>

        <Label fontSize={24} color={commonColors.green}>
          {rewardsPenality} %
        </Label>
      </div>
      <CustomButton type="gradient" disabled={disabled} buttonStyle={{ marginTop: 4 }}>
        stake rewards
      </CustomButton>
      <CustomButton type="primary" disabled={disabled}>
        withdraw
      </CustomButton>
    </CommonWrapper>
  );
};

export default Rewards;
