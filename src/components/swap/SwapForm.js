import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components/macro';
import Input from '../../components/shared/Input';
import InputToken from '../../components/shared/InputToken';
import { SwapIcon } from '../../assets';
import { limitDecimalPlaces, reduceBalance } from '../../utils/reduceBalance';
import tokenData from '../../constants/cryptoCurrencies';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { Divider } from 'semantic-ui-react';
import useWindowSize from '../../hooks/useWindowSize';
import { theme } from '../../styles/theme';
import noExponents from '../../utils/noExponents';
import FirstInput from '../../assets/images/game-edition/pixeled-box-yellow.svg';
import SecondInput from '../../assets/images/game-edition/pixeled-box-purple.svg';
import { GeArrowIcon } from '../../assets';
import { PixeledCircleArrowIcon } from '../../assets';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;
  ${({ gameEditionView }) =>
    !gameEditionView &&
    css`
      svg {
        path {
          fill: ${({ theme: { colors } }) => colors.white};
        }
      }
    `}
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

const PixeledCircleArrowContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -41%);
`;

const SwapForm = ({ fromValues, setFromValues, toValues, setToValues, fromNote, toNote, setTokenSelectorType, setInputSide, swapValues }) => {
  const { gameEditionView } = useContext(GameEditionContext);
  const [rotation, setRotation] = useState(0);

  const [width] = useWindowSize();

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
            placeholder="0.0"
            maxLength="15"
            size={width <= theme().mediaQueries.mobilePixel && gameEditionView ? 'medium' : 'large'}
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
                  disabledButton={!fromValues.balance}
                />
              ) : null
            }
            withSelectButton
            numberOnly
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
        <PixeledCircleArrowContainer>
          <PixeledCircleArrowIcon
            onClick={() => {
              swapValues();
            }}
          />
        </PixeledCircleArrowContainer>
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
            size={width <= theme().mediaQueries.mobilePixel && gameEditionView ? 'medium' : 'large'}
            maxLength="15"
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
