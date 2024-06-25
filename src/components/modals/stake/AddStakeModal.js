import React from 'react';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import styled from 'styled-components';
import { KADDEX_NAMESPACE, STAKING_REWARDS_PERCENT } from '../../../constants/contextConstants';
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
  const pact = usePactContext();

  const getModalText = () => {
    if (alreadyStakedAmount && alreadyStakedAmount > 0) {
      return `Adding more KDX to your stake, will simply increase your waiting time proportionally, and it will also activate a 3% flat penalty fee on any unstaked amount for 72hours. Once the 72 hours have passed, you can unstake your tokens normally without paying this penalty.`;
    }
    return `Stakers will earn ${STAKING_REWARDS_PERCENT} % on all swaps taking place on eckoDEX. This will give holders a simple way to earn passive income while at the same time participating in our governance program. Supplying KDX to our staking program will activate a 3% flat penalty fee on any unstaked amount for 72hours. Once the 72 hours have passed, you can unstake your tokens normally without paying this penalty.`;
  };

  return (
    <div>
      <div>
        <Label>{getModalText()}</Label>
      </div>
      <CustomDivider style={{ margin: '15px 0' }} />
      <Label fontSize={16}>Stake </Label>
      <StakeModalRow>
        <RowTokenInfoPrice
          tokenIcon={getTokenIconByCode(`${KADDEX_NAMESPACE}.kdx`, pact.allTokens)}
          tokenName="KDX"
          amount={toStakeAmount}
          tokenPrice={pact.tokensUsdPrice?.KDX}
        />
      </StakeModalRow>
      <CustomButton type="secondary" buttonStyle={{ marginTop: 32 }} onClick={onConfirm}>
        CONFIRM
      </CustomButton>
    </div>
  );
};
