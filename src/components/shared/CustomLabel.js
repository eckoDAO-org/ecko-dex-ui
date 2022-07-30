import React from 'react';
import styled from 'styled-components/macro';
import { useGameEditionContext } from '../../contexts';

const Label = styled.span`
  text-transform: capitalize;
  text-align: ${({ textAlign }) => textAlign};
  color: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? colors.gameEditionBlue : colors.white)};
  font-family: ${({ gameEditionView, bold, theme: { fontFamily } }) =>
    gameEditionView ? fontFamily.pixeboy : bold ? fontFamily.syncopate : fontFamily.basier};
  font-size: ${({ gameEditionView, fontSize }) => (fontSize ? (gameEditionView ? '20px' : fontSize) : '13px')};
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    font-size: ${({ gameEditionView }) => gameEditionView && '10px'};
  }
`;

const CustomLabel = ({ children, bold, fontSize, labelStyle, textAlign }) => {
  const { gameEditionView } = useGameEditionContext();

  return (
    <Label
      style={{
        ...labelStyle,
      }}
      bold={bold}
      fontSize={fontSize}
      textAlign={textAlign}
      gameEditionView={gameEditionView}
    >
      {children}
    </Label>
  );
};

export default CustomLabel;
