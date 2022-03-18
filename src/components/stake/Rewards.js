import React from 'react';
import { commonColors } from '../../styles/theme';
import { humanReadableNumber } from '../../utils/reduceBalance';
import CustomButton from '../shared/CustomButton';
import { FlexContainer } from '../shared/FlexContainer';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';

const Rewards = ({ amount, stakedTime, rewardsPenality }) => {
  return (
    <div className="column w-100">
      <Label fontSize={16} fontFamily="syncopate">
        rewards
      </Label>

      <FlexContainer withGradient className="column background-fill">
        <Label>Rewards Collected</Label>
        <Label fontSize={32} fontFamily="syncopate">
          {humanReadableNumber(amount)}
        </Label>

        <Label>Stake Time</Label>
        <Label fontSize={24} colors={commonColors.green}>
          {stakedTime} days
        </Label>

        <div className="flex align-ce">
          <Label>Rewards Penality</Label>
          <InfoPopup>
            The penalty structure of the KDX Staking tool is designed to achieve two objectives: to reward long-term holders and to prevent
            manipulation and spam of the smart contract involved. If you unstake during the first 72hours you will incur in a penalty: 3% flat penalty
            on your staked amount. If you withdraw your rewards during the first 60 days, you will incur in a penalty: the penalty will only affect
            your accumulated rewards and exponentially decreases in time. Your initial capital will not be affected.
          </InfoPopup>
        </div>

        <Label fontSize={24} colors={commonColors.green}>
          {rewardsPenality} %
        </Label>

        <CustomButton type="gradient">stake rewards</CustomButton>
        <CustomButton type="primary">withdraw</CustomButton>
      </FlexContainer>
    </div>
  );
};

export default Rewards;
