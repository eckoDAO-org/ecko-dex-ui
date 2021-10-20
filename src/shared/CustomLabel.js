import React, { useContext } from 'react';
import styled from 'styled-components';
import { GameEditionContext } from '../contexts/GameEditionContext';
import theme from '../styles/theme';

const Label = styled.span`
  color: #ffffff;
  text-transform: capitalize;
  text-align: ${({ start }) => (start ? 'start' : 'center')};
  align-self: center;
`;

const CustomLabel = ({ children, bold, fontSize, labelStyle, start }) => {
  const { gameEditionView } = useContext(GameEditionContext);

  return (
    <Label
      style={{
        fontFamily: gameEditionView
          ? theme.fontFamily.pressStartRegular
          : bold
          ? theme.fontFamily.bold
          : theme.fontFamily.regular,
        fontSize: gameEditionView ? '10px' : fontSize ? fontSize : 13,
        color: gameEditionView ? theme.colors.black : '#fff',
        ...labelStyle,
      }}
      start={start}
    >
      {children}
    </Label>
  );
};

export default CustomLabel;
