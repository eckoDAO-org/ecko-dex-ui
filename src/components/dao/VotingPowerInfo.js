import React from 'react';
import { Divider } from 'semantic-ui-react';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';

const VotingPowerInfo = () => {
  return (
    <FlexContainer className="column" gap={16}>
      <Label fontSize={16}>Position</Label>
      <Label>
        Position accrues your KDX holdings from both the Vaulting and the Staking Programs. Please note that all Second Sale participants are
        automatically staking their KDX while it is being vesting.
      </Label>
      <Divider />
      <Label fontSize={16}>Multiplier</Label>
      <Label>
        The Voting Power Multiplier is a time-dependent function of your KDX staking amount and meaningful contributions (Vibedust). In 60 days the
        multiplier value goes up to 1 and can reach 2.5 over the course of 4 years.
      </Label>
    </FlexContainer>
  );
};

export default VotingPowerInfo;