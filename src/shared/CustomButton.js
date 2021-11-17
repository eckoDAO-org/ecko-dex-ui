/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { Button as SUIButton } from 'semantic-ui-react';
import { GameEditionContext } from '../contexts/GameEditionContext';
import theme from '../styles/theme';

const StyledButton = styled(SUIButton)`
  cursor: pointer;
  font-family: ${({
    theme: { fontFamily },
    gameEditionView,
    outGameEditionView,
  }) => {
    if (outGameEditionView) return fontFamily.bold + '!important';
    if (gameEditionView) return fontFamily.pressStartRegular + '!important';
    else return fontFamily.bold + '!important';
  }};
  font-size: ${({ fontSize }) =>
    fontSize ? fontSize + ' !important' : '16px !important'};
  color: ${({
    disabled,
    color,
    gameEditionView,
    outGameEditionView,
    theme: { colors },
  }) => {
    if (color) return color + ' !important';
    if (outGameEditionView) return `${colors.primary} !important`;
    if (gameEditionView) return `${theme.colors.black} !important`;
    if (disabled) return `${colors.white} !important`;
    else return `${colors.primary} !important`;
  }};
  background: ${({
    disabled,
    background,
    gameEditionView,
    outGameEditionView,
    theme: { buttonBackgroundGradient },
  }) => {
    if (outGameEditionView) return buttonBackgroundGradient + '!important';
    if (background) return background + ' !important';
    if (gameEditionView) return 'transparent !important';
    if (disabled) return 'transparent !important';
    return buttonBackgroundGradient + '!important';
  }};
  border-radius: 10px !important;
  opacity: 1 !important;
  border: ${({
    border,
    gameEditionView,
    outGameEditionView,
    theme: { colors },
  }) => {
    if (outGameEditionView) return `1px solid ${colors.white} !important`;
    if (border) return border + ' !important';
    if (gameEditionView) return `2px dashed ${colors.black} !important`;
    else return `1px solid ${colors.white} !important`;
  }};
  /* box-shadow: ${({ boxShadow, gameEditionView }) => {
    if (boxShadow) return boxShadow + ' !important';
    else if (gameEditionView) return `none !important`;
    else return '0 0 4px #FFFFFF !important';
  }}; */

  /* box-shadow: 0 0 4px #FFFFFF !important; */
  /* :hover {
    opacity: ${({ hover }) => (hover ? 0.7 : 1.0) + ' !important'};
  } */
`;

const CustomButton = ({
  props,
  disabled,
  border,
  boxShadow,
  buttonStyle,
  background,
  color,
  label,
  fontSize,
  children,
  onClick,
  loading,
  hover,
  outGameEditionView,
}) => {
  const { gameEditionView } = useContext(GameEditionContext);
  return (
    <StyledButton
      {...props}
      gameEditionView={gameEditionView}
      outGameEditionView={outGameEditionView}
      disabled={disabled}
      background={background}
      color={color}
      fontSize={fontSize}
      style={buttonStyle}
      onClick={onClick}
      loading={loading}
      border={border}
      boxShadow={boxShadow}
      hover={hover}
    >
      {children || label}
    </StyledButton>
  );
};

export default CustomButton;
