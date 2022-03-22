import React from 'react';
import { Equation } from 'react-equation';
import { EquationContainer, FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import List from '../shared/List';

const UnstakeInfo = () => {
  return (
    <FlexContainer className="column" gap={16}>
      <Label>
        Unstaking your funds is always possible. To prevent smart contract manipulation and further reward long-term holders, an easy-to-understand
        penalty structure has been designed:
      </Label>

      <List
        paddingLeft={16}
        items={[
          'Withdrawing your rewards during the first 60 days will result in an exponentially time-decreasing penalty on your accumulated rewards –your initial capital will not be affected.',
        ]}
      />

      <EquationContainer>
        <Equation className="equation" value="p(d) = max (0, ((60-d)/60)^0.66)" />
      </EquationContainer>

      <Label>where:</Label>

      <List
        listType="circle"
        items={[
          'p denotes the penalty proportion on rewards accumulated on the first 60 days;',
          'd is the number of days the user has kept their KDX staked;',
          '“60” is the minimum amount of days required to have no penalties;',
          '0“0.66” is an arbitrary coefficient used to model the penalty-curve efficiently.',
        ]}
      />

      <List paddingLeft={16} items={['Adding more KDX to your stake, will simply increase your waiting time proportionally']} />

      <Label>Waiting Time Formula: </Label>

      <EquationContainer>
        <Equation className="equation" value="w = (60*n + r*p)/(n+p)" />
      </EquationContainer>

      <Label>where:</Label>

      <List
        listType="circle"
        items={[
          'w denotes waiting time adjustment when adding more stake;',
          'r is the previous waiting time (user position in the penalty curve);',
          'p is the previous staked amount',
          'n is the newly staked amount.',
        ]}
      />
    </FlexContainer>
  );
};

export default UnstakeInfo;
