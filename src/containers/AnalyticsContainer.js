/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import useLazyImage from '../hooks/useLazyImage';
import { usePactContext, useGameEditionContext } from '../contexts';
import VolumeChart from '../components/charts/VolumeChart';
import TVLChart from '../components/charts/TVLChart';
import VestingScheduleChart from '../components/charts/VestingScheduleChart';
import modalBackground from '../assets/images/game-edition/modal-background.png';
import { humanReadableNumber, reduceBalance } from '../utils/reduceBalance';
import LogoLoader from '../components/shared/Loader';
import ProgressBar from '../components/shared/ProgressBar';
import { FlexContainer } from '../components/shared/FlexContainer';
import Label from '../components/shared/Label';
import InfoPopup from '../components/shared/InfoPopup';
import AnalyticsSimpleWidget from '../components/shared/AnalyticsSimpleWidget';
import { getCoingeckoUsdPrice } from '../api/coingecko';
import { getKDXSupply, getKDXTotalSupply, getKDXTotalBurnt } from '../api/kaddex.kdx';
import theme from '../styles/theme';

const KDX_TOTAL_SUPPLY = 1000000000;

const AnalyticsContainer = () => {
  const pact = usePactContext();
  const [kdaPrice, setKdaPrice] = useState(null);
  const [kdxSupply, setKdxSupply] = useState(null);
  const [kdxBurnt, setKdxBurnt] = useState(null);
  const [, /*kdxTreasury*/ setKdxTreasury] = useState(null);
  const [kdxRewards, setKdxRewards] = useState(null);
  const { gameEditionView } = useGameEditionContext();

  useEffect(() => {
    const getInitialData = async () => {
      getCoingeckoUsdPrice('kadena')
        .then((kdaPrice) => {
          setKdaPrice(kdaPrice);
        })
        .catch(async (err) => {
          console.log('fetch kda price err', err);
        });
      getKDXTotalSupply().then((supply) => {
        setKdxSupply(reduceBalance(supply, 2));
      });
      getKDXTotalBurnt().then((burnt) => {
        setKdxBurnt(reduceBalance(burnt, 2));
      });
      getKDXSupply('network-rewards').then((reward) => {
        setKdxRewards(reduceBalance(reward, 2));
      });
      getKDXSupply('dao-treasury').then((treasury) => {
        setKdxTreasury(reduceBalance(treasury, 2));
      });
    };
    getInitialData();
  }, [pact]);

  const [loaded] = useLazyImage([modalBackground]);
  return !loaded && gameEditionView ? (
    <LogoLoader />
  ) : (
    !gameEditionView && (
      <FlexContainer
        className="column w-100"
        gap={24}
        style={{ paddingTop: 35, paddingBottom: 35 }}
        desktopStyle={{ paddingRight: theme.layout.desktopPadding, paddingLeft: theme.layout.desktopPadding }}
        tabletStyle={{ paddingRight: theme.layout.tabletPadding, paddingLeft: theme.layout.tabletPadding }}
        mobileStyle={{ paddingRight: theme.layout.mobilePadding, paddingLeft: theme.layout.mobilePadding }}
      >
        <FlexContainer mobileClassName="column" gap={24}>
          <AnalyticsSimpleWidget
            title={'KDX price'}
            mainText={`$ ${pact?.tokensUsdPrice?.KDX || '-'}`}
            subtitle={pact?.tokensUsdPrice?.KDX && `${(pact?.tokensUsdPrice?.KDX / kdaPrice).toFixed(4)} KDA`}
          />
          <AnalyticsSimpleWidget
            title={
              <>
                Marketcap{' '}
                <InfoPopup size={16} type="modal" title="Analytics data info">
                  <Label>
                    The information displayed on this page is currently under BETA testing, and is provided on an "as is" and "as available" basis
                  </Label>
                </InfoPopup>
              </>
            }
            mainText={(kdxSupply && `$ ${humanReadableNumber(Number(kdxSupply * pact?.tokensUsdPrice?.KDX))}`) || '-'}
            subtitle={null}
          />
        </FlexContainer>
        <FlexContainer mobileClassName="column" gap={24}>
          <AnalyticsSimpleWidget
            title={'Circulating supply'}
            mainText={(kdxSupply && `${humanReadableNumber(kdxSupply, 2)} KDX`) || '-'}
            subtitle={
              <div className="w-100 flex" style={{ paddingTop: 10 }}>
                <ProgressBar
                  activeBackground="white"
                  maxValue={KDX_TOTAL_SUPPLY}
                  currentValue={kdxSupply}
                  containerStyle={{ flex: 1, paddingTop: 2 }}
                />
                <span style={{ flex: 2, marginLeft: 20 }}>{((100 * kdxSupply) / KDX_TOTAL_SUPPLY).toFixed(2)} %</span>
              </div>
            }
          />
          <AnalyticsSimpleWidget
            title={'KDX Burned'}
            mainText={(kdxBurnt && `${humanReadableNumber(kdxBurnt, 2)} KDX`) || '-'}
            subtitle={`${((100 * kdxBurnt) / KDX_TOTAL_SUPPLY).toFixed(2)} %`}
          />
        </FlexContainer>
        <FlexContainer mobileClassName="column" gap={24}>
          <AnalyticsSimpleWidget
            title={'KDX Treasury'}
            mainText={`${humanReadableNumber(KDX_TOTAL_SUPPLY * 0.25, 2)} KDX` || '-'}
            subtitle={`${(25).toFixed(2)} %`}
          />
          <AnalyticsSimpleWidget
            title={'KDX Rewards'}
            mainText={`${humanReadableNumber(KDX_TOTAL_SUPPLY * 0.4, 2)} KDX` || '-'}
            subtitle={`${(40).toFixed(2)} %`}
          />
        </FlexContainer>
        <FlexContainer mobileClassName="column" gap={24}>
          <TVLChart kdaPrice={kdaPrice} height={300} />

          <VolumeChart kdaPrice={kdaPrice} height={300} />
        </FlexContainer>
        <VestingScheduleChart height={300} />
      </FlexContainer>
    )
  );
};

export default AnalyticsContainer;
