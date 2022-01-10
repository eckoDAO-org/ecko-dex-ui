import React from 'react';
import styled, { css } from 'styled-components/macro';
import { useGameEditionContext } from '../../contexts';
import { commonTheme } from '../../styles/theme';

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

const Label = ({ className, children, label, labelColor, fontFamily = 'regular', fontSize = 16, labelStyle, inverted, onClick }) => {
  const { gameEdition } = useGameEditionContext();
  return (
    <STYText
      className={className}
      labelColor={labelColor}
      inverted={inverted}
      fontSize={fontSize}
      onClick={onClick}
      style={{ fontFamily: gameEdition ? commonTheme.fontFamily.pixeboy : commonTheme.fontFamily[fontFamily], ...labelStyle }}
    >
      {children || label || '-'}
    </STYText>
  );
};

export default Label;
