import React from 'react';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import { CoinKaddexIcon } from '../../../assets';
import { KaddexOutlineIcon } from '../../../assets';
import styled from 'styled-components';
import { STAKING_REWARDS_PERCENT } from '../../../constants/contextConstants';
import Label from '../../shared/Label';
import { FlexContainer } from '../../shared/FlexContainer';
import { getDecimalPlaces } from '../../../utils/reduceBalance';
import { usePactContext } from '../../../contexts';

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
  const { kdxPrice } = usePactContext();

  const getModalText = () => {
    if (alreadyStakedAmount && alreadyStakedAmount > 0) {
      return `Adding more KDX to your staking amount will rebalance your multiplier depending on the amount staked and your current voting power.`;
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
        <Label>{getModalText()}</Label>
      </div>
      <CustomDivider style={{ margin: '15px 0' }} />
      <Label fontSize={16}>Stake </Label>
      <StakeModalRow>
        <FlexContainer className="w-100">
          <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 16, height: 30, width: 30 }} />
          <FlexContainer className="column w-100">
            <FlexContainer className="justify-sb w-100">
              <Label>{getDecimalPlaces(toStakeAmount)} </Label>
              <Label>KDX</Label>
            </FlexContainer>
            <FlexContainer className="justify-sb w-100">
              <Label labelStyle={{ opacity: 0.7, fontSize: 13 }}>{(toStakeAmount * kdxPrice).toFixed(2)}</Label>
              <Label labelStyle={{ opacity: 0.7, fontSize: 13 }}>USD</Label>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </StakeModalRow>
      <CustomButton type="gradient" buttonStyle={{ marginTop: 40 }} onClick={onConfirm}>
        CONFIRM
      </CustomButton>
    </div>
  );
};
