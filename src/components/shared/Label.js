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
  color: ${({ withShade, theme: { colors }, color }) => (color ? color : withShade ? `${colors.white}99` : colors.white)};
  ${({ inverted, theme: { colors } }) =>
    inverted &&
    css`
      color: ${colors.primary};
    `}
  font-size: ${({ fontSize }) => fontSize}px;
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }

  &.capitalize {
    text-transform: capitalize;
  }

  &.uppercase {
    text-transform: uppercase;
  }

  &.justify-fe {
    justify-content: flex-end;
  }

  &.gradient {
    display: block;
    background-image: linear-gradient(90deg, #10c4df 0%, #f04ca9 51%, #edba31 100%);
    color: transparent;
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
  fontSize = 16,
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
      className={className}
      inverted={inverted}
      color={color}
      fontSize={fontSize}
      onClick={onClick}
      withShade={withShade}
      style={{ fontFamily: commonTheme.fontFamily[fontFamily], ...labelStyle }}
    >
      {children}
      {info && (
        <Popup
          basic
          offset={[-10, -20]}
          trigger={
            <STYInfoContainer>
              <InfoIcon />
            </STYInfoContainer>
          }
          on="click"
          position="top left"
        >
          <FlexContainer withGradient>{info}</FlexContainer>
        </Popup>
      )}
    </STYText>
  );
};

export default Label;
