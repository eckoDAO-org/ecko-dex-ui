import React from 'react';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';

const CreatePairInfo = () => {
  return (
    <FlexContainer className="column" gap={16}>
      <Label fontSize={16}>Info</Label>
    </FlexContainer>
  );
};

export default CreatePairInfo;
