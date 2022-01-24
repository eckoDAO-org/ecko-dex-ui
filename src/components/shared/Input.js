import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';
import { Input as SUIInput } from 'semantic-ui-react';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import Label from './Label';

const Container = styled.div`
  display: flex;
  flex-flow: column;

  width: 100%;

  ${({ gameEditionView, outGameEditionView, noInputBackground, theme: { colors, fontFamily, backgroundInput }, withBorder, color, geColor }) => {
    if (gameEditionView) {
      return css`
        background-color: transparent;
        border: ${withBorder && '2px dashed #ffffff'};
        padding: 8px 14px 0px 30px;
        .ui.input {
          align-items: center;
        }
        .ui.input > input {
          height: 22px;
          padding: 0px;
          font-family: ${outGameEditionView ? fontFamily.regular : fontFamily.pixeboy};
          color: ${geColor ? geColor : outGameEditionView ? colors.white : colors.black} !important;
          font-size: 34px;
        }

        input::placeholder {
          color: ${geColor ? geColor : `${colors.black}99`} !important;
          text-transform: capitalize;
          font-family: ${outGameEditionView ? fontFamily.regular : fontFamily.pixeboy};
          font-size: 34px;
        }
        .ui.labeled.input > .label:not(.corner) {
          font-family: ${fontFamily.pixeboy};
          border: none;
          color: #ffffff !important;
          font-size: 34px;
          padding: 0px;
        }
      `;
    } else {
      return css`
        background-color: ${noInputBackground ? 'transparent' : backgroundInput};
        border: 1px solid ${colors.white}99;
        padding: 10px 10px 0px 10px;
        border-radius: 4px;
        .ui.input > input {
          padding: 10px 2px;
          font-family: ${fontFamily.regular};
          color: ${color ? color : colors.white} !important;
        }
        input::placeholder {
          color: ${colors.white} !important;
          text-transform: capitalize;
          font-family: 14px;
          font-family: ${fontFamily.regular};
        }
        .ui.labeled.input > .label:not(.corner) {
          font-family: ${fontFamily.regular};
          padding-left: 0px;
          padding-right: 0px;
          color: ${colors.white} !important;
        }
      `;
    }
  }}

  /* .ui.icon.input > input {
    padding-right: ${({ inputRightComponent, inputComponentWidth }) => (inputRightComponent ? `${inputComponentWidth + 70}px !important` : 0)};
  } */
  .ui.button:hover .icon {
    opacity: 1;
  }
  .ui.labeled.input > .label:not(.corner) {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background: transparent;
  }
`;

const TopLabelsContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-left: 2px;
  margin-right: 2px;
  span {
    text-transform: capitalize;
  }
`;

const BottomLabelsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 2px;
  margin-right: 2px;
  span {
    text-transform: capitalize;
  }
  margin-bottom: 7px;
`;

const Input = ({
  fluid,
  topLeftLabel,
  topRightLabel,
  bottomLeftLabel,
  bottomRightLabel,
  label,
  containerStyle,
  placeholder,
  size,
  inputRightComponent,
  numberOnly,
  disabled,
  value,
  onChange,
  error,
  type,
  color,
  withBorder,
  maxLength,
  outGameEditionView,
  noInputBackground,
  geColor,
  inputStyle,
}) => {
  const { gameEditionView } = useContext(GameEditionContext);

  return (
    <Container
      gameEditionView={gameEditionView}
      outGameEditionView={outGameEditionView}
      noInputBackground={noInputBackground}
      color={color}
      geColor={geColor}
      withBorder={withBorder}
      style={containerStyle}
    >
      {(topLeftLabel || topRightLabel) && !gameEditionView && (
        <TopLabelsContainer>
          {topLeftLabel && <Label>{topLeftLabel}</Label>}
          {topRightLabel && (
            <Label
              style={{
                marginLeft: !topLeftLabel ? 'auto' : 'unset',
                textAlign: 'end',
              }}
            >
              {topRightLabel}
            </Label>
          )}
        </TopLabelsContainer>
      )}
      <SUIInput
        inverted
        fluid={fluid}
        icon={inputRightComponent}
        placeholder={placeholder}
        size={size}
        disabled={disabled}
        value={value}
        label={label}
        labelPosition="right"
        error={error}
        type={type}
        maxLength={maxLength}
        onChange={(e, props) => {
          if (numberOnly && props.value.match(/[a-zA-Z]/)) return;
          onChange(e, props);
        }}
        style={inputStyle}
      />
      {(bottomLeftLabel || bottomRightLabel) && gameEditionView && (
        <BottomLabelsContainer>
          {bottomLeftLabel && (
            <Label withShade={80} geColor={geColor}>
              {bottomLeftLabel}
            </Label>
          )}
          {bottomRightLabel && <Label>{bottomRightLabel}</Label>}
        </BottomLabelsContainer>
      )}
    </Container>
  );
};

Input.propTypes = {
  fluid: PropTypes.bool,
  topLeftLabel: PropTypes.string,
  topRightLabel: PropTypes.string,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['big', 'huge', 'large', 'massive', 'mini', 'small']),
  inputRightComponent: PropTypes.element,
  withSelectButton: PropTypes.bool,
  numberOnly: PropTypes.bool,
  buttonLabel: PropTypes.string,
};

Input.defaultProps = {
  fluid: true,
  topLeftLabel: '',
  topRightLabel: '',
  placeholder: '',
  size: 'big',
  inputRightComponent: null,
  withSelectButton: false,
  numberOnly: false,
  buttonLabel: 'select ',
};

export default Input;
