import React, { useContext } from "react";
import styled from "styled-components/macro";
import { Button } from "semantic-ui-react";

import {
  reduceBalance,
  extractDecimal,
  pairUnit,
} from "../../utils/reduceBalance";
import CustomButton from "../../shared/CustomButton";
import { GameEditionContext } from "../../contexts/GameEditionContext";
import theme from "../../styles/theme";

const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`;

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${({ gameEditionView }) =>
    gameEditionView ? "0px" : "15px 0px 32px"};
  flex-flow: row;
  width: 100%;
  height: 100%;
  padding: 10px;

  & > *:not(:last-child) {
    margin-right: 15px;
  }

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;

    & > *:not(:last-child) {
      margin-bottom: 15px;
    }
  }
`;

const HeaderContainer = styled.span`
  display: flex;
  width: 100%;
  margin: 0;
  text-align: left;
  padding: 10px;

  font-family: ${({ gameEditionView, theme: { fontFamily } }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold};
  color: ${({ gameEditionView, theme: { colors } }) =>
    gameEditionView ? colors.black : "#FFFFFF"};
  font-size: ${({ gameEditionView }) => (gameEditionView ? "10px" : "16px")};
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
  width: 100%;
  flex-flow: ${({ gameEditionView }) => (gameEditionView ? "row" : "column")};
  margin-bottom: ${({ gameEditionView }) => (gameEditionView ? "8px" : "0px")};
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  font-family: ${({ gameEditionView, theme: { fontFamily } }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold};
  color: ${({ gameEditionView, theme: { colors } }) =>
    gameEditionView ? colors.black : "#FFFFFF"};
  font-size: ${({ gameEditionView }) => (gameEditionView ? "10px" : "16px")};
  text-align: ${({ gameEditionView }) => gameEditionView && "left"};

  text-transform: capitalize;
`;

const Value = styled.span`
  font-family: ${({ gameEditionView, theme: { fontFamily } }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold};
  font-size: ${({ gameEditionView }) => (gameEditionView ? "10px" : "16px")};
  line-height: 20px;
  color: ${({ gameEditionView, theme: { colors } }) =>
    gameEditionView ? colors.black : "#FFFFFF"};
  text-align: ${({ gameEditionView }) => gameEditionView && "left"};
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    margin-bottom: 5px;
  }
`;

const TokenPair = (props) => {
  const { gameEditionView } = useContext(GameEditionContext);
  let { token0, token1, balance, supply, pooledAmount } = props.pair;

  return balance ? (
    <Container gameEditionView={gameEditionView}>
      <HeaderContainer gameEditionView={gameEditionView}>
        {token0} / {token1}
      </HeaderContainer>
      {!gameEditionView ? (
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
      ) : (
        <ResultContainer
          style={{ flexFlow: "column" }}
          gameEditionView={gameEditionView}
        >
          <RowContainer gameEditionView={gameEditionView}>
            <ColumnContainer>
              <Label gameEditionView={gameEditionView}>Your pool tokens:</Label>
              <Value gameEditionView={gameEditionView}>
                {pairUnit(extractDecimal(balance))}
              </Value>
            </ColumnContainer>
            <ColumnContainer>
              <Label gameEditionView={gameEditionView}>Pooled {token0}:</Label>
              <Value gameEditionView={gameEditionView}>
                {pairUnit(extractDecimal(pooledAmount[0]))}
              </Value>
            </ColumnContainer>
          </RowContainer>
          <RowContainer gameEditionView={gameEditionView}>
            <ColumnContainer>
              <Label gameEditionView={gameEditionView}>Pooled {token1}:</Label>
              <Value gameEditionView={gameEditionView}>
                {pairUnit(extractDecimal(pooledAmount[1]))}
              </Value>
            </ColumnContainer>
            <ColumnContainer>
              <Label gameEditionView={gameEditionView}>Your pool share:</Label>
              <Value gameEditionView={gameEditionView}>
                {reduceBalance(
                  (extractDecimal(balance) / extractDecimal(supply)) * 100
                )}
                %
              </Value>
            </ColumnContainer>
          </RowContainer>
        </ResultContainer>
      )}
      {/* <ResultContainer>
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
      </ResultContainer> */}

      <ButtonContainer>
        <Button.Group fluid>
          <CustomButton
            buttonStyle={{
              marginRight: "30px",
              width: "48%",
              height: "40px",
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
              width: "48%",
              height: "40px",
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
