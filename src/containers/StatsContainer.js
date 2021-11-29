/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { PactContext } from '../contexts/PactContext';
import StatsTab from '../components/stats/StatsTab';
import HistoryTab from '../components/stats/HistoryTab';

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
