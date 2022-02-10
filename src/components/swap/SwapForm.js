import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components/macro';
import InputToken from '../../components/shared/InputToken';
import { SwapIcon } from '../../assets';
import { limitDecimalPlaces, reduceBalance } from '../../utils/reduceBalance';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { Divider } from 'semantic-ui-react';
import noExponents from '../../utils/noExponents';
import FirstInput from '../../assets/images/game-edition/pixeled-box-yellow.svg';
import SecondInput from '../../assets/images/game-edition/pixeled-box-purple.svg';
import { GeArrowIcon } from '../../assets';
import { PixeledCircleDoubleArrowIcon } from '../../assets';
import Input from '../shared/Input';

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
    left: 48%;
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

const SwapForm = ({ fromValues, setFromValues, toValues, setToValues, fromNote, toNote, setTokenSelectorType, setInputSide, swapValues }) => {
  const { gameEditionView } = useContext(GameEditionContext);
  const [rotation, setRotation] = useState(0);

  return (
    <Container gameEditionView={gameEditionView}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {gameEditionView && <GeArrowIcon style={{ width: 14.65, height: 14.65 }} />}
        <FirstInputContainer gameEditionView={gameEditionView}>
          <Input
            error={isNaN(fromValues.amount)}
            topLeftLabel={fromNote ? `from ${fromNote}` : `from`}
            topRightLabel={`balance: ${reduceBalance(fromValues.balance) ?? '-'}`}
            bottomLeftLabel={`balance: ${reduceBalance(fromValues.balance) ?? '-'}`} //using for gameEdition
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
                    amount: reduceBalance(fromValues.balance),
                  }));
                }}
              />
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
        <Divider horizontal style={{ zIndex: 1 }}>
          <SwapIcon
            id="swap-button"
            style={{ cursor: 'pointer', transform: `rotate(${rotation}deg)`, transition: 'width 0.3s, transform 0.3s' }}
            onClick={() => {
              swapValues();
              setRotation((prev) => prev + 180);
            }}
          />
        </Divider>
      )}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {gameEditionView && <div style={{ width: 14.65, height: 14.65 }} />}

        <SecondInputContainer gameEditionView={gameEditionView}>
          <Input
            error={isNaN(toValues.amount)}
            topLeftLabel={toNote ? `to ${toNote}` : `to`}
            topRightLabel={`balance: ${reduceBalance(toValues.balance) ?? '-'}`}
            bottomLeftLabel={`balance: ${reduceBalance(toValues.balance) ?? '-'}`} //using for gameEdition
            placeholder="0.0"
            geColor="white"
            maxLength="15"
            numberOnly
            inputRightComponent={
              <InputToken
                geColor="white"
                values={toValues}
                disabledButton={!toValues.balance}
                onClick={() => {
                  setTokenSelectorType('to');
                }}
                onMaxClickButton={() => {
                  setInputSide('to');
                  setToValues((prev) => ({
                    ...prev,
                    amount: reduceBalance(toValues.balance),
                  }));
                }}
              />
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
