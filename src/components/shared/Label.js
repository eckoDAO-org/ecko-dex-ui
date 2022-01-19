import React from 'react';
import styled, { css } from 'styled-components/macro';
import { useGameEditionContext } from '../../contexts';
import { commonTheme } from '../../styles/theme';
import GameEditionLabel from '../game-edition-v2/components/GameEditionLabel';

const STYText = styled.span`
  display: flex;
  align-items: center;
  cursor: ${({ onClick }) => onClick && 'pointer'};
  z-index: 1;
  color: ${({ withShade, theme: { colors }, labelColor }) => (labelColor || withShade ? `${colors.white}99` : colors.white)};
  ${({ inverted, theme: { colors } }) =>
    inverted &&
    css`
      color: ${colors.primary};
    `}
  font-size:${({ fontSize }) => fontSize}px;
`;

const Label = ({
  className,
  children,
  fontFamily = 'regular',
  fontSize = 16,
  labelStyle,
  geFontSize,
  geFontWeight,
  geLabelStyle,
  geColor,
  inverted,
  withShade,
  geCenter,
  onClick,
}) => {
  const { gameEditionView } = useGameEditionContext();
  return gameEditionView ? (
    <GameEditionLabel
      fontSize={geFontSize}
      fontWeight={geFontWeight}
      color={geColor}
      withShade={withShade}
      style={geCenter ? { ...geLabelStyle, display: 'block', textAlign: 'center' } : { ...geLabelStyle }}
      onClick={onClick}
    >
      {children}
    </GameEditionLabel>
  ) : (
    <STYText
      className={className}
      inverted={inverted}
      fontSize={fontSize}
      onClick={onClick}
      withShade={withShade}
      style={{ fontFamily: commonTheme.fontFamily[fontFamily], ...labelStyle }}
    >
      {children}
    </STYText>
  );
};

export default Label;
