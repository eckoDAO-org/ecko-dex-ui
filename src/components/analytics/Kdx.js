import React from 'react';
import VestingPieChart from '../charts/VestingPieChart';

import VestingScheduleChart from '../charts/VestingScheduleChart';
import { FlexContainer } from '../shared/FlexContainer';

const Kdx = () => {
  return (
    <FlexContainer className="column" gap={16}>
      <VestingScheduleChart height={300} />
      <VestingPieChart />
    </FlexContainer>
  );
};

export default Kdx;
