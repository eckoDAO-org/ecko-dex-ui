import React from 'react';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';

const CreatePairInfo = () => {
  return (
    <FlexContainer className="column" gap={16}>
      <Label fontSize={13}>Mercatus allows community members to create and add liquidity for any specific token pair.</Label>
    </FlexContainer>
  );
};

export default CreatePairInfo;
