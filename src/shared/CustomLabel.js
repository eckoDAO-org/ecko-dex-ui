import React, { useContext } from 'react';
import styled from 'styled-components';
import { GameEditionContext } from '../contexts/GameEditionContext';
import { LightModeContext } from '../contexts/LightModeContext';
import { theme } from '../styles/theme';

const Label = styled.span`
  color: #ffffff;
  text-transform: capitalize;
  text-align: ${({ start }) => (start ? 'start' : 'center')};
  align-self: center;
`;

const CustomLabel = ({ children, bold, fontSize, labelStyle, start }) => {
  const { gameEditionView } = useContext(GameEditionContext);
  const { themeMode } = useContext(LightModeContext);

  return (
    <Label
      style={{
        fontFamily: gameEditionView
          ? theme(themeMode).fontFamily.pressStartRegular
          : bold
          ? theme(themeMode).fontFamily.bold
          : theme(themeMode).fontFamily.regular,
        fontSize: gameEditionView ? '10px' : fontSize ? fontSize : 13,
        color: gameEditionView ? theme(themeMode).colors.black : theme(themeMode).colors.white,
        ...labelStyle
      }}
      start={start}
    >
      {children}
    </Label>
  );
};

export default CustomLabel;
