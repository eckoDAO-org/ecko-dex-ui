import React from 'react';
import moment from 'moment';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import { CoinKaddexIcon } from '../../../assets';
import { KaddexOutlineIcon } from '../../../assets';
import { usePactContext } from '../../../contexts';
import { StakeModalRow, IconSubTitle } from './AddStakeModal';
import Label from '../../shared/Label';

export const UnstakeModal = ({ onConfirm, estimateUnstakeData, toUnstakeAmount, stakedTimeStart }) => {
  const { kdxPrice } = usePactContext();
  const isThreePercentPenaltyActive = () => stakedTimeStart && moment().diff(stakedTimeStart, 'hours') <= 72;
  const isDynamicPenaltyActive = () => stakedTimeStart && moment().diff(stakedTimeStart, 'days') <= 60;

  const getUnstakeModalContent = () => {
    if (isThreePercentPenaltyActive()) {
      return (
        <>
          <Label>Removing KDX from your staking amount will incur a penalty of 3% of the unstaked amount, and all earned rewards.</Label>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 16 }}>
              <Label>Penalty</Label>
              <Label>3%</Label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 16 }}>
              <Label>Amount </Label>
              <div style={{ textAlign: 'right' }}>
                <Label>{toUnstakeAmount * 0.03} KDX</Label>
                <Label style={{ color: 'grey', fontSize: 13, marginTop: 4 }}>{(toUnstakeAmount * 0.03 * kdxPrice).toFixed(2)} USD</Label>
              </div>
            </div>
          </div>
          <CustomDivider style={{ margin: '15px 0' }} />
        </>
      );
    } else if (isDynamicPenaltyActive()) {
      const rewardPenalty = (100 * estimateUnstakeData['reward-penalty']) / estimateUnstakeData['reward-accrued'];
      return (
        <>
          <Label>
            Removing KDX from your staked amount - before the 60 day window - will incur in a dynamic penalty on your accumulated rewards.
          </Label>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 16 }}>
              <Label>Rewards Penalty</Label>
              <Label>{rewardPenalty.toFixed(2)}%</Label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 16 }}>
              <Label>Amount </Label>
              <div style={{ textAlign: 'right' }}>
                <Label>{estimateUnstakeData['reward-penalty'].toFixed(2)} KDX</Label>
                <Label style={{ color: 'grey', fontSize: 13, marginTop: 4 }}>
                  {(estimateUnstakeData['reward-penalty'] * kdxPrice).toFixed(2)} USD
                </Label>
              </div>
            </div>
          </div>
          <CustomDivider style={{ margin: '15px 0' }} />
        </>
      );
    } else {
      return (
        <>
          <Label fontSize={16}>Rewards Collected</Label>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 16, height: 30, width: 30 }} />
              <Label>{estimateUnstakeData['reward-accrued']} </Label>
            </div>
            <Label>KDX</Label>
          </div>
        </>
      );
    }
  };

  return (
    <div>
      <IconSubTitle>
        <KaddexOutlineIcon />
      </IconSubTitle>
      {getUnstakeModalContent()}
      <Label fontSize={16}>Unstaked Amount</Label>
      <StakeModalRow>
        <div>
          <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 16, height: 30, width: 30 }} />
          <Label>{toUnstakeAmount} </Label>
        </div>
        <Label>KDX</Label>
      </StakeModalRow>
      <CustomButton type="gradient" buttonStyle={{ marginTop: 40 }} onClick={onConfirm}>
        CONFIRM
      </CustomButton>
    </div>
  );
};
