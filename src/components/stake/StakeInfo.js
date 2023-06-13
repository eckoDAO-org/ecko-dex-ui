import React from 'react';
import { Equation } from 'react-equation';
import { Divider } from 'semantic-ui-react';
import { EquationContainer, FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import List from '../shared/List';

const StakeInfo = () => {
  return (
    <FlexContainer className="column" gap={16}>
      <Label>The eckoDEX Governance Mining initiative accomplishes two main purposes:</Label>

      <List
        paddingLeft={16}
        items={[
          'Incentivising governance participation: by offering small rewards, users are incentivised to accrue voting power and interact with proposals.',
          'Empowering users: by increasing their voting power in a new and revolutionary way that values long-term holders over whales.',
        ]}
      />
      <Divider />
      <Label>
        Adding more KDX to your position, will simply increase your waiting time proportionally, and it will also activate a 3% flat penalty fee on any
        unlocked amount for 72hours. Once the 72 hours have passed, you can unlock your tokens normally without paying this penalty.
      </Label>
      <Label>Waiting Time Formula: </Label>
      <EquationContainer>
        <Equation className="equation" value="w = (60*n + r*p)/(n+p)" />
      </EquationContainer>
      <Label>where:</Label>
      <List
        listType="circle"
        items={[
          'w denotes waiting time adjustment when locking more $KDX;',
          'r is the previous waiting time (user position in the penalty curve);',
          'p is the previous locked amount',
          'n is the newly locked amount.',
        ]}
      />
    </FlexContainer>
  );
};

export default StakeInfo;
