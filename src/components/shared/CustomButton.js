/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled, { css } from 'styled-components/macro';
import PropTypes from 'prop-types';
import { useGameEditionContext } from '../../contexts';
import Label from './Label';
import GameEditionButton from '../game-edition-v2/components/GameEditionButton';
import { FlexContainer } from './FlexContainer';
import Loader from './Loader';

const StyledButton = styled(FlexContainer)`
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  width: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  margin: 0px;
  padding: 0 16px;
  span {
    opacity: ${({ $loading }) => ($loading ? 0 : 1)};
    white-space: nowrap;
  }
  ${({ type, $outGameEditionView, $gameEditionView, theme: { colors }, color, buttonBackgroundGradient, disabled, borderOpacity, $geBasic }) => {
    if ($gameEditionView && !$outGameEditionView) {
      return css`
        border: ${$geBasic ? 'none' : '2px dashed #ffffff'};
        padding: ${$geBasic ? '0px' : '10px'};
        border-radius: 0px;
        min-height: 38px;
        background: ${({ $background }) => $background || 'transparent'};
      `;
    } else {
      switch (type) {
        case 'gradient':
          return css`
            height: 42px;
          `;
        case 'primary':
          return css`
            height: 42px;
            border: 1px solid ${color || `${colors.white}${disabled || borderOpacity ? '99' : ''}`};
            background: transparent;
          `;
        case 'primary-light':
          return css`
            height: 42px;
            border: 1px solid ${color || `${colors.white}${disabled || borderOpacity ? '66' : ''}`};
            background: transparent;
          `;
        case 'secondary':
          return css`
            height: 42px;
            background: ${color || `${colors.white}${disabled ? '66' : ''}`};
          `;
        case 'basic':
          return css`
            height: 42px;
            border: 1px solid transparent;
            background: transparent;
          `;
        default:
          return css`
            height: 42px;
            border: ${({ hideBorder }) => !hideBorder && `1px solid ${colors.white}`};
            background: ${buttonBackgroundGradient};
          `;
      }
    }
  }}
  svg {
    margin-right: 4px;
  }
`;

const CustomButton = ({
  props,
  disabled,
  buttonStyle,
  label,
  fontFamily = 'syncopate',
  fontSize,
  labelStyle,
  geFontSize = 20,
  geFontWeight,
  geLabelStyle,
  geColor,
  color,
  withShade,
  borderOpacity,
  geCenter,
  children,
  onClick,
  loading,
  fluid,
  type,
  geType,
  geLabel,
  outGameEditionView,
  background,
  geBasic,
  geButtonStyle,
}) => {
  const { gameEditionView: $gameEditionView } = useGameEditionContext();

  return $gameEditionView && geType ? (
    <GameEditionButton type={geType} disabled={disabled} onClick={onClick} style={geButtonStyle}>
      {geLabel}
    </GameEditionButton>
  ) : (
    <StyledButton
      {...props}
      onClick={() => {
        if (!disabled && !loading && onClick) {
          onClick();
        }
      }}
      color={color}
      className={type === 'gradient' ? 'gradient-button relative' : ''}
      fluid={fluid}
      $gameEditionView={$gameEditionView}
      disabled={disabled}
      borderOpacity={borderOpacity}
      style={buttonStyle}
      $loading={loading}
      type={type}
      $geBasic={geBasic}
      $outGameEditionView={outGameEditionView}
      $background={background}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          {typeof children === 'string' || typeof label === 'string' ? (
            <Label
              className={`uppercase ${type === 'gradient' ? 'gradient' : ''}`}
              fontFamily={fontFamily}
              fontSize={fontSize}
              labelStyle={{ lineHeight: 1, ...labelStyle }}
              geFontSize={geFontSize}
              geFontWeight={geFontWeight}
              geLabelStyle={geLabelStyle}
              geColor={geColor}
              outGameEditionView={outGameEditionView}
              inverted={type === 'secondary'}
              withShade={withShade || disabled}
              geCenter={geCenter}
            >
              {children || label}
            </Label>
          ) : (
            children
          )}
        </>
      )}
    </StyledButton>
  );
};

export default CustomButton;