import React from 'react';
import { reduceBalance } from '../../utils/reduceBalance';
import PixeledBlueContainer, { InfoContainer } from '../game-edition-v2/components/PixeledInfoContainerBlue';
import { useLiquidityContext, usePactContext } from '../../contexts';

const SwapResultsGEv2 = ({ priceImpact, fromValues, toValues }) => {
  const pact = usePactContext();
  const liquidity = useLiquidityContext();
  return (
    <InfoContainer style={{ marginTop: 6, paddingLeft: 16, paddingRight: 16 }}>
      <PixeledBlueContainer label={`${fromValues.coin}/${toValues.coin}`} value={`${reduceBalance(pact.ratio * (1 + priceImpact))}`} />
      <PixeledBlueContainer
        label="price impact"
        value={
          pact.priceImpactWithoutFee(priceImpact) < 0.0001 && pact.priceImpactWithoutFee(priceImpact)
            ? '< 0.01%'
            : `${reduceBalance(pact.priceImpactWithoutFee(priceImpact) * 100, 4)}%`
        }
      />
      <PixeledBlueContainer label="max slippage" value={`${pact.slippage * 100}%`} />

      <PixeledBlueContainer
        label="lp fee"
        value={`${(liquidity.liquidityProviderFee * parseFloat(fromValues.amount)).toExponential(4)} ${fromValues.coin}`}
      />
    </InfoContainer>
  );
};

export default SwapResultsGEv2;
