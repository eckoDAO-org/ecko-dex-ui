import React from 'react';
import styled, { css } from 'styled-components/macro';
import { useGameEditionContext } from '../../contexts';
import { commonTheme } from '../../styles/theme';
import GameEditionLabel from '../game-edition-v2/shared/GameEditionLabel';

const STYText = styled.span`
  display: flex;
  align-items: center;
  cursor: ${({ onClick }) => onClick && 'pointer'};
  z-index: 1;
  color: ${({ theme: { colors }, labelColor }) => labelColor || colors.white};
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
  labelColor,
  fontFamily = 'regular',
  fontSize = 16,
  labelStyle,
  geFontSize,
  geFontWeight,
  geLabelStyle,
  geColor,
  inverted,
  onClick,
}) => {
  const { gameEditionView } = useGameEditionContext();
  return gameEditionView ? (
    <GameEditionLabel fontSize={geFontSize} fontWeight={geFontWeight} color={geColor} style={geLabelStyle} onClick={onClick}>
      {children}
    </GameEditionLabel>
  ) : (
    <STYText
      className={className}
      labelColor={labelColor}
      inverted={inverted}
      fontSize={fontSize}
      onClick={onClick}
      style={{ fontFamily: commonTheme.fontFamily[fontFamily], ...labelStyle }}
    >
      {children}
    </STYText>
  );
};

export default Label;
