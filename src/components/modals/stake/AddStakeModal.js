import React from 'react';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import { CoinKaddexIcon } from '../../../assets';
import { KaddexOutlineIcon } from '../../../assets';
import styled from 'styled-components';
import { STAKING_REWARDS_PERCENT } from '../../../constants/contextConstants';

export const StakeModalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  div {
    display: flex;
    align-items: center;
  }
`;

export const IconSubTitle = styled.div`
  text-align: center;
  margin: 15px 0 24px 0;
`;

export const StakeModalText = styled.span`
  font-size: ${({ fontSize }) => `${fontSize || 13}px`};
`;

export const AddStakeModal = ({ onConfirm, alreadyStakedAmount, toStakeAmount }) => {
  const getModalText = () => {
    if (alreadyStakedAmount && alreadyStakedAmount > 0) {
      return `Adding more KDX to your staking amount will dilute your multiplier depending on the amount staked and your current voting power.`;
    }
    return `Stakers will earn ${STAKING_REWARDS_PERCENT}% on all swaps taking place on Kaddex. This will give holders a simple way to earn passive income while at the same
      time participating in our governance program.`;
  };

  return (
    <div>
      <IconSubTitle>
        <KaddexOutlineIcon />
      </IconSubTitle>
      <div>
        <StakeModalText>{getModalText()}</StakeModalText>
      </div>
      <CustomDivider style={{ margin: '15px 0' }} />
      <StakeModalText fontSize={16}>Stake </StakeModalText>
      <StakeModalRow>
        <div>
          <span>
            <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 16, height: 30, width: 30 }} />
          </span>
          <span>{toStakeAmount} </span>
        </div>
        <div>KDX</div>
      </StakeModalRow>
      <CustomButton type="gradient" buttonStyle={{ marginTop: 40 }} onClick={onConfirm}>
        CONFIRM
      </CustomButton>
    </div>
  );
};
