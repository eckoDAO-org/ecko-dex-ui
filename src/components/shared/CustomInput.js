import React from 'react';
import { Input as SUIInput } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';
import { useGameEditionContext } from '../../contexts';
import Label from './Label';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${({ gameEditionView, theme: { colors, fontFamily }, geColor }) => {
    if (!gameEditionView) {
      return css`
        border: 1px solid ${colors.white}99;
        border-radius: 4px;
        padding: 10px 10px 0px 10px;
        .ui.input > input {
          padding-left: 0px;
          font-family: ${fontFamily.regular};
        }
      `;
    } else {
      return css`
        input::placeholder {
          color: ${`${geColor}80` || colors.white} !important;
        }
        .ui.input > input {
          padding: 0px;
          padding-left: 30px;
          font-family: ${fontFamily.pixeboy};
          font-size: 34px;
          color: ${geColor || colors.white} !important;
          height: 22px;
        }
        .ui.input {
          height: 22px;
          padding-top: 6px;
          align-items: center;
        }
      `;
    }
  }}
`;

const LabelsContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-left: ${({ gameEditionView }) => gameEditionView && '30px'};
  span {
    text-transform: capitalize;
    ${({ gameEditionView }) => {
      if (gameEditionView) {
        return css`
          height: 14px;
          padding-top: 8px;
        `;
      }
    }}
  }
`;

const CustomInput = ({
  placeholder,
  size,
  disabled,
  value,
  label,
  error,
  type,
  maxLength,
  numberOnly,
  onChange,
  inputRightComponent,
  topLeftLabel,
  topRightLabel,
  bottomLeftLabel,
  bottomRightLabel,
  geColor,
  containerStyle,
}) => {
  const { gameEditionView } = useGameEditionContext();
  return (
    <Container geColor={geColor} gameEditionView={gameEditionView} style={containerStyle}>
      {(topLeftLabel || topRightLabel) && !gameEditionView && (
        <LabelsContainer gameEditionView={gameEditionView}>
          {topLeftLabel && (
            <Label fontSize={13} fontFamily="bold">
              {topLeftLabel}
            </Label>
          )}
          {topRightLabel && (
            <Label
              fontSize={13}
              fontFamily="bold"
              style={{
                marginLeft: !topLeftLabel ? 'auto' : 'unset',
                textAlign: 'end',
              }}
            >
              {topRightLabel}
            </Label>
          )}
        </LabelsContainer>
      )}
      <SUIInput
        inverted
        fluid
        icon={inputRightComponent}
        labelPosition="right"
        placeholder={placeholder}
        size={size}
        disabled={disabled}
        value={value}
        label={label}
        error={error}
        type={type}
        maxLength={maxLength}
        onChange={(e, props) => {
          if (numberOnly && props.value.match(/[a-zA-Z]/)) return;
          onChange(e, props);
        }}
      />

      {(bottomLeftLabel || bottomRightLabel) && (
        <LabelsContainer gameEditionView={gameEditionView}>
          {bottomLeftLabel && gameEditionView && (
            <Label withShade={gameEditionView} geColor={geColor}>
              {bottomLeftLabel}
            </Label>
          )}
          {bottomRightLabel && (
            <Label
              style={{
                marginLeft: !topLeftLabel ? 'auto' : 'unset',
              }}
            >
              {bottomRightLabel}
            </Label>
          )}
        </LabelsContainer>
      )}
    </Container>
  );
};

export default CustomInput;

CustomInput.propTypes = {
  topLeftLabel: PropTypes.string,
  topRightLabel: PropTypes.string,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['big', 'huge', 'large', 'massive', 'mini', 'small']),
  inputRightComponent: PropTypes.element,
  numberOnly: PropTypes.bool,
};

CustomInput.defaultProps = {
  topLeftLabel: '',
  topRightLabel: '',
  placeholder: '',
  size: 'big',
  inputRightComponent: null,
  numberOnly: false,
};
