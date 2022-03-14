/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import { PactContext } from '../contexts/PactContext';
import { CardContainer } from '../components/stats/StatsTab';
import styled, { css } from 'styled-components/macro';
import { GameEditionContext } from '../contexts/GameEditionContext';
import VolumeChart from '../components/charts/VolumeChart';
import TVLChart from '../components/charts/TVLChart';
import VestingScheduleChart from '../components/charts/VestingScheduleChart';
import modalBackground from '../assets/images/game-edition/modal-background.png';
import { FadeIn } from '../components/shared/animations';
import useLazyImage from '../hooks/useLazyImage';
import LogoLoader from '../components/shared/Loader';

const ChartsContainer = styled.div`
  display: flex;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SingleChartContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 5px;
`;

const Container = styled(FadeIn)`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* height: 100%; */
  padding: ${({ gameEditionView }) => (gameEditionView ? '16px' : '32px')};
  justify-content: flex-start;
  align-items: center;
  ${({ gameEditionView }) => {
    if (gameEditionView) {
      return css`
        height: 100%;
        display: flex;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image: ${`url(${modalBackground})`};
      `;
    }
  }}
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel}px`}) {
    padding: ${({ gameEditionView }) => !gameEditionView && '32px 11px'};
  }
`;

const AnalyticsContainer = () => {
  const pact = useContext(PactContext);
  const { gameEditionView } = useContext(GameEditionContext);

  useEffect(async () => {
    await pact.getPairList();
  }, []);

  const [loaded] = useLazyImage([modalBackground]);
  return !loaded && gameEditionView ? (
    <LogoLoader />
  ) : (
    !gameEditionView && (
      <Container gameEditionView={gameEditionView}>
        <CardContainer style={{ background: 'transparent' }}>
          <ChartsContainer>
            <SingleChartContainer>
              <TVLChart height={300} />
            </SingleChartContainer>
            <SingleChartContainer>
              <VolumeChart height={300} />
            </SingleChartContainer>
          </ChartsContainer>
          <ChartsContainer style={{ padding: 5, marginTop: 20 }}>
            <VestingScheduleChart height={300} />
          </ChartsContainer>
        </CardContainer>
      </Container>
    )
  );
};

export default AnalyticsContainer;
