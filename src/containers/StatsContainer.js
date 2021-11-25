import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { PactContext } from '../contexts/PactContext';
import CustomButton from '../shared/CustomButton';
import StatsTab from '../components/stats/StatsTab';
import SwapHistoryTab from '../components/stats/SwapHistoryTab';
import HistoryTab from '../components/stats/HistoryTab';

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const StatsContainer = () => {
  const pact = useContext(PactContext);
  const [activeTabs, setActiveTabs] = useState('POOL_STATS');

  useEffect(async () => {
    await pact.getPairList();
  }, []);

  return (
    //MOBILE
    // <Container>
    //   <ButtonContainer>
    //     <CustomButton
    //       onClick={() => {
    //         setactiveTabs("POOL_STATS");
    //       }}
    //     >
    //       Pool Stats
    //     </CustomButton>
    //     <CustomButton
    //       onClick={() => {
    //         setactiveTabs("SWAP_HISTORY");
    //       }}
    //     >
    //       Swap History
    //     </CustomButton>
    //   </ButtonContainer>
    activeTabs === 'POOL_STATS' ? (
      <StatsTab activeTabs={activeTabs} setActiveTabs={() => setActiveTabs('HISTORY')} />
    ) : (
      <HistoryTab activeTabs={activeTabs} setActiveTabs={() => setActiveTabs('POOL_STATS')} />
    )
  );
};

export default StatsContainer;
