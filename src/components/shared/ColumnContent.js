import React, { useContext } from 'react';
import { ColumnContainer, Label, Value } from '../../components/layout/Containers';
import { GameEditionContext } from '../../contexts/GameEditionContext';

const ColumnContent = ({ label, value, containerStyle, onClick }) => {
  const { gameEditionView } = useContext(GameEditionContext);

  return (
    <ColumnContainer style={{ flex: 1, cursor: onClick ? 'pointer' : 'default', ...containerStyle }} onClick={onClick}>
      <Label gameEditionView={gameEditionView} withShade="99">
        {label}
      </Label>
      <Value gameEditionView={gameEditionView} style={{ lineBreak: 'unset' }}>
        {value}
      </Value>
    </ColumnContainer>
  );
};

export default ColumnContent;
