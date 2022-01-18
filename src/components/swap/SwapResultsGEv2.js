import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { PactContext } from '../../contexts/PactContext';
import { LiquidityContext } from '../../contexts/LiquidityContext';
import { reduceBalance } from '../../utils/reduceBalance';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import PixeledSwapResult from '../../assets/images/game-edition/pixeled-swap-result.png';

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0px 0px;
  padding: 0px 10px;
  /* width: 100%; */
  /* position: ${({ gameEditionView }) => gameEditionView && 'absolute'}; */
  width: 436px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    margin: 5px 0px;
    flex-flow: column;
  }
  & > *:not(:last-child) {
    margin-bottom: ${({ gameEditionView }) => !gameEditionView && `10px`};
  }
`;

const InfoContainer = styled.div`
  margin-right: 15px;
  display: flex;
  flex-flow: column;
  min-width: 194px;
  min-height: 82px;
  justify-content: center;
  text-align: center;
  align-items: center;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: ${`url(${PixeledSwapResult})`};
`;

const Label = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) => (gameEditionView ? fontFamily.pixeboy : fontFamily.regular)};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '20px' : '13px')};
  color: ${({ theme: { colors }, gameEditionView }) => colors.gameEditionBlue};
  text-transform: capitalize;
  display: flex;
  align-items: center;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    text-align: left;
  }
`;

const Value = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) => (gameEditionView ? fontFamily.pixeboy : fontFamily.bold)};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '24px' : '13px')};
  line-height: 20px;
  color: ${({ theme: { colors }, gameEditionView }) => colors.white};
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    text-align: ${({ gameEditionView }) => (gameEditionView ? 'left' : 'right')};
    margin-bottom: ${({ gameEditionView }) => gameEditionView && '5px'};
  }
`;

const SwapResultsGEv2 = ({ priceImpact, fromValues, toValues }) => {
  const pact = useContext(PactContext);
  const liquidity = useContext(LiquidityContext);
  const { gameEditionView } = useContext(GameEditionContext);
  return (
    <ResultContainer gameEditionView={gameEditionView}>
      <InfoContainer gameEditionView={gameEditionView}>
        <Label gameEditionView={gameEditionView}>{`price ${fromValues.coin} per ${toValues.coin}`}</Label>
        <Value gameEditionView={gameEditionView}>{`${reduceBalance(pact.ratio * (1 + priceImpact))}`}</Value>
      </InfoContainer>
      <InfoContainer gameEditionView={gameEditionView}>
        <Label gameEditionView={gameEditionView}>Price Impact</Label>
        <Value gameEditionView={gameEditionView}>
          {pact.priceImpactWithoutFee(priceImpact) < 0.0001 && pact.priceImpactWithoutFee(priceImpact)
            ? '< 0.01%'
            : `${reduceBalance(pact.priceImpactWithoutFee(priceImpact) * 100, 4)}%`}
        </Value>
      </InfoContainer>
      <InfoContainer gameEditionView={gameEditionView}>
        <Label gameEditionView={gameEditionView}>max slippage</Label>
        <Value gameEditionView={gameEditionView}>{`${pact.slippage * 100}%`}</Value>
      </InfoContainer>
      <InfoContainer gameEditionView={gameEditionView}>
        <Label gameEditionView={gameEditionView}>liquidity provider fee</Label>
        <Value gameEditionView={gameEditionView}>
          {`${(liquidity.liquidityProviderFee * parseFloat(fromValues.amount)).toFixed(fromValues.precision)} ${fromValues.coin}`}
        </Value>
      </InfoContainer>
    </ResultContainer>
  );
};

export default SwapResultsGEv2;
