import React from 'react';
import { commonColors } from '../../styles/theme';
import { humanReadableNumber } from '../../utils/reduceBalance';
import CustomButton from '../shared/CustomButton';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';
import CommonWrapper from './CommonWrapper';
import PentalityRewardsInfo from './PentalityRewardsInfo';

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
          <InfoPopup type="modal" title="penality rewards">
            <PentalityRewardsInfo />
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
