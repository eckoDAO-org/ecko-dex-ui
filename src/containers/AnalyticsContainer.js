/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import useLazyImage from '../hooks/useLazyImage';
import axios from 'axios';
import { usePactContext, useGameEditionContext } from '../contexts';
import VolumeChart from '../components/charts/VolumeChart';
import TVLChart from '../components/charts/TVLChart';
import VestingScheduleChart from '../components/charts/VestingScheduleChart';
import modalBackground from '../assets/images/game-edition/modal-background.png';
import { FadeIn } from '../components/shared/animations';
import { humanReadableNumber } from '../utils/reduceBalance';
import LogoLoader from '../components/shared/Loader';
import { FlexContainer } from '../components/shared/FlexContainer';
import AnalyticsSimpleWidget from '../components/shared/AnalyticsSimpleWidget';
import { getCurrentKdaUSDPrice } from '../api/pact';

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

const KDX_TOTAL_SUPPLY = 1000000000;
// TEMP: get real circulating supply
const CIRCULATING_SUPPLY = KDX_TOTAL_SUPPLY * 0.025;
// const KDX_TOTAL_BURNED_MULT = 0.9121;

const AnalyticsContainer = () => {
  const pact = usePactContext();
  const [kdaPrice, setKdaPrice] = useState(null);
  const { gameEditionView } = useGameEditionContext();

  useEffect(() => {
    const getKdaUSDPrice = async () => {
      const kdaPactPrice = await getCurrentKdaUSDPrice();
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
        <FlexContainer className="column w-100" gap={24} style={{ padding: '50px 0', maxWidth: 1100 }}>
          <FlexContainer mobileClassName="column" gap={24}>
            <AnalyticsSimpleWidget
              title={'KDX price'}
              mainText={`$ ${pact?.kdxPrice || '-'}`}
              subtitle={pact?.kdxPrice && `${(pact?.kdxPrice / kdaPrice).toFixed(4)} KDA`}
            />
            <AnalyticsSimpleWidget
              title={'Marketcap'}
              mainText={`$ ${humanReadableNumber(Number(CIRCULATING_SUPPLY * pact?.kdxPrice))}`}
              subtitle={null}
            />
          </FlexContainer>
          <FlexContainer mobileClassName="column" gap={24}>
            <TVLChart kdaPrice={kdaPrice} height={300} />

            <VolumeChart kdaPrice={kdaPrice} height={300} />
          </FlexContainer>
          <VestingScheduleChart height={300} />
        </FlexContainer>
      </Container>
    )
  );
};

export default AnalyticsContainer;
