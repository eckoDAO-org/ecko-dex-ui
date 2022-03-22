import React from 'react';
import { Equation } from 'react-equation';
import { EquationContainer, FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import List from '../shared/List';

const PentalityRewardsInfo = () => {
  return (
    <FlexContainer className="column" gap={16}>
      <Label>
        The penalty structure of the KDX Staking tool is designed to achieve two objectives: to reward long-term holders and to prevent manipulation
        and spam of the smart contract involved. If you unstake during the first 72hours you will incur in a penalty: 3% flat penalty on your staked
        amount. If you withdraw your rewards during the first 60 days, you will incur in a penalty: the penalty will only affect your accumulated
        rewards and exponentially decreases in time. Your initial capital will not be affected.
      </Label>

      <EquationContainer className="flex align-ce">
        <Equation className="equation" value="p(d) = max (0, ((60-d)/60)^0.66)" />
      </EquationContainer>

      <Label>where:</Label>
      <List
        paddingLeft={16}
        items={[
          'p denotes the penalty proportion on rewards accumulated on the first 60 days;',
          'd is the number of days the user has kept their KDX staked;',
          '“60” is the minimum amount of days required to have no penalties;',
          '“0.66” is an arbitrary coefficient used to model the penalty-curve efficiently.',
        ]}
      />
    </FlexContainer>
  );
};

export default PentalityRewardsInfo;
