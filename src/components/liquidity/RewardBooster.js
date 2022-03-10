import React from 'react';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';

const RewardBooster = () => {
  return (
    <FlexContainer withGradient className="background-fill w-100 column">
      <Label>REWARD BOOSTER</Label>
      <FlexContainer></FlexContainer>
      <FlexContainer></FlexContainer>
    </FlexContainer>
  );
};

export default RewardBooster;
