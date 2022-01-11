/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { PactContext } from '../contexts/PactContext';
import StatsTab from '../components/stats/StatsTab';
import HistoryTab from '../components/stats/HistoryTab';
import styled from 'styled-components/macro';
import { GameEditionContext } from '../contexts/GameEditionContext';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: ${({ gameEditionView }) => !gameEditionView && '32px'};
  justify-content: flex-start;

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel}px`}) {
    padding: ${({ gameEditionView }) => !gameEditionView && '32px 11px'};
  }
`;

const StatsContainer = () => {
  const pact = useContext(PactContext);
  const { gameEditionView } = useContext(GameEditionContext);
  const [activeTabs, setActiveTabs] = useState('POOL_STATS');

  useEffect(async () => {
    await pact.getPairList();
  }, []);

  return (
    <Container gameEditionView={gameEditionView}>
      {activeTabs === 'POOL_STATS' ? (
        <StatsTab activeTabs={activeTabs} setActiveTabs={() => setActiveTabs('HISTORY')} />
      ) : (
        <HistoryTab activeTabs={activeTabs} setActiveTabs={() => setActiveTabs('POOL_STATS')} />
      )}
    </Container>
  );
};

export default StatsContainer;
