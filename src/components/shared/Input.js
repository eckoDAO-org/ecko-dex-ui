import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';
import { Input as SUIInput } from 'semantic-ui-react';
import Label from './Label';
import { useGameEditionContext } from '../../contexts';

const Container = styled.div`
  display: flex;
  flex-flow: column;

  width: 100%;

  ${({ gameEditionView, outGameEditionView, theme: { colors, fontFamily }, withBorder, color, geColor }) => {
    if (gameEditionView) {
      return css`
        background-color: transparent;
        border: ${withBorder && '2px dashed #ffffff'};
        padding: 12px 14px 0px 30px;
        .ui.input {
          align-items: center;
        }
        .ui.input > input {
          height: 22px;
          padding: 0px;
          font-family: ${outGameEditionView ? fontFamily.basier : fontFamily.pixeboy};
          color: ${geColor ? geColor : outGameEditionView ? colors.white : colors.black} !important;
          font-size: 26px;
        }

        input::placeholder {
          color: ${geColor ? geColor : `${colors.black}99`} !important;
          text-transform: capitalize;
          font-family: ${outGameEditionView ? fontFamily.basier : fontFamily.pixeboy};
          font-size: 26px;
        }
        .ui.labeled.input > .label:not(.corner) {
          font-family: ${fontFamily.pixeboy};
          border: none;
          color: #ffffff !important;
          font-size: 26px;
          padding: 0px;
        }
      `;
    } else {
      return css`
        border: 1px solid ${colors.white}66;
        padding: 10px 10px 0px 10px;
        border-radius: 4px;
        .ui.input > input {
          padding: 10px 2px;
          font-family: ${fontFamily.basier};
          color: ${color ? color : colors.white} !important;
          font-size: ${({ fontSize = 28 }) => fontSize}px;
          @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
            font-size: 20px;
          }
        }
        input::placeholder {
          color: ${colors.white} !important;
          text-transform: capitalize;
          font-family: 14px;
          font-family: ${fontFamily.basier};
          font-size: ${({ fontSize = 28 }) => fontSize}px;
          @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
            font-size: 20px;
          }
        }
        .ui.labeled.input > .label:not(.corner) {
          font-family: ${fontFamily.basier};
          padding-left: 0px;
          padding-right: 0px;
          color: ${colors.white} !important;
          font-size: ${({ fontSize = 28 }) => fontSize}px;
          @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
            font-size: 20px;
          }
        }
      `;
    }
  }}

  .ui.icon.input > input {
    padding-right: 5px !important; /* ${({ inputRightComponent, inputComponentWidth }) =>
      inputRightComponent ? `${inputComponentWidth + 10}px !important` : 0}; */
  }
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
  bottomContent,
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
  topComponent,
  fontSize,
}) => {
  const { gameEditionView } = useGameEditionContext();

  return (
    <Container
      gameEditionView={gameEditionView}
      outGameEditionView={outGameEditionView}
      noInputBackground={noInputBackground}
      color={color}
      geColor={geColor}
      withBorder={withBorder}
      style={containerStyle}
      fontSize={fontSize}
    >
      {(topLeftLabel || topRightLabel) && !gameEditionView && (
        <TopLabelsContainer>
          {topLeftLabel && <Label fontFamily="basier">{topLeftLabel}</Label>}
          {topRightLabel && (
            <Label
              fontFamily="basier"
              labelStyle={{
                marginLeft: !topLeftLabel ? 'auto' : 'unset',
                textAlign: 'end',
              }}
            >
              {topRightLabel}
            </Label>
          )}
        </TopLabelsContainer>
      )}
      {topComponent}
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
          if (numberOnly && !props.value.match(/^[0-9]*[.,]?[0-9]*$/)) return;
          onChange(e, { ...props, value: props.value.replace(/,/g, '.') });
        }}
        style={inputStyle}
      />
      {bottomContent || ''}
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
