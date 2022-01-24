import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { PactContext } from '../../contexts/PactContext';
import { LiquidityContext } from '../../contexts/LiquidityContext';
import { reduceBalance } from '../../utils/reduceBalance';
import Label from '../shared/Label';
import { GE_DESKTOP_CONFIGURATION } from '../../contexts/GameEditionContext';
import PixeledInfoContainer from '../game-edition-v2/components/PixeledInfoContainer';

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0px 0px;
  padding-left: 16px;
  width: ${GE_DESKTOP_CONFIGURATION.displayWidth}px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  & > div:not(:last-child) {
    margin-right: 15px;
  }
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    margin: 5px 0px;
    flex-flow: column;
  }
`;

const SwapResultsGEv2 = ({ priceImpact, fromValues, toValues }) => {
  const pact = useContext(PactContext);
  const liquidity = useContext(LiquidityContext);
  return (
    <ResultContainer>
      <PixeledInfoContainer gameEditionView>
        <Label geFontSize={20} geColor="blue">{`price ${fromValues.coin} per ${toValues.coin}`}</Label>
        <Label geFontSize={28}>{`${reduceBalance(pact.ratio * (1 + priceImpact))}`}</Label>
      </PixeledInfoContainer>
      <PixeledInfoContainer gameEditionView>
        <Label geFontSize={20} geColor="blue">
          Price Impact
        </Label>
        <Label geFontSize={28}>
          {pact.priceImpactWithoutFee(priceImpact) < 0.0001 && pact.priceImpactWithoutFee(priceImpact)
            ? '< 0.01%'
            : `${reduceBalance(pact.priceImpactWithoutFee(priceImpact) * 100, 4)}%`}
        </Label>
      </PixeledInfoContainer>
      <PixeledInfoContainer gameEditionView geFontSize={20} geColor="blue">
        <Label geFontSize={20} geColor="blue">
          max slippage
        </Label>
        <Label geFontSize={28}>{`${pact.slippage * 100}%`}</Label>
      </PixeledInfoContainer>
      <PixeledInfoContainer gameEditionView>
        <Label geFontSize={20} geColor="blue">
          liquidity provider fee
        </Label>
        <Label geFontSize={28}>
          {`${(liquidity.liquidityProviderFee * parseFloat(fromValues.amount)).toFixed(fromValues.precision)} ${fromValues.coin}`}
        </Label>
      </PixeledInfoContainer>
    </ResultContainer>
  );
};

export default SwapResultsGEv2;
