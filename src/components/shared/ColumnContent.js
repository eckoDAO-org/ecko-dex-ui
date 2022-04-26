import React from 'react';
import { ColumnContainer, Label, Value } from '../../components/layout/Containers';
import { useGameEditionContext } from '../../contexts';

const ColumnContent = ({ label, value, containerStyle, onClick }) => {
  const { gameEditionView } = useGameEditionContext();

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
