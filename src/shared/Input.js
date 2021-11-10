import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { Input as SUIInput } from 'semantic-ui-react';
import { ArrowDown, DropdownGe } from '../assets';
import { theme } from '../styles/theme';
import { GameEditionContext } from '../contexts/GameEditionContext';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  margin-bottom: ${({ gameEditionView }) => (gameEditionView ? '10px' : '0px')};
  width: 100%;
  border: ${({ gameEditionView }) => !gameEditionView && '1px solid #ffffff99'};
  border-radius: ${({ gameEditionView }) => !gameEditionView && '4px'};
  padding: ${({ gameEditionView }) => !gameEditionView && '10px'};

  .ui.input > input {
    padding: ${({ gameEditionView }) => !gameEditionView && ' 10px 2px'};
    font-family: ${({ gameEditionView }) =>
      gameEditionView
        ? `${theme.fontFamily.pressStartRegular}`
        : `${theme.fontFamily.regular}`};
    color: ${({ gameEditionView }) =>
      gameEditionView ? `${theme.colors.black} !important` : `#ffffff`};
  }
  & input::placeholder {
    color: ${({ gameEditionView }) =>
      gameEditionView ? `#15081F70 !important` : ``};
    text-transform: capitalize;
  }
  .ui.icon.input > input {
    padding-right: ${({ inputRightComponent, inputComponentWidth }) =>
      inputRightComponent ? `${inputComponentWidth + 25}px !important` : 0};
  }
  .ui.button:hover .icon {
    opacity: 1;
  }
  .ui.labeled.input > .label:not(.corner) {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background: ${({ gameEditionView }) => gameEditionView && 'transparent'};
    border: ${({ gameEditionView }) => gameEditionView && 'none'};
    font-family: ${({ gameEditionView }) =>
      gameEditionView
        ? `${theme.fontFamily.pressStartRegular}`
        : `${theme.fontFamily.regular}`};
  }
`;

const TopLabelsContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(gameEditionView) => (gameEditionView ? '2px' : '8px')};
  margin-left: 2px;
  margin-right: 2px;
  span {
    font: ${({ gameEditionView }) =>
      gameEditionView
        ? `normal normal normal 14px/17px ${theme.fontFamily.pressStartRegular}`
        : `normal normal bold 16px/20px Montserrat`};
    letter-spacing: 0px;
    color: ${({ gameEditionView }) =>
      gameEditionView ? `${theme.colors.black}` : `#ffffff`};
    text-transform: capitalize;
  }
`;

const BottomLabelsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${(gameEditionView) => (gameEditionView ? '2px' : '8px')};
  margin-left: 2px;
  margin-right: 2px;
  span {
    font: ${({ gameEditionView }) =>
      gameEditionView
        ? `normal normal normal 10px/12px ${theme.fontFamily.pressStartRegular}`
        : `normal normal normal 13px/16px Montserrat`};
    letter-spacing: 0px;
    color: ${({ gameEditionView }) =>
      gameEditionView ? `${theme.colors.black}` : `#ffffff`};
    text-transform: capitalize;
  }
`;

const Button = styled.button`
  display: flex !important;
  border: none;
  border-radius: 4px;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 25%;
  right: ${({ gameEditionView }) => (gameEditionView ? '10px' : '0px')};
  height: 22px;
  padding-left: 8px !important;
  /* padding-right: 8px !important; */
  background: transparent;
  border-radius: 20px;
  span {
    font: ${({ gameEditionView }) =>
      gameEditionView
        ? `normal normal normal 14px/18px ${theme.fontFamily.pressStartRegular}`
        : `normal normal bold 14px/18px ${theme.fontFamily.bold}`};
    color: ${({ gameEditionView }) =>
      gameEditionView ? `${theme.colors.black}` : `#ffffff`};
    text-transform: capitalize;

    @media (max-width: ${({ theme: { mediaQueries } }) =>
        `${mediaQueries.mobilePixel + 1}px`}) {
    }
  }
`;

const Input = ({
  fluid,
  topLeftLabel,
  topRightLabel,
  topLeftLabelStyle,
  topRightLabelStyle,
  bottomLeftLabel,
  bottomRightLabel,
  bottomLeftLabelStyle,
  bottomRightLabelStyle,
  label,
  containerStyle,
  placeholder,
  size,
  inputRightComponent,
  withSelectButton,
  numberOnly,
  buttonLabel,
  disabled,
  value,
  onSelectButtonClick,
  onChange,
  error,
  type,
  maxLength,
}) => {
  const { gameEditionView } = useContext(GameEditionContext);

  const getIcon = () => {
    if (withSelectButton && !inputRightComponent)
      return (
        <Button
          gameEditionView={gameEditionView}
          onClick={onSelectButtonClick}
          style={{
            border: 'none',
          }}
        >
          <span>
            {buttonLabel}
            {gameEditionView ? <DropdownGe /> : <ArrowDown fill='white' />}
          </span>
        </Button>
      );
    if (withSelectButton && inputRightComponent) return inputRightComponent;
    if (inputRightComponent) return inputRightComponent;
    return null;
  };
  return (
    <Container
      gameEditionView={gameEditionView}
      inputRightComponent={inputRightComponent || withSelectButton}
      inputComponentWidth={
        inputRightComponent
          ? theme.inputTokenWidth
          : theme.inputSelectButtonWidth
      }
      style={containerStyle}
    >
      {(topLeftLabel || topRightLabel) && (
        <TopLabelsContainer gameEditionView={gameEditionView}>
          {topLeftLabel && (
            <span
              style={{
                fontFamily: gameEditionView
                  ? theme.fontFamily.pressStartRegular
                  : theme.fontFamily.bold,
                ...topLeftLabelStyle,
              }}
            >
              {topLeftLabel}
            </span>
          )}
          {topRightLabel && (
            <span
              style={{
                fontFamily: gameEditionView
                  ? theme.fontFamily.pressStartRegular
                  : theme.fontFamily.regular,
                marginLeft: !topLeftLabel ? 'auto' : 'unset',
                ...topRightLabelStyle,
              }}
            >
              {topRightLabel}
            </span>
          )}
        </TopLabelsContainer>
      )}
      <SUIInput
        inverted
        fluid={fluid}
        icon={getIcon()}
        placeholder={placeholder}
        size={size}
        disabled={disabled}
        value={value}
        label={label}
        labelPosition='right'
        error={error}
        type={type}
        maxLength={maxLength}
        onChange={(e, props) => {
          if (numberOnly && props.value.match(/[a-zA-Z]/)) return;
          onChange(e, props);
        }}
        style={
          containerStyle
            ? containerStyle
            : {
                padding: !gameEditionView && '0px !important',
                borderRadius: '10px',
                border: gameEditionView ? '2px dashed #15081F' : 'none',
                opacity: 1,
                backgroundColor: 'transparent',
              }
        }
      />
      {(bottomLeftLabel || bottomRightLabel) && (
        <BottomLabelsContainer gameEditionView={gameEditionView}>
          {bottomLeftLabel && (
            <span
              style={{
                fontFamily: gameEditionView
                  ? theme.fontFamily.pressStartRegular
                  : theme.fontFamily.regular,
                ...bottomLeftLabelStyle,
              }}
            >
              {bottomLeftLabel}
            </span>
          )}
          {bottomRightLabel && (
            <span
              style={{
                fontFamily: gameEditionView
                  ? theme.fontFamily.pressStartRegular
                  : theme.fontFamily.regular,
                marginLeft: !topLeftLabel ? 'auto' : 'unset',
                ...bottomRightLabelStyle,
              }}
            >
              {bottomRightLabel}
            </span>
          )}
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
