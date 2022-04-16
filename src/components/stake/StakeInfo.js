import React from 'react';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import List from '../shared/List';
import { STAKING_REWARDS_PERCENT } from '../../constants/contextConstants';

const StakeInfo = () => {
  return (
    <FlexContainer className="column" gap={16}>
      <Label>The Kaddex Staking tool accomplishes three main purposes:</Label>

      <List
        paddingLeft={16}
        items={[
          `Passive Income Source: stakers receive ${STAKING_REWARDS_PERCENT}% from all swapping fees. Rewards re-staking (“Compounding”) is available once a week from the end of your waiting time.`,
          'Users’ Empowerment: staking allows users to increase their DAO voting Power in a way that values long-term holders over whales.',
          "Deflation of KDX's overall supply: all the penalties coming from early unstaking are constantly burnt.",
        ]}
      />
    </FlexContainer>
  );
};

export default StakeInfo;
