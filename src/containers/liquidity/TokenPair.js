import React from "react";
import styled from "styled-components/macro";
import { Button } from "semantic-ui-react";

import {
  reduceBalance,
  extractDecimal,
  pairUnit,
} from "../../utils/reduceBalance";
import CustomButton from "../../shared/CustomButton";

const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0px 32px;
  flex-flow: row;
  width: 100%;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
`;

const HeaderContainer = styled.span`
  display: flex;
  width: 100%;
  margin: 0;
  color: #ffffff;
  font-weight: bold;
  font-size: 20px;
  text-align: left;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  width: 100%;
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: column;
`;

const Label = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  color: #ffffff;
  text-transform: capitalize;
`;

const Value = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    margin-bottom: 5px;
  }
`;

const TokenPair = (props) => {
  let { token0, token1, balance, supply, pooledAmount } = props.pair;

  return balance ? (
    <Container>
      <HeaderContainer>
        {token0} / {token1}
      </HeaderContainer>

      <ResultContainer>
        <RowContainer>
          <Label>Your pool tokens:</Label>
          <Value>{pairUnit(extractDecimal(balance))}</Value>
        </RowContainer>
        <RowContainer>
          <Label>Pooled {token0}:</Label>
          <Value>{pairUnit(extractDecimal(pooledAmount[0]))}</Value>
        </RowContainer>
        <RowContainer>
          <Label>Pooled {token1}:</Label>
          <Value>{pairUnit(extractDecimal(pooledAmount[1]))}</Value>
        </RowContainer>
        <RowContainer>
          <Label>Your pool share:</Label>
          <Value>
            {reduceBalance(
              (extractDecimal(balance) / extractDecimal(supply)) * 100
            )}
            %
          </Value>
        </RowContainer>
      </ResultContainer>

      <ButtonContainer>
        <Button.Group fluid>
          <CustomButton
            buttonStyle={{
              marginRight: "30px",
              width: "50%",
            }}
            background="transparent"
            onClick={() => {
              props.selectRemoveLiquidity();
              props.setTokenPair(props.pair);
            }}
          >
            Remove
          </CustomButton>
          <CustomButton
            buttonStyle={{
              marginLeft: "-20px",
              width: "50%",
            }}
            background="transparent"
            onClick={() => {
              props.selectAddLiquidity();
              props.setTokenPair(props.pair);
            }}
          >
            Add
          </CustomButton>
        </Button.Group>
      </ButtonContainer>
    </Container>
  ) : (
    ""
  );
};

export default TokenPair;
