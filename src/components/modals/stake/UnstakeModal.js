import React, { useState } from 'react';
import moment from 'moment';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import { CoinKaddexIcon } from '../../../assets';
import { KaddexOutlineIcon } from '../../../assets';
import { usePactContext } from '../../../contexts';
import { StakeModalRow, IconSubTitle } from './AddStakeModal';
import Label from '../../shared/Label';
import CustomCheckbox from '../../shared/CustomCheckbox';
import { FlexContainer } from '../../shared/FlexContainer';
import { getDecimalPlaces } from '../../../utils/reduceBalance';

export const UnstakeModal = ({ onConfirm, isRewardsAvailable, estimateUnstakeData, toUnstakeAmount, stakedTimeStart }) => {
  const [checked, setChecked] = useState(false);

  const { kdxPrice } = usePactContext();
  const isThreePercentPenaltyActive = () => stakedTimeStart && moment().diff(stakedTimeStart, 'hours') <= 72;
  const isDynamicPenaltyActive = () => stakedTimeStart && moment().diff(stakedTimeStart, 'days') <= 60;

  const getUnstakeModalContent = () => {
    if (isThreePercentPenaltyActive()) {
      return (
        <>
          <Label>
            Removing KDX from your staking amount will incur a penalty of 3% of the unstaked amount. All the KDX penalties are going to be burnt in
            order to reduce the overall supply.
          </Label>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 16 }}>
              <Label>Penalty</Label>
              <Label>3%</Label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 16 }}>
              <Label>Amount </Label>
              <div style={{ textAlign: 'right' }}>
                <Label>{getDecimalPlaces(toUnstakeAmount * 0.03)} KDX</Label>
                <Label labelStyle={{ opacity: 0.7, fontSize: 13, marginTop: 4 }}>{(toUnstakeAmount * 0.03 * kdxPrice).toFixed(2)} USD</Label>
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
            Unstaking KDX will reset the rewards penalty timer to 60 days. The rewards penalty will occur only if the user chooses to claim their
            rewards at their current penalty rate.
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
        <FlexContainer className="w-100">
          <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 16, height: 30, width: 30 }} />
          <FlexContainer className="column w-100">
            <FlexContainer className="justify-sb w-100">
              <Label>{getDecimalPlaces(toUnstakeAmount)} </Label>
              <Label>KDX</Label>
            </FlexContainer>
            <FlexContainer className="justify-sb w-100">
              <Label labelStyle={{ opacity: 0.7, fontSize: 13 }}>{(toUnstakeAmount * kdxPrice).toFixed(2)}</Label>
              <Label labelStyle={{ opacity: 0.7, fontSize: 13 }}>USD</Label>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </StakeModalRow>
      {isRewardsAvailable && (
        <StakeModalRow style={{ margin: '8px 0px 0px 4px' }}>
          <CustomCheckbox onClick={() => setChecked(!checked)}>Withdraw your KDX staking rewards</CustomCheckbox>
        </StakeModalRow>
      )}
      <CustomButton type="gradient" buttonStyle={{ marginTop: 30 }} onClick={() => onConfirm(checked)}>
        CONFIRM
      </CustomButton>
    </div>
  );
};
