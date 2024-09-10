import React from 'react';
import styled from 'styled-components/macro';
import { getDecimalPlaces, reduceBalance } from '../../utils/reduceBalance';
import Label from '../shared/Label';
import { usePactContext } from '../../contexts';
import { commonColors } from '../../styles/theme';
import { FEE } from '../../constants/contextConstants';

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 16px 0px;
  flex-flow: column;
  width: 100%;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
  & > *:not(:last-child) {
    margin-bottom: 12px;
  }
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: row;
`;

const SwapResults = ({ priceImpact, fromValues, toValues }) => {
  const pact = usePactContext();

  const getPriceImpactColor = () => {
    if (pact.priceImpactWithoutFee(priceImpact)) {
      const priceImpactPercentage = reduceBalance(pact.priceImpactWithoutFee(priceImpact) * 100, 4);
      if (priceImpactPercentage < 1) {
        return commonColors.green;
      } else if (priceImpactPercentage >= 1 && priceImpactPercentage < 5) {
        return commonColors.yellow;
      } else if (priceImpactPercentage >= 5) {
        return commonColors.red;
      }
    }
  };

  const isHeronInvolved = fromValues.coin === 'HERON' || toValues.coin === 'HERON';


  return (
    <ResultContainer>
      
      <RowContainer>
        <Label fontSize={13} color={getPriceImpactColor()}>
          Price Impact
        </Label>
        <Label fontSize={13} labelStyle={{ textAlign: 'end' }} color={getPriceImpactColor()}>
          {pact.priceImpactWithoutFee(priceImpact) < 0.0001 && pact.priceImpactWithoutFee(priceImpact)
            ? '< 0.01 %'
            : `${reduceBalance(pact.priceImpactWithoutFee(priceImpact) * 100, 4)} %`}
        </Label>
      </RowContainer>
      {isHeronInvolved && (
        <RowContainer>
          <Label fontSize={13} color={commonColors.red}>
            Burn Fee
          </Label>
          <Label fontSize={13} labelStyle={{ textAlign: 'end' }} color={commonColors.red}>
            1%
          </Label>
        </RowContainer>
      )}
      <RowContainer>
        <Label fontSize={13}>Price</Label>
        <Label fontSize={13} labelStyle={{ textAlign: 'end' }}>
          {reduceBalance(pact.ratio * (1 + priceImpact)) < 0.000001 ? '< 0.000001' : reduceBalance(pact.ratio * (1 + priceImpact))} {fromValues.coin}/
          {toValues.coin}
        </Label>
      </RowContainer>
      <RowContainer>
        <Label fontSize={13}>Max Slippage</Label>
        <Label fontSize={13} labelStyle={{ textAlign: 'end' }}>
          {pact.slippage * 100} %
        </Label>
      </RowContainer>
      <RowContainer>
        <Label fontSize={13}>Liquidity Provider Fee</Label>
        <Label fontSize={13} labelStyle={{ textAlign: 'end' }}>
          {getDecimalPlaces(FEE * parseFloat(fromValues.amount))} {fromValues.coin}
        </Label>
      </RowContainer>
      {pact.isMultihopsSwap ? (
        <RowContainer>
          <Label fontSize={13} />
          <Label fontSize={13} labelStyle={{ textAlign: 'end' }}>
            {getDecimalPlaces(FEE * pact.multihopsCoinAmount)} KDA
          </Label>
        </RowContainer>
      ) : (
        ''
      )}
    </ResultContainer>
  );
};

export default SwapResults;
