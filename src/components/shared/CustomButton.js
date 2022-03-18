/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import styled, { css } from 'styled-components/macro';
import PropTypes from 'prop-types';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import Label from './Label';
import GameEditionButton from '../game-edition-v2/components/GameEditionButton';
import { FlexContainer } from './FlexContainer';
import Loader from './Loader';

const StyledButton = styled(FlexContainer)`
  cursor: pointer;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  margin: 0px;
  padding: 0 16px;
  span {
    opacity: ${({ $loading }) => ($loading ? 0 : 1)};
    white-space: nowrap;
  }
  ${({ type, $outGameEditionView, $gameEditionView, theme: { colors }, buttonBackgroundGradient, $geBasic }) => {
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
            border: 1px solid ${colors.white}99;
            background: transparent;
          `;
        case 'secondary':
          return css`
            height: 42px;
            border: 1px solid ${colors.white}99;
            background: ${colors.white};
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
  withShade,
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
  const { gameEditionView: $gameEditionView } = useContext(GameEditionContext);

  return $gameEditionView && geType ? (
    <GameEditionButton type={geType} disabled={disabled} onClick={onClick} style={geButtonStyle}>
      {geLabel}
    </GameEditionButton>
  ) : (
    <StyledButton
      {...props}
      onClick={() => {
        if (!disabled && onClick) {
          onClick();
        }
      }}
      className={type === 'gradient' ? 'gradient-button' : ''}
      fluid={fluid}
      $gameEditionView={$gameEditionView}
      disabled={disabled}
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

CustomButton.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['primary', 'secondary', 'basic', 'gradient']),
  geType: PropTypes.oneOf(['confirm', 'cancel', 'retry', 'pink']),
  disabled: PropTypes.bool,
};

CustomButton.defaultProps = {
  loading: false,
  type: 'primary',
  disabled: false,
};
