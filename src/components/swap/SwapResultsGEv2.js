import React, { useContext } from 'react';
import { PactContext } from '../../contexts/PactContext';
import { LiquidityContext } from '../../contexts/LiquidityContext';
import { reduceBalance } from '../../utils/reduceBalance';
import Label from '../shared/Label';
import PixeledInfoContainer, { InfoContainer } from '../game-edition-v2/components/PixeledInfoContainerBlue';

const SwapResultsGEv2 = ({ priceImpact, fromValues, toValues }) => {
  const pact = useContext(PactContext);
  const liquidity = useContext(LiquidityContext);
  return (
    <InfoContainer>
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
    </InfoContainer>
  );
};

export default SwapResultsGEv2;
