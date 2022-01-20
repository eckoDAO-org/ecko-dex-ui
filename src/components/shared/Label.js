import React from 'react';
import styled, { css } from 'styled-components/macro';
import { CloseGe } from '../../assets';
import { useGameEditionContext } from '../../contexts';
import { commonTheme } from '../../styles/theme';
import GameEditionLabel from '../game-edition-v2/components/GameEditionLabel';

const STYText = styled.span`
  display: flex;
  align-items: center;
  cursor: ${({ onClick }) => onClick && 'pointer'};
  z-index: 1;
  color: ${({ withShade, theme: { colors }, color }) => (color || withShade ? `${colors.white}99` : colors.white)};
  ${({ inverted, theme: { colors } }) =>
    inverted &&
    css`
      color: ${colors.primary};
    `}
  font-size: ${({ fontSize }) => fontSize}px;
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
  color,
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
      style={
        geCenter
          ? { ...geLabelStyle, display: 'block', textAlign: 'center', width: onClose ? '100%' : 'auto' }
          : { ...geLabelStyle, width: onClose ? '100%' : 'auto' }
      }
      onClick={onClick}
    >
      {children}
      {onClose && <CloseGe style={{ cursor: 'pointer', position: 'absolute', right: 12, top: 6 }} onClick={onClose} />}
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
    </STYText>
  );
};

export default Label;
