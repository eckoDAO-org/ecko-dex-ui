/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { Button as SUIButton } from 'semantic-ui-react';
import { GameEditionContext } from '../contexts/GameEditionContext';
import theme from '../styles/theme';

const StyledButton = styled(SUIButton)`
  cursor: pointer;
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView
      ? fontFamily.pressStartRegular
      : fontFamily.bold} !important;
  font-size: ${({ fontSize }) =>
    fontSize ? fontSize + ' !important' : '16px !important'};
  color: ${({ color, gameEditionView }) => {
    if (color) return color + ' !important';
    else if (gameEditionView) return `${theme.colors.black} !important`;
    else return '#ffffff !important';
  }};
  background: ${({
    disabled,
    background,
    theme: { buttonBackgroundGradient },
  }) => {
    if (background) return background + ' !important';
    if (disabled) return 'transparent !important';
    return buttonBackgroundGradient + '!important';
  }};
  border-radius: 10px !important;
  opacity: 1 !important;
  border: ${({ border, gameEditionView }) => {
    if (border) return border + ' !important';
    else if (gameEditionView) return `2px dashed #000000 !important`;
    else return '1px solid #FFFFFF !important';
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
}) => {
  const { gameEditionView } = useContext(GameEditionContext);
  return (
    <StyledButton
      {...props}
      gameEditionView={gameEditionView}
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
