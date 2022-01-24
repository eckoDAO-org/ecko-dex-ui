import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components/macro';
import Input from '../../components/shared/Input';
import InputToken from '../../components/shared/InputToken';
import { ArrowDown, PixeledArrowDownIcon, SwapIcon } from '../../assets';
import { limitDecimalPlaces, reduceBalance } from '../../utils/reduceBalance';
import tokenData from '../../constants/cryptoCurrencies';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { Divider } from 'semantic-ui-react';
import useWindowSize from '../../hooks/useWindowSize';
import { commonColors, theme } from '../../styles/theme';
import noExponents from '../../utils/noExponents';
import FirstInput from '../../assets/images/game-edition/pixeled-box-yellow.svg';
import SecondInput from '../../assets/images/game-edition/pixeled-box-purple.svg';
import { GeArrowIcon } from '../../assets';
import { PixeledCircleArrowIcon } from '../../assets';
import CustomButton from '../shared/CustomButton';
import { useGameEditionContext } from '../../contexts';
import CustomInput from '../shared/CustomInput';

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
          <CustomInput
            error={isNaN(fromValues.amount)}
            topLeftLabel={fromNote ? `from ${fromNote}` : `from`}
            topRightLabel={`balance: ${reduceBalance(fromValues.balance) ?? '-'}`}
            bottomLeftLabel={`balance: ${reduceBalance(fromValues.balance) ?? '-'}`} //using for gameEdition
            geColor="black"
            placeholder="0.0"
            maxLength="15"
            size={width <= theme().mediaQueries.mobilePixel && gameEditionView ? 'medium' : 'large'}
            containerStyle={{ minHeight: 60 }}
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
          <CustomInput
            error={isNaN(toValues.amount)}
            topLeftLabel={toNote ? `to ${toNote}` : `to`}
            topRightLabel={`balance: ${reduceBalance(toValues.balance) ?? '-'}`}
            bottomLeftLabel={`balance: ${reduceBalance(toValues.balance) ?? '-'}`} //using for gameEdition
            placeholder="0.0"
            geColor="white"
            size={width <= theme().mediaQueries.mobilePixel && gameEditionView ? 'medium' : 'large'}
            maxLength="15"
            containerStyle={{ minHeight: 60 }}
            numberOnly
            // inputRightComponent={
            //   <InputRightComponent
            //     values={toValues}
            //     setTokenSelectorType={setTokenSelectorType}
            //     setInputSide={setInputSide}
            //     side="to"
            //     setValues={setFromValues}
            //     geColor="white"
            //   />
            // }
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
                  setFromValues((prev) => ({
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

// const InputRightComponent = ({ values, setTokenSelectorType, setInputSide, setValues, side, geColor }) => {
//   const { gameEditionView } = useGameEditionContext();
//   return values.coin ? (
//     <InputToken
//       geColor={geColor}
//       icon={tokenData[values.coin].icon}
//       code={tokenData[values.coin].name}
//       onClick={() => {
//         setTokenSelectorType(side);
//       }}
//       onMaxClickButton={() => {
//         setInputSide(side);
//         setValues((prev) => ({
//           ...prev,
//           amount: reduceBalance(values.balance),
//         }));
//       }}
//       disabledButton={!values.balance}
//     />
//   ) : (
//     <CustomButton
//       type="basic"
//       geBasic
//       onClick={() => setTokenSelectorType(side)}
//       buttonStyle={{
//         padding: 0,
//       }}
//     >
//       Select
//       {gameEditionView ? <PixeledArrowDownIcon /> : <ArrowDown style={{ marginRight: 0, marginLeft: 8 }} />}
//     </CustomButton>
//   );
// };

export default SwapForm;
