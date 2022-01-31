import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { PactContext } from '../../contexts/PactContext';
import { LiquidityContext } from '../../contexts/LiquidityContext';
import { reduceBalance } from '../../utils/reduceBalance';
import Label from '../shared/Label';

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 16px 0px;
  flex-flow: column;
  width: 100%;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    margin: 10px 0px;
    flex-flow: column;
  }
  & > *:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: row;
`;

const SwapResults = ({ priceImpact, fromValues, toValues }) => {
  const pact = useContext(PactContext);
  const liquidity = useContext(LiquidityContext);
  return (
    <ResultContainer>
      <RowContainer>
        <Label fontSize={13}>Price</Label>
        <Label fontSize={13} fontFamily="bold" labelStyle={{ textAlign: 'end' }}>
          {reduceBalance(pact.ratio * (1 + priceImpact))} {fromValues.coin}/{toValues.coin}
        </Label>
      </RowContainer>
      <RowContainer>
        <Label fontSize={13}>Price Impact</Label>
        <Label fontSize={13} fontFamily="bold" labelStyle={{ textAlign: 'end' }}>
          {pact.priceImpactWithoutFee(priceImpact) < 0.0001 && pact.priceImpactWithoutFee(priceImpact)
            ? '< 0.01%'
            : `${reduceBalance(pact.priceImpactWithoutFee(priceImpact) * 100, 4)}%`}
        </Label>
      </RowContainer>
      <RowContainer>
        <Label fontSize={13}>Max Slippage</Label>
        <Label fontSize={13} fontFamily="bold" labelStyle={{ textAlign: 'end' }}>
          {pact.slippage * 100}%
        </Label>
      </RowContainer>
      <RowContainer>
        <Label fontSize={13}>Liquidity Provider Fee</Label>
        <Label fontSize={13} fontFamily="bold" labelStyle={{ textAlign: 'end' }}>
          {(liquidity.liquidityProviderFee * parseFloat(fromValues.amount)).toFixed(fromValues.precision)} {fromValues.coin}
        </Label>
      </RowContainer>
    </ResultContainer>
  );
};

export default SwapResults;
