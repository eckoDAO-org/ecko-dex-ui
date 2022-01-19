/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { PactContext } from '../contexts/PactContext';
import StatsTab from '../components/stats/StatsTab';
import HistoryTab from '../components/stats/HistoryTab';
import styled, { css } from 'styled-components/macro';
import { GameEditionContext } from '../contexts/GameEditionContext';
import ArcadeBackground from '../assets/images/game-edition/arcade-background.png';
import { TitleContainer } from '../components/layout/Containers';
import Label from '../components/shared/Label';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: ${({ gameEditionView }) => (gameEditionView ? '16px' : '32px')};
  justify-content: flex-start;

  ${({ gameEditionView }) => {
    if (gameEditionView) {
      return css`
        height: 100%;
        display: flex;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image: ${`url(${ArcadeBackground})`};
      `;
    }
  }}

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel}px`}) {
    padding: ${({ gameEditionView }) => !gameEditionView && '32px 11px'};
  }
`;

const StatsHistoryContainer = () => {
  const pact = useContext(PactContext);
  const { gameEditionView } = useContext(GameEditionContext);
  const [activeTabs, setActiveTabs] = useState('POOL_STATS');

  useEffect(async () => {
    await pact.getPairList();
  }, []);

  return (
    <Container gameEditionView={gameEditionView}>
      <TitleContainer
        $gameEditionView={gameEditionView}
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '1110px',
          justifyContent: 'space-between',
        }}
      >
        <Label fontSize={32} fontFamily="bold" geFontSize={40} withShade={activeTabs !== 'POOL_STATS'} onClick={() => setActiveTabs('POOL_STATS')}>
          Stats
        </Label>
        <Label fontSize={32} fontFamily="bold" geFontSize={40} withShade={activeTabs !== 'HISTORY'} onClick={() => setActiveTabs('HISTORY')}>
          History
        </Label>
      </TitleContainer>

      {activeTabs === 'POOL_STATS' ? (
        <StatsTab activeTabs={activeTabs} setActiveTabs={setActiveTabs} />
      ) : (
        <HistoryTab activeTabs={activeTabs} setActiveTabs={setActiveTabs} />
      )}
    </Container>
  );
};

export default StatsHistoryContainer;
