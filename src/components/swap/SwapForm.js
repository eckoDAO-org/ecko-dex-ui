import React, { useContext } from 'react';
import styled from 'styled-components';
import ButtonDivider from '../../shared/ButtonDivider';
import Input from '../../shared/Input';
import InputToken from '../../shared/InputToken';
import { SwapArrowsIcon, SwapIcon } from '../../assets';
import { limitDecimalPlaces, reduceBalance } from '../../utils/reduceBalance';
import tokenData from '../../constants/cryptoCurrencies';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { Divider } from 'semantic-ui-react';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  position: ${({ gameEditionView }) =>
    gameEditionView && 'absolute !important'};
  bottom: ${({ gameEditionView }) => gameEditionView && '50px !important'};
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
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
  const { gameEditionView } = useContext(GameEditionContext);
  return (
    <Container>
      <Input
        error={isNaN(fromValues.amount)}
        topLeftLabel={fromNote ? `from ${fromNote}` : `from`}
        topRightLabel={`balance: ${reduceBalance(fromValues.balance) ?? '-'}`}
        placeholder='enter amount'
        maxLength='15'
        size='big'
        inputRightComponent={
          fromValues.coin ? (
            <InputToken
              icon={tokenData[fromValues.coin].icon}
              code={tokenData[fromValues.coin].name}
              onClick={() => {
                setTokenSelectorType('from');
              }}
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
        onSelectButtonClick={() => {
          setTokenSelectorType('from');
        }}
        onChange={async (e, { value }) => {
          setInputSide('from');
          setFromValues((prev) => ({
            ...prev,
            amount: limitDecimalPlaces(value, fromValues.precision),
          }));
        }}
      />
      {gameEditionView ? null : (
        <Divider horizontal style={{ zIndex: 1 }}>
          <SwapIcon style={{ cursor: 'pointer' }} onClick={swapValues} />
        </Divider>
      )}
      <Input
        error={isNaN(toValues.amount)}
        topLeftLabel={toNote ? `to ${toNote}` : `to`}
        topRightLabel={`balance: ${reduceBalance(toValues.balance) ?? '-'}`}
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
                  amount: toValues.balance,
                }));
              }}
              disabledButton={fromValues.amount === fromValues.balance}
            />
          ) : null
        }
        withSelectButton
        numberOnly
        value={toValues.amount}
        onSelectButtonClick={() => {
          setTokenSelectorType('to');
        }}
        onChange={async (e, { value }) => {
          setInputSide('to');
          setToValues((prev) => ({
            ...prev,
            amount: limitDecimalPlaces(value, toValues.precision),
          }));
        }}
      />
    </Container>
  );
};

export default SwapForm;
