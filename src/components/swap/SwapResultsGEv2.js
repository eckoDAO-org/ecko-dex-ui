import React from 'react';
import { reduceBalance } from '../../utils/reduceBalance';
import PixeledBlueContainer, { InfoContainer } from '../game-edition-v2/components/PixeledInfoContainerBlue';
import { usePactContext } from '../../contexts';
import { FEE } from '../../constants/contextConstants';

const SwapResultsGEv2 = ({ priceImpact, fromValues, toValues }) => {
  const pact = usePactContext();
  return (
    <InfoContainer style={{ marginTop: 6, paddingLeft: 16, paddingRight: 16 }}>
      <PixeledBlueContainer label={`${fromValues.coin}/${toValues.coin}`} value={`${reduceBalance(pact.ratio * (1 + priceImpact))}`} />
      <PixeledBlueContainer
        label="price impact"
        value={
          pact.priceImpactWithoutFee(priceImpact) < 0.0001 && pact.priceImpactWithoutFee(priceImpact)
            ? '< 0.01 %'
            : `${reduceBalance(pact.priceImpactWithoutFee(priceImpact) * 100, 4)} %`
        }
      />
      <PixeledBlueContainer label="max slippage" value={`${pact.slippage * 100} %`} />

      <PixeledBlueContainer label="lp fee" value={`${(FEE * parseFloat(fromValues.amount)).toExponential(4)} ${fromValues.coin}`} />
    </InfoContainer>
  );
};

export default SwapResultsGEv2;
