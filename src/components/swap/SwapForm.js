import React from "react";
import styled from "styled-components";
import ButtonDivider from "../../shared/ButtonDivider";
import Input from "../../shared/Input";
import InputToken from "../../shared/InputToken";
import { SwapArrowsIcon } from "../../assets";
import { limitDecimalPlaces, reduceBalance } from "../../utils/reduceBalance";

const FormContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: row;
  gap: 32px;
  padding: 20px 20px;
  width: 100%;
  border-radius: 10px;
  border: 2px solid #ffffff;
  box-shadow: 0 0 5px #ffffff;
  opacity: 1;
  background: transparent;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
    gap: 0px;
  }
`;

const SwapForm = ({
  fromValues,
  setFromValues,
  toValues,
  setToValues,
  fromNote,
  toNote,
  setTokenSelectorType,
  setInputSide,
  swapValues,
}) => {
  return (
    <FormContainer>
      <Input
        error={isNaN(fromValues.amount)}
        topLeftLabel={`from ${fromNote}`}
        bottomLeftLabel={`balance: ${reduceBalance(fromValues.balance) ?? "-"}`}
        placeholder="enter amount"
        inputRightComponent={
          fromValues.coin ? (
            <InputToken
              icon={
                []
                // pact.tokenData[fromValues.coin].icon
              }
              code={
                []
                // pact.tokenData[fromValues.coin].name
              }
              onClick={() => setTokenSelectorType("from")}
            />
          ) : null
        }
        withSelectButton
        numberOnly
        value={fromValues.amount}
        onSelectButtonClick={() => setTokenSelectorType("from")}
        onChange={async (e, { value }) => {
          setInputSide("from");
          setFromValues((prev) => ({
            ...prev,
            amount: limitDecimalPlaces(value, fromValues.precision),
          }));
        }}
      />
      <ButtonDivider icon={<SwapArrowsIcon />} onClick={swapValues} />
      <Input
        error={isNaN(toValues.amount)}
        topLeftLabel={`to ${toNote}`}
        bottomLeftLabel={`balance: ${reduceBalance(toValues.balance) ?? "-"}`}
        placeholder="enter amount"
        inputRightComponent={
          toValues.coin ? (
            <InputToken
              icon={
                []
                // pact.tokenData[toValues.coin].icon
              }
              code={
                []
                // pact.tokenData[toValues.coin].name
              }
              onClick={() => setTokenSelectorType("to")}
            />
          ) : null
        }
        withSelectButton
        numberOnly
        value={toValues.amount}
        onSelectButtonClick={() => setTokenSelectorType("to")}
        onChange={async (e, { value }) => {
          setInputSide("to");
          setToValues((prev) => ({
            ...prev,
            amount: limitDecimalPlaces(value, toValues.precision),
          }));
        }}
      />
    </FormContainer>
  );
};

export default SwapForm;
