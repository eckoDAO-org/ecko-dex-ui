import React from 'react';
import moment from 'moment';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import { CoinKaddexIcon } from '../../../assets';
import { KaddexOutlineIcon } from '../../../assets';
import { usePactContext } from '../../../contexts';
import { StakeModalRow, StakeModalText, IconSubTitle } from './AddStakeModal';

export const UnstakeModal = ({ onConfirm, estimateUnstakeData, toUnstakeAmount, stakedTimeStart }) => {
  const { kdxPrice } = usePactContext();
  const isThreePercentPenaltyActive = () => stakedTimeStart && moment().diff(stakedTimeStart, 'hours') <= 72;
  const isDynamicPenaltyActive = () => stakedTimeStart && moment().diff(stakedTimeStart, 'days') <= 60;

  const getUnstakeModalContent = () => {
    if (isThreePercentPenaltyActive()) {
      return (
        <>
          <StakeModalText>
            Removing KDX from your staking amount will incur a penalty of 3% of the unstaked amount, and all earned rewards.
          </StakeModalText>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 16 }}>
              <span>Penalty</span>
              <span>3%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 16 }}>
              <div>Amount </div>
              <div style={{ textAlign: 'right' }}>
                <div>{toUnstakeAmount * 0.03} KDX</div>
                <div style={{ color: 'grey', fontSize: 13, marginTop: 4 }}>{(toUnstakeAmount * 0.03 * kdxPrice).toFixed(2)} USD</div>
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
          <StakeModalText>
            Removing KDX from your staked amount - before the 60 day window - will incur in a dynamic penalty on your accumulated rewards.
          </StakeModalText>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 16 }}>
              <span>Rewards Penalty</span>
              <span>{rewardPenalty.toFixed(2)}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 16 }}>
              <div>Amount </div>
              <div style={{ textAlign: 'right' }}>
                <div>{estimateUnstakeData['reward-penalty'].toFixed(2)} KDX</div>
                <div style={{ color: 'grey', fontSize: 13, marginTop: 4 }}>{(estimateUnstakeData['reward-penalty'] * kdxPrice).toFixed(2)} USD</div>
              </div>
            </div>
          </div>
          <CustomDivider style={{ margin: '15px 0' }} />
        </>
      );
    } else {
      return (
        <>
          <StakeModalText fontSize={16}>Rewards Collected</StakeModalText>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>
                <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 16, height: 30, width: 30 }} />
              </span>
              <span>{estimateUnstakeData['reward-accrued']} </span>
            </div>
            <div>KDX</div>
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
      <StakeModalText fontSize={16}>Unstaked Amount</StakeModalText>
      <StakeModalRow>
        <div>
          <span>
            <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 16, height: 30, width: 30 }} />
          </span>
          <span>{toUnstakeAmount} </span>
        </div>
        <div>KDX</div>
      </StakeModalRow>
      <CustomButton type="gradient" buttonStyle={{ marginTop: 40 }} onClick={onConfirm}>
        CONFIRM
      </CustomButton>
    </div>
  );
};
