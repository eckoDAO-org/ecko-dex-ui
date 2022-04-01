import React from 'react';
import styled from 'styled-components';
import ButtonDivider from '../../shared/ButtonDivider';
import Input from '../../shared/Input';
import InputToken from '../../shared/InputToken';
import { SwapArrowsIcon } from '../../assets';
import { limitDecimalPlaces, reduceBalance } from '../../utils/reduceBalance';
import tokenData from '../../constants/cryptoCurrencies';

const FormContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: row;
  padding: 20px 20px;
  width: 100%;
  border-radius: 10px;
  border: 2px solid #ffffff;
  box-shadow: 0 0 5px #ffffff;
  opacity: 1;
  background: transparent;

  & > *:not(:last-child) {
    margin-right: 32px;
  }

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
        topLeftLabel={fromNote ? `from ${fromNote}` : `input`}
        bottomLeftLabel={`balance: ${reduceBalance(fromValues.balance) ?? '-'}`}
        placeholder='enter amount'
        maxLength='15'
        inputRightComponent={
          fromValues.coin ? (
            <InputToken
              icon={tokenData[fromValues.coin].icon}
              code={tokenData[fromValues.coin].name}
              onClick={() => setTokenSelectorType('from')}
              onClickButton={() => {
                setInputSide('from');
                setFromValues((prev) => ({
                  ...prev,
                  amount: reduceBalance(fromValues.balance),
                }));
              }}
              disabledButton={toValues.amount === toValues.balance}
            />
          ) : null
        }
        withSelectButton
        numberOnly
        value={fromValues.amount}
        onSelectButtonClick={() => setTokenSelectorType('from')}
        onChange={async (e, { value }) => {
          setInputSide('from');
          setFromValues((prev) => ({
            ...prev,
            amount: limitDecimalPlaces(value, fromValues.precision),
          }));
        }}
      />
      <ButtonDivider icon={<SwapArrowsIcon />} onClick={swapValues} />
      <Input
        error={isNaN(toValues.amount)}
        topLeftLabel={toNote ? `to ${toNote}` : `input`}
        bottomLeftLabel={`balance: ${reduceBalance(toValues.balance) ?? '-'}`}
        placeholder='enter amount'
        maxLength='15'
        inputRightComponent={
          toValues.coin ? (
            <InputToken
              icon={tokenData[toValues.coin].icon}
              code={tokenData[toValues.coin].name}
              onClick={() => setTokenSelectorType('to')}
              onClickButton={() => {
                setInputSide('to');
                setToValues((prev) => ({
                  ...prev,
                  amount: reduceBalance(toValues.balance),
                }));
              }}
              disabledButton={fromValues.amount === fromValues.balance}
            />
          ) : null
        }
        withSelectButton
        numberOnly
        value={toValues.amount}
        onSelectButtonClick={() => setTokenSelectorType('to')}
        onChange={async (e, { value }) => {
          setInputSide('to');
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
