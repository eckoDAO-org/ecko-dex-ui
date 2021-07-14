import React from "react";
import styled from "styled-components";
import { reduceBalance } from "../../utils/reduceBalance";

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0px;
  flex-flow: row;
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
  flex-flow: column;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: row;
  }
`;

const Label = styled.span`
  font: normal normal normal 14px/15px
    ${({ theme: { fontFamily } }) => fontFamily.regular};
  color: #ffffff;
  text-transform: capitalize;
`;

const Value = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.regular};
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
`;

const SwapResults = ({ priceImpact, fromValues, toValues }) => {
  return (
    <ResultContainer>
      <RowContainer>
        <Label>price</Label>
        <Value>
          {/* {`${reduceBalance(pact.ratio * (1 + priceImpact))} ${
          fromValues.coin
          } per ${toValues.coin}`} */}
        </Value>
      </RowContainer>
      <RowContainer>
        <Label>Price Impact</Label>
        <Value>
          {/* {pact.priceImpactWithoutFee(priceImpact) < 0.0001 &&
          pact.priceImpactWithoutFee(priceImpact)
            ? "< 0.01%"
            : `${reduceBalance(
                pact.priceImpactWithoutFee(priceImpact) * 100,
                4
              )}%`} */}
        </Value>
      </RowContainer>
      <RowContainer>
        <Label>max slippage</Label>
        <Value>{/* {`${pact.slippage * 100}%`} */}</Value>
      </RowContainer>
      <RowContainer>
        <Label>liquidity provider fee</Label>
        <Value>
          {/* {`${reduceBalance(
          pact.liquidityProviderFee * parseFloat(fromValues.amount),
          14
          )} ${fromValues.coin}`} */}
        </Value>
      </RowContainer>
    </ResultContainer>
  );
};

export default SwapResults;
