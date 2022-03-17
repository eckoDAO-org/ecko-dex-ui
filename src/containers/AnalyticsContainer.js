import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
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
import { humanReadableNUmber } from '../utils/reduceBalance';
import LogoLoader from '../components/shared/Loader';
import AnalyticsSimpleWidget from '../components/shared/AnalyticsSimpleWidget';

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

const KDX_PRICE = 0.16;
const KDX_TOTAL_SUPPLY = 1000000000;

const AnalyticsContainer = () => {
  const pact = useContext(PactContext);
  const [kdaPrice, setKdaPrice] = useState(null);
  const { gameEditionView } = useContext(GameEditionContext);

  useEffect(() => {
    const getKdaUSDPrice = async () => {
      const kdaPactPrice = await pact.getCurrentKdaUSDPrice();
      // TODO: make generic price data
      axios
        .get('https://api.coingecko.com/api/v3/simple/price?ids=kadena&vs_currencies=usd')
        .then((res) => {
          setKdaPrice(res.data?.kadena?.usd ?? kdaPactPrice);
        })
        .catch(async (err) => {
          console.log('fetch kda price err', err);
          setKdaPrice(kdaPactPrice);
        });
    };
    getKdaUSDPrice();
  }, [pact]);

  const [loaded] = useLazyImage([modalBackground]);
  return !loaded && gameEditionView ? (
    <LogoLoader />
  ) : (
    !gameEditionView && (
      <Container gameEditionView={gameEditionView}>
        <CardContainer style={{ background: 'transparent' }}>
          <ChartsContainer>
            <SingleChartContainer>
              <AnalyticsSimpleWidget title={'Kaddex price (KDX)'} mainText={`$ ${KDX_PRICE}`} subtitle={`${(KDX_PRICE / kdaPrice).toFixed(4)} KDA`} />
            </SingleChartContainer>
            <SingleChartContainer>
              <AnalyticsSimpleWidget
                title={'Marketcap'}
                mainText={`$ ${humanReadableNUmber(Number(KDX_TOTAL_SUPPLY * KDX_PRICE))}`}
                subtitle={null}
              />
            </SingleChartContainer>
          </ChartsContainer>
          <ChartsContainer>
            <SingleChartContainer>
              <TVLChart height={300} kdaPrice={kdaPrice} />
            </SingleChartContainer>
            <SingleChartContainer>
              <VolumeChart height={300} kdaPrice={kdaPrice} />
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
