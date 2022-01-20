/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import styled, { css } from 'styled-components/macro';
import { Button as SUIButton } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import Label from './Label';

const StyledButton = styled(SUIButton)`
  cursor: pointer;
  display: flex !important;
  justify-content: center;
  align-items: center;
  border-radius: 10px !important;
  ${({ type, $outGameEditionView, $gameEditionView, theme: { colors }, buttonBackgroundGradient, hideBorder }) => {
    if ($gameEditionView && !$outGameEditionView) {
      return css`
        border: 2px dashed #ffffff !important;
        border-radius: 0px !important;
        padding: 10px !important;
        background: transparent !important;
      `;
    } else {
      switch (type) {
        case 'primary':
          return css`
          height: 42px;
        border: 1px solid ${colors.white}99 !important};
        background: transparent !important;
      `;
        case 'secondary':
          return css`
          height: 42px;
        border: 1px solid ${colors.white}99 !important};
        background: ${colors.white} !important;
      `;
        case 'basic':
          return css`
          height: 42px;
        border: 1px solid transparent !important};
        background: transparent !important;
      `;
        default:
          return css`
            height: 42px;
            border: ${({ hideBorder }) => !hideBorder && `1px solid ${colors.white} !important`};
            background: ${buttonBackgroundGradient} !important;
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
  type,
  outGameEditionView,
}) => {
  const { gameEditionView: $gameEditionView } = useContext(GameEditionContext);

  return (
    <StyledButton
      {...props}
      fluid={fluid}
      $gameEditionView={$gameEditionView}
      disabled={disabled}
      style={buttonStyle}
      onClick={onClick}
      loading={loading}
      type={type}
      $outGameEditionView={outGameEditionView}
    >
      <Label
        fontFamily={fontFamily}
        fontSize={fontSize}
        labelStyle={labelStyle}
        geFontSize={geFontSize}
        geFontWeight={geFontWeight}
        geLabelStyle={geLabelStyle}
        geColor={geColor}
        // color={color}
        outGameEditionView={outGameEditionView}
        inverted={type === 'secondary'}
        withShade={withShade || disabled}
        geCenter={geCenter}
      >
        {children || label}
      </Label>
    </StyledButton>
  );
};

export default CustomButton;

CustomButton.propTypes = {
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['primary', 'secondary', 'basic']),
  disabled: PropTypes.bool,
};

CustomButton.defaultProps = {
  type: 'primary',
  disabled: false,
};
