import React, { useContext } from "react";
import styled from "styled-components";
import { PactContext } from "../../contexts/PactContext";
import { LiquidityContext } from "../../contexts/LiquidityContext";
import { reduceBalance } from "../../utils/reduceBalance";
import { GameEditionContext } from "../../contexts/GameEditionContext";

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${({ gameEditionView }) => (gameEditionView ? `0px` : ` 15px 0px`)};
  padding: ${({ gameEditionView }) => (gameEditionView ? `0 10px` : ` 0px`)};
  flex-flow: ${({ gameEditionView }) => (gameEditionView ? `column` : ` row`)};
  width: 100%;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
    margin-bottom: 0px;
  }
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: ${({ gameEditionView }) => (gameEditionView ? `row` : ` column`)};
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: row;
  }
`;

const Label = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular};
  font-size: ${({ gameEditionView }) => (gameEditionView ? "10px" : "16px")};
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : "#ffffff"};
  text-transform: capitalize;
`;

const Value = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular};
  font-size: ${({ gameEditionView }) => (gameEditionView ? "10px" : "16px")};
  line-height: 20px;
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : "#ffffff"};
`;

const SwapResults = ({ priceImpact, fromValues, toValues }) => {
  const pact = useContext(PactContext);
  const liquidity = useContext(LiquidityContext);
  const { gameEditionView } = useContext(GameEditionContext);
  return (
    <ResultContainer gameEditionView={gameEditionView}>
      <RowContainer gameEditionView={gameEditionView}>
        <Label gameEditionView={gameEditionView}>price</Label>
        <Value gameEditionView={gameEditionView}>
          {`${reduceBalance(pact.ratio * (1 + priceImpact))} ${
            fromValues.coin
          } per ${toValues.coin}`}
        </Value>
      </RowContainer>
      <RowContainer gameEditionView={gameEditionView}>
        <Label gameEditionView={gameEditionView}>Price Impact</Label>
        <Value gameEditionView={gameEditionView}>
          {pact.priceImpactWithoutFee(priceImpact) < 0.0001 &&
          pact.priceImpactWithoutFee(priceImpact)
            ? "< 0.01%"
            : `${reduceBalance(
                pact.priceImpactWithoutFee(priceImpact) * 100,
                4
              )}%`}
        </Value>
      </RowContainer>
      <RowContainer gameEditionView={gameEditionView}>
        <Label gameEditionView={gameEditionView}>max slippage</Label>
        <Value gameEditionView={gameEditionView}>{`${
          pact.slippage * 100
        }%`}</Value>
      </RowContainer>
      <RowContainer gameEditionView={gameEditionView}>
        <Label gameEditionView={gameEditionView}>liquidity provider fee</Label>
        <Value gameEditionView={gameEditionView}>
          {`${(
            liquidity.liquidityProviderFee * parseFloat(fromValues.amount)
          ).toFixed(fromValues.precision)} ${fromValues.coin}`}
          {/* {`${reduceBalance(
            liquidity.liquidityProviderFee * parseFloat(fromValues.amount),
            14
          )} ${fromValues.coin}`} */}
        </Value>
      </RowContainer>
    </ResultContainer>
  );
};

export default SwapResults;
