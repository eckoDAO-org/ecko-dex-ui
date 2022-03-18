import React from 'react';
import { humanReadableNumber } from '../../utils/reduceBalance';
import CustomButton from '../shared/CustomButton';
import CustomDivider from '../shared/CustomDivider';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';

const MyPosition = ({ amount }) => {
  return (
    <div className="column w-100">
      <Label fontSize={16} fontFamily="syncopate">
        my position
      </Label>

      <FlexContainer withGradient className="column background-fill">
        <Label>Amount</Label>
        <Label fontSize={32} fontFamily="syncopate">
          {humanReadableNumber(amount)}
        </Label>

        <CustomDivider />

        <CustomButton type="gradient">stake</CustomButton>
      </FlexContainer>
    </div>
  );
};

export default MyPosition;
