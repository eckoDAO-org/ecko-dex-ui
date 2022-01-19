/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import styled, { css } from 'styled-components/macro';
import { Button as SUIButton } from 'semantic-ui-react';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import Label from './Label';

const StyledButton = styled(SUIButton)`
  cursor: pointer;
  display: flex !important;
  justify-content: center;
  align-items: center;

  background: ${({ theme: { buttonBackgroundGradient }, disabled, background, $gameEditionView, $outGameEditionView }) => {
    if ($outGameEditionView) return buttonBackgroundGradient + '!important';
    if (background) return background + ' !important';
    if ($gameEditionView) return 'transparent !important';
    if (disabled) return 'transparent !important';
    return buttonBackgroundGradient + '!important';
  }};
  border-radius: ${({ $borderRadius }) => ($borderRadius ? `${$borderRadius}px !important` : '10px !important')};
  opacity: 1 !important;
  border: ${({ theme: { colors }, $border, $gameEditionView, $outGameEditionView }) => {
    if ($outGameEditionView) return `1px solid ${colors.white} !important`;
    if ($border) return $border + ' !important';
    if ($gameEditionView) return `unset`;
    else return `1px solid ${colors.white} !important`;
  }};
  ${({ $disableGameEditionPadding, gameEditionView }) =>
    $disableGameEditionPadding &&
    gameEditionView &&
    css`
      padding: 0px !important;
    `};
  svg {
    margin-right: 4px;
    /* path {
      fill: ${({ theme: { colors } }) => colors.white};
    } */
  }
`;

const CustomButton = ({
  props,
  disabled,
  border,
  boxShadow: $boxShadow,
  buttonStyle,
  background,
  color,
  label,
  fontFamily = 'bold',
  fontSize,
  labelStyle,
  geFontSize = 20,
  geFontWeight,
  geLabelStyle,
  geColor,
  withShade,
  geCenter,
  children,
  onClick,
  loading,
  fluid,
  borderRadius,
  disableGameEditionPadding,
  outGameEditionView: $outGameEditionView,
}) => {
  const { gameEditionView: $gameEditionView } = useContext(GameEditionContext);
  return (
    <StyledButton
      {...props}
      fluid={fluid}
      $borderRadius={borderRadius}
      $gameEditionView={$gameEditionView}
      $outGameEditionView={$outGameEditionView}
      disabled={disabled}
      background={background}
      style={buttonStyle}
      onClick={onClick}
      loading={loading}
      $border={border}
      $boxShadow={$boxShadow}
      $disableGameEditionPadding={disableGameEditionPadding}
    >
      <Label
        fontFamily={fontFamily}
        fontSize={fontSize}
        labelStyle={labelStyle}
        geFontSize={geFontSize}
        geFontWeight={geFontWeight}
        geLabelStyle={geLabelStyle}
        geColor={geColor}
        color={color}
        inverted={!disabled}
        withShade={withShade}
        geCenter={geCenter}
      >
        {children || label}
      </Label>
    </StyledButton>
  );
};

export default CustomButton;
