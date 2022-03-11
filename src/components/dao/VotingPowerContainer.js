/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import ProgressBar from '../shared/ProgressBar';

const VotingPowerContainer = () => {
  return (
    <FlexContainer className="column" gap={10} withGradient style={{ height: 'min-content' }} desktopStyle={{ width: 268 }}>
      <Label fontSize={16} fontFamily="syncopate">
        multiplier
      </Label>
      <ProgressBar withBottomLabel currentValue={2} maxValue={3} />
      <FlexContainer className="column">
        <Label fontSize={13} fontFamily="basier">
          Voting power
        </Label>
        <Label fontSize={32} fontFamily="basier">
          1020123
        </Label>
      </FlexContainer>
      <FlexContainer className="column">
        <Label fontSize={13} fontFamily="basier" labelStyle={{ opacity: 0.2 }}>
          Vibe dust
        </Label>
        <Label fontSize={32} fontFamily="basier" labelStyle={{ opacity: 0.2 }}>
          Soon
        </Label>
      </FlexContainer>
      <FlexContainer className="column">
        <Label fontSize={13} fontFamily="basier" labelStyle={{ opacity: 0.2 }}>
          Role
        </Label>
        <Label fontSize={32} fontFamily="basier" labelStyle={{ opacity: 0.2 }}>
          Soon
        </Label>
      </FlexContainer>
    </FlexContainer>
  );
};

export default VotingPowerContainer;
