import React from 'react';
import styled from 'styled-components/macro';
import { usePactContext } from '../../../contexts';
import { extractDecimal, getDecimalPlaces, humanReadableNumber } from '../../../utils/reduceBalance';
import { getTokenByModuleV2, getTokenIconById } from '../../../utils/token-utils';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import { CryptoContainer, FlexContainer } from '../../shared/FlexContainer';
import Label from '../../shared/Label';

export const IconSubTitle = styled.div`
  text-align: center;
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
    g {
      stroke: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const ClaimYourKDXRewards = ({ multiplier, amount, onClick, hasObservedPrice, tokenA, tokenB, tokenAObservedPrice, tokenBObservedPrice }) => {
  const { tokensUsdPrice, allTokens } = usePactContext();

  return (
    <FlexContainer className="column" gap={16}>
      <div className="flex justify-sb">
        <Label fontSize={16}>KDX Multiplier</Label>
        <Label fontSize={16}>{extractDecimal(multiplier).toFixed(2)} x</Label>
      </div>

      {hasObservedPrice ? (
        <div className="flex column">
          <Label fontSize={16} labelStyle={{ marginBottom: 16 }}>
            5 Days Average Price
          </Label>
          <div className="flex justify-sb" style={{ marginBottom: 8 }}>
            <Label fontSize={16}>
              {allTokens[getTokenByModuleV2(tokenA, allTokens)].icon}{' '}
              {humanReadableNumber(extractDecimal(tokenAObservedPrice) * extractDecimal(tokensUsdPrice?.KDX))}
            </Label>
            <Label fontSize={16}>$</Label>
          </div>
          <div className="flex justify-sb">
            <Label fontSize={16}>
              {allTokens[getTokenByModuleV2(tokenB, allTokens)].icon}{' '}
              {humanReadableNumber(extractDecimal(tokenBObservedPrice) * extractDecimal(tokensUsdPrice?.KDX))}
            </Label>
            <Label fontSize={16}>$</Label>
          </div>
        </div>
      ) : null}

      <CustomDivider />

      <Label fontSize={16}>Amount</Label>

      <div className="flex align-ce">
        <CryptoContainer size={30}>{getTokenIconById('KDX', allTokens)}</CryptoContainer>
        <div className="column w-100">
          <div className="flex justify-sb">
            <Label fontSize={16}>{getDecimalPlaces(extractDecimal(amount))}</Label>
            <Label fontSize={16}>KDX</Label>
          </div>
          <div className="flex justify-sb">
            <Label fontSize={13} labelStyle={{ opacity: 0.7 }}>
              $ {humanReadableNumber(extractDecimal(tokensUsdPrice?.KDX) * extractDecimal(amount))}
            </Label>
          </div>
        </div>
      </div>
      <CustomButton type="secondary" onClick={onClick}>
        confirm
      </CustomButton>
    </FlexContainer>
  );
};

export default ClaimYourKDXRewards;
