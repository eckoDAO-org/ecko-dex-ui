import React, { useContext } from 'react';
import styled from 'styled-components';
import { GameEditionContext } from '../contexts/GameEditionContext';

const Label = styled.span`
  text-transform: capitalize;
  text-align: ${({ textAlign }) => textAlign};
  color: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? colors.black : colors.white)};
  font-family: ${({ gameEditionView, bold, theme: { fontFamily } }) =>
    gameEditionView ? fontFamily.pressStartRegular : bold ? fontFamily.bold : fontFamily.regular};
  font-size: ${({ gameEditionView, fontSize }) => (gameEditionView ? '10px' : fontSize ? fontSize : '13px')};
`;

const CustomLabel = ({ children, bold, fontSize, labelStyle, textAlign }) => {
  const { gameEditionView } = useContext(GameEditionContext);

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
