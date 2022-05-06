import React from 'react';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import List from '../shared/List';

const UnstakeInfo = () => {
  return (
    <FlexContainer className="column" gap={16}>
      <Label>Unstaking your funds is always possible, even partially. To further reward long-term holders, the following structure applies:</Label>
      <List
        paddingLeft={16}
        items={[
          'Unstaking during the first 72 hours will trigger a 3% flat penalty on your unstaked amount.',
          'The partial or complete unstaking will reset the rewards penalty period from 0.',
        ]}
      />
    </FlexContainer>
  );
};

export default UnstakeInfo;
