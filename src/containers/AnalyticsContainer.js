/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import useLazyImage from '../hooks/useLazyImage';
import { PactContext } from '../contexts/PactContext';
import { GameEditionContext } from '../contexts/GameEditionContext';
import VolumeChart from '../components/charts/VolumeChart';
import TVLChart from '../components/charts/TVLChart';
import VestingScheduleChart from '../components/charts/VestingScheduleChart';
import modalBackground from '../assets/images/game-edition/modal-background.png';
import { FadeIn } from '../components/shared/animations';
import LogoLoader from '../components/shared/Loader';
import { FlexContainer } from '../components/shared/FlexContainer';

const Container = styled(FadeIn)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;

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
      <Container>
        <FlexContainer className="column" gap={24} style={{ padding: '50px 0' }}>
          <FlexContainer gap={24}>
            <TVLChart width={480} height={300} />

            <VolumeChart width={480} height={300} />
          </FlexContainer>
          <VestingScheduleChart />
        </FlexContainer>
      </Container>
    )
  );
};

export default AnalyticsContainer;
