import React from 'react';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import { KaddexOutlineIcon } from '../../../assets';
import styled from 'styled-components';
import { STAKING_REWARDS_PERCENT } from '../../../constants/contextConstants';
import Label from '../../shared/Label';
import { usePactContext } from '../../../contexts';
import RowTokenInfoPrice from '../../shared/RowTokenInfoPrice';
import { getTokenIconByCode } from '../../../utils/token-utils';

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
  margin-bottom: 24px;
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
    g {
      stroke: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

export const AddStakeModal = ({ onConfirm, alreadyStakedAmount, toStakeAmount }) => {
  const { tokensUsdPrice } = usePactContext();

  const getModalText = () => {
    if (alreadyStakedAmount && alreadyStakedAmount > 0) {
      return `Adding more KDX to your staking amount will rebalance your multiplier depending on the amount staked and your current voting power.`;
    }
    return `Stakers will earn ${STAKING_REWARDS_PERCENT} % on all swaps taking place on Kaddex. This will give holders a simple way to earn passive income while at the same
      time participating in our governance program.`;
  };

  return (
    <div>
      <IconSubTitle>
        <KaddexOutlineIcon />
      </IconSubTitle>
      <div>
        <Label>{getModalText()}</Label>
      </div>
      <CustomDivider style={{ margin: '15px 0' }} />
      <Label fontSize={16}>Stake </Label>
      <StakeModalRow>
        <RowTokenInfoPrice tokenIcon={getTokenIconByCode('kaddex.kdx')} tokenName="KDX" amount={toStakeAmount} tokenPrice={tokensUsdPrice?.KDX} />
      </StakeModalRow>
      <CustomButton type="gradient" buttonStyle={{ marginTop: 32 }} onClick={onConfirm}>
        CONFIRM
      </CustomButton>
    </div>
  );
};
