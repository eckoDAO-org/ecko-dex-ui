import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';
import { useApplicationContext, useGameEditionContext, usePactContext } from '../../contexts';
import InputToken from '../../components/shared/InputToken';
import { SwapIcon } from '../../assets';
import { extractDecimal, getDecimalPlaces, humanReadableNumber, limitDecimalPlaces } from '../../utils/reduceBalance';
import noExponents from '../../utils/noExponents';
import FirstInput from '../../assets/images/game-edition/pixeled-box-yellow.svg';
import SecondInput from '../../assets/images/game-edition/pixeled-box-purple.svg';
import { GeArrowIcon } from '../../assets';
import { PixeledCircleDoubleArrowIcon } from '../../assets';
import Input from '../shared/Input';
import CustomDivider from '../shared/CustomDivider';
import { theme } from '../../styles/theme';
import Label from '../shared/Label';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;
  ${({ gameEditionView }) => {
    if (gameEditionView) {
      return css`
        padding: 0 16px;
      `;
    } else {
      return css`
        svg {
          path {
            fill: ${({ theme: { colors } }) => colors.white};
          }
        }
      `;
    }
  }}

  .pixeled-circle-arrow {
    height: 40px;
    width: 40px;
    position: absolute;
    top: 37%;
    left: 46%;
    cursor: pointer;
  }
`;
const FirstInputContainer = styled.div`
  width: 100%;
  ${({ gameEditionView }) => {
    if (gameEditionView) {
      return css`
        margin-left: 14px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        background-image: ${`url(${FirstInput})`};
      `;
    }
  }}
`;

const SecondInputContainer = styled.div`
  width: 100%;
  ${({ gameEditionView }) => {
    if (gameEditionView) {
      return css`
        margin-left: 14px;
        margin-top: 12px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        background-image: ${`url(${SecondInput})`};
      `;
    }
  }}
`;

const SwapForm = ({
  label,
  fromValues,
  setFromValues,
  toValues,
  setToValues,
  fromNote,
  toNote,
  setTokenSelectorType,
  setInputSide,
  swapValues,
  balanceLoading,
}) => {
  const { themeMode } = useApplicationContext();
  const { tokensUsdPrice } = usePactContext();
  const { gameEditionView } = useGameEditionContext();
  const [rotation, setRotation] = useState(0);

  return (
    <Container gameEditionView={gameEditionView}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {gameEditionView && <GeArrowIcon style={{ width: 14.65, height: 14.65 }} />}
        <FirstInputContainer gameEditionView={gameEditionView}>
          <Input
            error={isNaN(fromValues.amount)}
            topLeftLabel={label ? label : fromNote ? `GIVE ${fromNote}` : `GIVE`}
            topRightLabel={`balance: ${getDecimalPlaces(fromValues.balance) ?? '-'}`}
            bottomLeftLabel={`balance: ${getDecimalPlaces(fromValues.balance) ?? '-'}`} //using for gameEdition
            geColor="black"
            placeholder="0.0"
            maxLength="15"
            numberOnly
            inputRightComponent={
              <InputToken
                geColor="black"
                values={fromValues}
                disabledButton={!fromValues.balance}
                onClick={() => {
                  setTokenSelectorType('from');
                }}
                onMaxClickButton={() => {
                  setInputSide('from');
                  setFromValues((prev) => ({
                    ...prev,
                    amount: extractDecimal(fromValues.balance),
                  }));
                }}
              />
            }
            bottomContent={
              fromValues.amount &&
              !gameEditionView &&
              Number(fromValues.amount) !== 0 && (
                <Label labelStyle={{ margin: '-10px 0px 10px 2px', opacity: 0.7 }}>
                  $ {humanReadableNumber(extractDecimal(tokensUsdPrice?.[fromValues.address]) * extractDecimal(fromValues.amount))}
                </Label>
              )
            }
            value={noExponents(fromValues.amount)}
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
        </FirstInputContainer>
      </div>
      {gameEditionView ? (
        <PixeledCircleDoubleArrowIcon
          className="pixeled-circle-arrow"
          style={{ transform: `rotate(${rotation}deg)`, transition: 'width 0.3s, transform 0.3s' }}
          onClick={() => {
            swapValues();
            setRotation((prev) => prev - 180);
          }}
        />
      ) : (
        <div className="relative flex justify-ce align-ce" style={{ marginTop: 12, marginBottom: 12 }}>
          <CustomDivider className="absolute" style={{ zIndex: 1 }} />
          <SwapIcon
            id="swap-button"
            style={{
              cursor: 'pointer',
              transform: `rotate(${rotation}deg)`,
              transition: 'width 0.5s, transform 0.5s',
              zIndex: 2,
              borderRadius: '50%',
              backgroundColor: theme(themeMode).backgroundContainer,
            }}
            onClick={() => {
              fromValues.balance !== '' && toValues.balance !== '' && !balanceLoading && setTimeout(() => swapValues(), 250);
              fromValues.balance !== '' && toValues.balance !== '' && !balanceLoading && setRotation((prev) => prev + 180);
            }}
          />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {gameEditionView && <div style={{ width: 14.65, height: 14.65 }} />}

        <SecondInputContainer gameEditionView={gameEditionView}>
          <Input
            error={isNaN(toValues.amount)}
            topLeftLabel={label ? label : toNote ? `RECEIVE ${toNote}` : `RECEIVE`}
            topRightLabel={`balance: ${getDecimalPlaces(toValues.balance) ?? '-'}`}
            bottomLeftLabel={`balance: ${getDecimalPlaces(toValues.balance) ?? '-'}`} //using for gameEdition
            placeholder="0.0"
            geColor="white"
            maxLength="15"
            numberOnly
            inputRightComponent={
              <InputToken
                withoutMAX
                geColor="white"
                values={toValues}
                disabledButton={!toValues.balance}
                onClick={() => {
                  setTokenSelectorType('to');
                }}
              />
            }
            bottomContent={
              toValues.amount &&
              !gameEditionView &&
              Number(toValues.amount) !== 0 && (
                <Label labelStyle={{ margin: '-10px 0px 10px 2px', opacity: 0.7 }}>
                  $ {humanReadableNumber(extractDecimal(tokensUsdPrice?.[toValues.address]) * extractDecimal(toValues.amount))}
                </Label>
              )
            }
            value={noExponents(toValues.amount)}
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
        </SecondInputContainer>
      </div>
    </Container>
  );
};

export default SwapForm;
