import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';
import { ArrowDown, PixeledArrowDownIcon } from '../../assets';
import CustomButton from './CustomButton';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import tokenData from '../../constants/cryptoCurrencies';
import Label from './Label';

const Container = styled.div`
  ${({ $gameEditionView }) => {
    if ($gameEditionView) {
      return css`
        position: absolute;
        right: 26px;
        top: 4px;
      `;
    }
  }}
  display: flex;
  align-items: center;
  cursor: pointer;

  min-width: ${({ theme: { inputTokenWidth } }) => `${inputTokenWidth}px`};
  svg {
    path {
      fill: ${({ $gameEditionView, theme: { colors }, geColor }) => {
        if ($gameEditionView && geColor) return geColor;
        if (!$gameEditionView) return colors.white;
      }};
    }
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
    top: ${({ $gameEditionView }) => $gameEditionView && '0px'};
  }
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobileSmallPixel}px`}) {
    button {
      padding: 12px 4px !important;
    }
  }
`;

const ElementsContainer = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 6px;
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
  /* span {
    font-size: 16px;
    margin-right: 13px;
    font: ${({ $gameEditionView, theme: { fontFamily } }) => {
    if ($gameEditionView) return `normal normal normal 29px ${fontFamily.pixeboy}`;
  }};
    color: ${({ $gameEditionView, theme: { colors }, geColor }) => {
    if ($gameEditionView && geColor) return geColor;
    if ($gameEditionView) return colors.black;
    return colors.white;
  }};
  } */

  /* @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
    span {
      font-size: 16px;
      margin-right: 13px;
      font: ${({ $gameEditionView, theme: { fontFamily } }) => {
    if ($gameEditionView) return `normal normal normal 13px ${fontFamily.pixeboy}`;
  }};
      color: ${({ $gameEditionView, theme: { colors } }) => ($gameEditionView ? colors.black : colors.white)};
    }
  } */

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobileSmallPixel}px`}) {
    img {
      margin-right: 4px !important;
    }
    span {
      margin-right: 4px;
    }
  }
`;

const InputToken = ({ values, disabledButton, onClick, onMaxClickButton, geColor }) => {
  const { gameEditionView } = useContext(GameEditionContext);
  return (
    <Container $gameEditionView={gameEditionView} geColor={geColor}>
      {values?.coin ? (
        <>
          {!gameEditionView && (
            <CustomButton
              buttonStyle={{
                padding: '12px 8px',
              }}
              labelStyle={{ textTransform: 'uppercase' }}
              type="basic"
              fontSize={13}
              onClick={onMaxClickButton}
              disabled={disabledButton}
            >
              Max
            </CustomButton>
          )}
          <ElementsContainer $gameEditionView={gameEditionView} geColor={geColor} onClick={onClick}>
            {tokenData[values.coin].icon}
            <Label geFontSize={29} geColor={geColor}>
              {tokenData[values.coin].name}
            </Label>
          </ElementsContainer>
          {gameEditionView ? <PixeledArrowDownIcon /> : <ArrowDown />}
        </>
      ) : (
        <>
          <CustomButton
            type="basic"
            geBasic
            geColor={geColor}
            onClick={onClick}
            buttonStyle={{
              padding: 0,
              marginRight: gameEditionView && 10,
            }}
          >
            Select
          </CustomButton>
          {gameEditionView ? <PixeledArrowDownIcon /> : <ArrowDown style={{ marginRight: 0, marginLeft: 8 }} />}
        </>
      )}
    </Container>
  );
};

InputToken.propTypes = {
  icon: PropTypes.element,
  code: PropTypes.string,
};

InputToken.defaultProps = {
  icon: null,
  code: '',
};

export default InputToken;
