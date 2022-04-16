import React from 'react';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import { CoinKaddexIcon } from '../../../assets';
import { KaddexOutlineIcon } from '../../../assets';
import { StakeModalRow, StakeModalText, IconSubTitle } from './AddStakeModal';

export const ClaimModal = ({ onConfirm, estimateUnstakeData }) => {
  return (
    <div>
      <IconSubTitle>
        <KaddexOutlineIcon />
      </IconSubTitle>
      <CustomDivider style={{ margin: '15px 0' }} />
      <StakeModalText fontSize={16}>Staking Rewards Collected</StakeModalText>
      <StakeModalRow style={{ marginBottom: 20 }}>
        <div>
          <span>
            <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 16, height: 30, width: 30 }} />
          </span>
          <span>{estimateUnstakeData['reward-accrued']} </span>
        </div>
        <div>KDX</div>
      </StakeModalRow>
      {estimateUnstakeData['reward-penalty'] && (
        <>
          <StakeModalText fontSize={16}>Rewards Penalty</StakeModalText>
          <StakeModalRow>
            <div>
              <span>
                <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 16, height: 30, width: 30 }} />
              </span>
              <span>{estimateUnstakeData['reward-penalty']} </span>
            </div>
            <div>KDX</div>
          </StakeModalRow>
        </>
      )}
      <CustomButton type="gradient" buttonStyle={{ marginTop: 40 }} onClick={onConfirm}>
        WITHDRAW
      </CustomButton>
    </div>
  );
};
