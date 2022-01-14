import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { Input as SUIInput } from 'semantic-ui-react';
import { ArrowDown, DropdownGe } from '../../assets';
import { theme } from '../../styles/theme';
import { GameEditionContext } from '../../contexts/GameEditionContext';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  margin-bottom: ${({ gameEditionView, outGameEditionView }) => {
    if (outGameEditionView) return '0px';
    if (gameEditionView) return '10px';
    else return '0px';
  }};
  width: 100%;
  background-color: ${({ gameEditionView, noInputBackground, theme: { backgroundInput } }) =>
    gameEditionView || noInputBackground ? 'transparent' : backgroundInput};
  border: ${({ gameEditionView, theme: { colors } }) => !gameEditionView && `1px solid ${colors.white}99`};
  border-radius: ${({ gameEditionView }) => !gameEditionView && '4px'};
  padding: ${({ gameEditionView }) => (!gameEditionView ? '10px 10px 0px 10px' : '8px 14px 0px 30px')};

  .ui.input > input {
    margin-top: ${({ gameEditionView }) => gameEditionView && '5px'};
    height: ${({ gameEditionView }) => gameEditionView && '22px'};
    padding: ${({ gameEditionView }) => (!gameEditionView ? '10px 2px' : '0px')};
    font-family: ${({ gameEditionView, outGameEditionView, theme: { fontFamily } }) => {
      if (outGameEditionView) return fontFamily.regular + '!important';
      if (gameEditionView) return fontFamily.pixeboy + '!important';
      else return fontFamily.regular + '!important';
    }};
    color: ${({ gameEditionView, outGameEditionView, theme: { colors } }) => {
      if (outGameEditionView) return colors.white + '!important';
      if (gameEditionView) return colors.black + '!important';
      else return colors.white + '!important';
    }};
    font-size: ${({ gameEditionView }) => gameEditionView && '34px'};
  }
  & input::placeholder {
    color: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? `${colors.black}70 !important` : ``)};
    text-transform: capitalize;
    font-family: 14px;
    font-size: ${({ gameEditionView }) => gameEditionView && '34px'};
  }
  .ui.icon.input > input {
    padding-right: ${({ inputRightComponent, inputComponentWidth }) => (inputRightComponent ? `${inputComponentWidth + 70}px !important` : 0)};
  }
  .ui.button:hover .icon {
    opacity: 1;
  }
  .ui.labeled.input > .label:not(.corner) {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    color: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? `${colors.black} !important` : `${colors.white} !important`)};
    padding-left: ${({ gameEditionView }) => !gameEditionView && '0px'};
    padding-right: ${({ gameEditionView }) => !gameEditionView && '0px'};
    background: transparent;
    border: ${({ gameEditionView }) => gameEditionView && 'none'};
    font-family: ${({ gameEditionView, theme: { fontFamily } }) => (gameEditionView ? `${fontFamily.pixeboy}` : `${fontFamily.regular}`)};
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
    font: ${({ gameEditionView, theme: { fontFamily } }) =>
      gameEditionView ? `normal normal normal 13px/16px ${fontFamily.pixeboy}` : `normal normal bold 13px/16px Montserrat`};
    letter-spacing: 0px;
    color: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? `${colors.black}` : `${colors.white}`)};
    text-transform: capitalize;
    @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
      font-size: ${({ gameEditionView }) => (gameEditionView ? `10px` : ``)};
    }
  }
`;

const BottomLabelsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${(gameEditionView) => (gameEditionView ? '2px' : '8px')};
  margin-left: 2px;
  margin-right: 2px;
  span {
    font: ${({ gameEditionView, theme: { fontFamily } }) =>
      gameEditionView ? `normal normal normal 20px ${fontFamily.pixeboy}` : `normal normal normal 13px/16px Montserrat`};
    letter-spacing: 0px;
    color: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? `${colors.black}` : `${colors.white}`)};
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
  top: ${({ gameEditionView }) => (gameEditionView ? '48%' : '25%')};
  right: ${({ gameEditionView }) => (gameEditionView ? '-2px' : '0px')};
  height: 22px;
  padding-left: 8px !important;
  /* padding-right: 8px !important; */
  background: transparent;
  border-radius: 20px;
  span {
    font: ${({ gameEditionView, theme: { fontFamily } }) =>
      gameEditionView ? `normal normal normal 29px ${fontFamily.pixeboy}` : `normal normal bold 14px/18px ${fontFamily.bold}`};
    color: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? `${colors.black}` : `${colors.white}`)};
    text-transform: capitalize;

    @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
      font: ${({ gameEditionView, theme: { fontFamily } }) =>
        gameEditionView ? `normal normal normal 13px ${fontFamily.pixeboy}` : `normal normal bold 14px/18px ${fontFamily.bold}`};
    }
  }

  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white}!important;
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
  outGameEditionView,
  noInputBackground,
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
            {gameEditionView ? <DropdownGe /> : <ArrowDown />}
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
      outGameEditionView={outGameEditionView}
      noInputBackground={noInputBackground}
      inputRightComponent={inputRightComponent || withSelectButton}
      inputComponentWidth={inputRightComponent ? theme().inputTokenWidth : theme().inputSelectButtonWidth}
      style={containerStyle}
    >
      {(topLeftLabel || topRightLabel) && (
        <TopLabelsContainer gameEditionView={gameEditionView}>
          {topLeftLabel && !gameEditionView && (
            <span
              style={{
                fontFamily: gameEditionView ? theme().fontFamily.pixeboy : theme().fontFamily.bold,
                ...topLeftLabelStyle,
              }}
            >
              {topLeftLabel}
            </span>
          )}
          {topRightLabel && !gameEditionView && (
            <span
              style={{
                fontFamily: gameEditionView ? theme().fontFamily.pixeboy : theme().fontFamily.regular,
                marginLeft: !topLeftLabel ? 'auto' : 'unset',
                textAlign: 'end',
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
        labelPosition="right"
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
                opacity: 1,
                backgroundColor: 'transparent',
              }
        }
      />
      {(bottomLeftLabel || bottomRightLabel) && (
        <BottomLabelsContainer gameEditionView={gameEditionView}>
          {bottomLeftLabel && gameEditionView && (
            <span
              style={{
                fontFamily: gameEditionView ? theme().fontFamily.pixeboy : theme().fontFamily.regular,
                ...bottomLeftLabelStyle,
              }}
            >
              {bottomLeftLabel}
            </span>
          )}
          {bottomRightLabel && (
            <span
              style={{
                fontFamily: gameEditionView ? theme().fontFamily.pixeboy : theme().fontFamily.regular,
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
