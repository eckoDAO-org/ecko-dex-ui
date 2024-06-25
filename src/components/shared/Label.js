import React from 'react';
import { Popup } from 'semantic-ui-react';
import styled, { css } from 'styled-components/macro';
import { InfoIcon } from '../../assets';
import { useGameEditionContext } from '../../contexts';
import { commonTheme } from '../../styles/theme';
import GameEditionLabel from '../game-edition-v2/components/GameEditionLabel';
import { FlexContainer } from './FlexContainer';

const STYText = styled.span`
  display: flex;
  align-items: center;
  cursor: ${({ onClick }) => onClick && 'pointer'};
  z-index: 1;
  color: ${({ withShade, theme: { colors }, color }) => {
    if (color) {
      if (withShade) {
        return `${color}99`;
      }
      return color;
    }

    if (withShade) {
      return `${colors.white}99`;
    }

    return colors.white;
  }};
  ${({ inverted, theme: { colors } }) =>
    inverted &&
    css`
      color: ${colors.primary};
    `}
  font-size: ${({ fontSize }) => fontSize}px;

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    font-size: ${({ mobileFontSize, fontSize }) => mobileFontSize || fontSize}px;
  }
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel}px`}) and (min-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel}px`}) {
    font-size: ${({ tabletFontSize, fontSize }) => tabletFontSize || fontSize}px;
  }

  /* svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  } */

  &.capitalize {
    text-transform: capitalize;
  }

  &.uppercase {
    text-transform: uppercase;
  }

  &.justify-fe {
    justify-content: flex-end;
  }
  &.justify-ce {
    justify-content: center;
  }

  &.gradient {
    display: block;
    background-image: linear-gradient(90deg, #10c4df 0%, #f04ca9 51%, #edba31 100%);
    color: transparent;
    /* color: ${({ theme: { colors } }) => colors.primary}; */
    -webkit-background-clip: text;
    background-clip: text;
  }
`;

const STYInfoContainer = styled.div`
  cursor: pointer;
  margin-left: 8px;
  svg {
    height: 16px !important;
    width: 16px !important;
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const Label = ({
  className,
  children,
  fontFamily = 'basier',
  fontSize = 13,
  mobileFontSize,
  tabletFontSize,
  labelStyle,
  geFontSize,
  geFontWeight,
  geLabelStyle,
  geColor,
  color,
  info,
  inverted,
  withShade,
  geCenter,
  onClick,
  onClose,
  outGameEditionView,
  nullableValue,
}) => {
  const { gameEditionView } = useGameEditionContext();
  return gameEditionView && !outGameEditionView ? (
    <GameEditionLabel
      fontSize={geFontSize}
      fontWeight={geFontWeight}
      color={geColor}
      withShade={withShade}
      onClose={onClose}
      center={geCenter}
      style={geLabelStyle}
      onClick={onClick}
    >
      {children}
    </GameEditionLabel>
  ) : (
    <STYText
      className={`${fontFamily === 'syncopate' ? 'uppercase ' : ''}${className || ''}`}
      inverted={inverted}
      color={color}
      fontSize={fontSize}
      tabletFontSize={tabletFontSize}
      mobileFontSize={mobileFontSize}
      onClick={onClick}
      withShade={withShade}
      style={{ fontFamily: commonTheme.fontFamily[fontFamily], ...labelStyle }}
    >
      {children || nullableValue}
      {info && (
        <Popup
          basic
          style={{ padding: 0 }}
          offset={[-10, -20]}
          trigger={
            <STYInfoContainer>
              <InfoIcon />
            </STYInfoContainer>
          }
          on="click"
          position="top left"
        >
          <FlexContainer withGradient>
            <STYText>{info}</STYText>
          </FlexContainer>
        </Popup>
      )}
    </STYText>
  );
};

export default Label;
