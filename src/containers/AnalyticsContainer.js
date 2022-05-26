/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import useLazyImage from '../hooks/useLazyImage';
import { usePactContext, useGameEditionContext } from '../contexts';
import modalBackground from '../assets/images/game-edition/modal-background.png';
import { reduceBalance } from '../utils/reduceBalance';
import LogoLoader from '../components/shared/Loader';
import { FlexContainer } from '../components/shared/FlexContainer';
import Label from '../components/shared/Label';
import InfoPopup from '../components/shared/InfoPopup';
import { getCoingeckoUsdPrice } from '../api/coingecko';
import { getKDXSupply, getKDXTotalSupply, getKDXTotalBurnt } from '../api/kaddex.kdx';
import theme from '../styles/theme';
import { useHistory, useLocation } from 'react-router-dom';
import { ROUTE_ANALYTICS, ROUTE_ANALYTICS_KDX, ROUTE_ANALYTICS_STATS } from '../router/routes';
import Dex from '../components/analytics/Dex';
import Kdx from '../components/analytics/Kdx';
import StatsTable from '../components/analytics/StatsTable';

const KDX_TOTAL_SUPPLY = 1000000000;

const AnalyticsContainer = () => {
  const { pathname } = useLocation();
  const history = useHistory();
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
        <div className="flex align-ce justify-sb">
          <FlexContainer className="align-ce" gap={16} mobileStyle={{ marginBottom: 16 }}>
            <Label
              withShade={pathname !== ROUTE_ANALYTICS}
              className="pointer"
              fontSize={24}
              fontFamily="syncopate"
              onClick={() => history.push(ROUTE_ANALYTICS)}
            >
              DEX
            </Label>
            <Label
              withShade={pathname !== ROUTE_ANALYTICS_KDX}
              className="pointer"
              fontSize={24}
              fontFamily="syncopate"
              onClick={() => history.push(ROUTE_ANALYTICS_KDX)}
            >
              KDX
            </Label>
            <Label
              withShade={pathname !== ROUTE_ANALYTICS_STATS}
              className="pointer"
              fontSize={24}
              fontFamily="syncopate"
              onClick={() => history.push(ROUTE_ANALYTICS_STATS)}
            >
              STATS
            </Label>
          </FlexContainer>

          <InfoPopup size={16} type="modal" title="Analytics data info">
            <Label>
              The information displayed on this page is currently under BETA testing, and is provided on an "as is" and "as available" basis
            </Label>
          </InfoPopup>
        </div>
        {/* DEX */}
        {pathname === ROUTE_ANALYTICS && <Dex kdaPrice={kdaPrice} />}
        {/* KDX */}
        {pathname === ROUTE_ANALYTICS_KDX && (
          <Kdx KDX_TOTAL_SUPPLY={KDX_TOTAL_SUPPLY} kdxSupply={kdxSupply} kdaPrice={kdaPrice} kdxBurnt={kdxBurnt} />
        )}
        {/* DEX */}
        {pathname === ROUTE_ANALYTICS_STATS && <StatsTable />}
        {/* <FlexContainer mobileClassName="column" gap={24}>
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
        <VestingScheduleChart height={300} /> */}
      </FlexContainer>
    )
  );
};

export default AnalyticsContainer;
