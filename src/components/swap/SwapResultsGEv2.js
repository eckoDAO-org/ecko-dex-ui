import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { PactContext } from '../../contexts/PactContext';
import { LiquidityContext } from '../../contexts/LiquidityContext';
import { reduceBalance } from '../../utils/reduceBalance';
import PixeledSwapResult from '../../assets/images/game-edition/pixeled-swap-result.png';
import Label from '../shared/Label';

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0px 0px;
  padding: 0px 10px;

  width: 436px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    margin: 5px 0px;
    flex-flow: column;
  }
`;

const InfoContainer = styled.div`
  margin-right: 15px;
  display: flex;
  flex-flow: column;
  min-width: 194px;
  min-height: 68px;
  justify-content: center;
  text-align: center;
  align-items: center;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: ${`url(${PixeledSwapResult})`};
`;

const SwapResultsGEv2 = ({ priceImpact, fromValues, toValues }) => {
  const pact = useContext(PactContext);
  const liquidity = useContext(LiquidityContext);
  return (
    <ResultContainer>
      <InfoContainer>
        <Label geFontSize={20} geColor="blue">{`price ${fromValues.coin} per ${toValues.coin}`}</Label>
        <Label geFontSize={28}>{`${reduceBalance(pact.ratio * (1 + priceImpact))}`}</Label>
      </InfoContainer>
      <InfoContainer>
        <Label geFontSize={20} geColor="blue">
          Price Impact
        </Label>
        <Label geFontSize={28}>
          {pact.priceImpactWithoutFee(priceImpact) < 0.0001 && pact.priceImpactWithoutFee(priceImpact)
            ? '< 0.01%'
            : `${reduceBalance(pact.priceImpactWithoutFee(priceImpact) * 100, 4)}%`}
        </Label>
      </InfoContainer>
      <InfoContainer geFontSize={20} geColor="blue">
        <Label>max slippage</Label>
        <Label geFontSize={28}>{`${pact.slippage * 100}%`}</Label>
      </InfoContainer>
      <InfoContainer>
        <Label geFontSize={20} geColor="blue">
          liquidity provider fee
        </Label>
        <Label geFontSize={28}>
          {`${(liquidity.liquidityProviderFee * parseFloat(fromValues.amount)).toFixed(fromValues.precision)} ${fromValues.coin}`}
        </Label>
      </InfoContainer>
    </ResultContainer>
  );
};

export default SwapResultsGEv2;
