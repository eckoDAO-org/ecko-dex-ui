import React from 'react';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import { CoinKaddexIcon } from '../../../assets';
import { KaddexOutlineIcon } from '../../../assets';
import { StakeModalRow, IconSubTitle } from './AddStakeModal';
import Label from '../../shared/Label';

export const ClaimModal = ({ onConfirm, estimateUnstakeData }) => {
  return (
    <div>
      <IconSubTitle>
        <KaddexOutlineIcon />
      </IconSubTitle>
      <CustomDivider style={{ margin: '15px 0' }} />
      <Label fontSize={16}>Staking Rewards Collected</Label>
      <StakeModalRow style={{ marginBottom: 20 }}>
        <div>
          <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 16, height: 30, width: 30 }} />
          <Label>{estimateUnstakeData['reward-accrued']} </Label>
        </div>
        <Label>KDX</Label>
      </StakeModalRow>

      {estimateUnstakeData['reward-penalty'] ? (
        <>
          <Label fontSize={16}>Claim Penalty</Label>
          <StakeModalRow>
            <div>
              <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 16, height: 30, width: 30 }} />
              <Label>{estimateUnstakeData['reward-penalty']} </Label>
            </div>
            <Label>KDX</Label>
          </StakeModalRow>
        </>
      ) : null}
      <CustomButton type="gradient" buttonStyle={{ marginTop: 40 }} onClick={onConfirm}>
        WITHDRAW
      </CustomButton>
    </div>
  );
};
