import React from 'react';
import { Equation } from 'react-equation';
import { EquationContainer, FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import List from '../shared/List';

const PenaltyRewardsInfo = () => {
  return (
    <FlexContainer className="column" gap={16}>
      <Label>To achieve 2 objectives: rewarding long-term holders and preventing manipulation and spamming of the smart contract involved.</Label>

      <List
        paddingLeft={16}
        items={[
          'If you unstake within the first 72 hours, you will incur into a 3% flat penalty on your staked amount.',
          'If you withdraw your rewards within the first 60 days, the penalty will only affect your accumulated rewards and exponentially decreases in time.',
        ]}
      />
      <Label>Your initial capital will not be affected.</Label>
      <EquationContainer className="flex align-ce">
        <Equation className="equation" value="p(d) = max (0, ((60-d)/60)^0.66)" />
      </EquationContainer>

      <Label>where:</Label>
      <List
        paddingLeft={16}
        items={[
          'p denotes the penalty proportion on rewards accumulated in the first 60 days;',
          'd is the number of days the user has kept their KDX staked;',
          '“60”  is the minimum number of days required not to incur into any penalty;',
          '“0.66” is an arbitrary coefficient used to model the penalty-curve efficiently.',
        ]}
      />
    </FlexContainer>
  );
};

export default PenaltyRewardsInfo;
