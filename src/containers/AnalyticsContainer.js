/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import useLazyImage from '../hooks/useLazyImage';
import { usePactContext, useGameEditionContext } from '../contexts';
import modalBackground from '../assets/images/game-edition/modal-background.png';
import { reduceBalance } from '../utils/reduceBalance';
import LogoLoader from '../components/shared/Loader';
import { FlexContainer } from '../components/shared/FlexContainer';
import Label from '../components/shared/Label';
import Banner from '../components/layout/header/Banner';
import InfoPopup from '../components/shared/InfoPopup';
import { getCoingeckoUsdPrice } from '../api/coingecko';
import { getKDXSupply, getKDXTotalSupply, getKDXTotalBurnt } from '../api/kaddex.kdx';
import { getPoolState } from '../api/kaddex.staking';
import theme from '../styles/theme';
import { useHistory, useLocation } from 'react-router-dom';
import { ROUTE_ANALYTICS, ROUTE_ANALYTICS_KDX, ROUTE_ANALYTICS_STATS } from '../router/routes';
import Dex from '../components/analytics/Dex';
import Kdx from '../components/analytics/Kdx';
import StatsTable from '../components/analytics/StatsTable';
import { isMainnet, KDX_TOTAL_SUPPLY } from '../constants/contextConstants';

export const FIXED_SUPPLY = 200577508;
export const FIXED_BURNT = 99422492;

const AnalyticsContainer = () => {
  const { pathname } = useLocation();
  const history = useHistory();

  const pact = usePactContext();
  const [kdaPrice, setKdaPrice] = useState(null);
  const [kdxSupply, setKdxSupply] = useState(null);
  const [kdxBurnt, setKdxBurnt] = useState(null);
  const [, /*kdxTreasury*/ setKdxTreasury] = useState(null);
  const [, /* kdxRewards */ setKdxRewards] = useState(null);
  const [poolState, setPoolState] = useState(null);
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
      getPoolState().then((res) => {
        setPoolState(res);
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
        className="column w-100 main"
        gap={24}
        desktopStyle={{ paddingRight: theme.layout.desktopPadding, paddingLeft: theme.layout.desktopPadding }}
        tabletStyle={{ paddingRight: theme.layout.tabletPadding, paddingLeft: theme.layout.tabletPadding }}
        mobileStyle={{ paddingRight: theme.layout.mobilePadding, paddingLeft: theme.layout.mobilePadding }}
      >
        <Banner
          position="unset"
          text={`The information displayed on this page is currently under BETA testing, and is provided on an "as is" and "as available" basis`}
        />
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

          <InfoPopup type="modal" title="Analytics data info">
            <Label>
              The information displayed on this page is currently under BETA testing, and is provided on an "as is" and "as available" basis
            </Label>
          </InfoPopup>
        </div>
        {/* DEX */}
        {pathname === ROUTE_ANALYTICS && <Dex kdxSupply={kdxSupply} kdaPrice={kdaPrice} poolState={poolState} />}
        {/* KDX */}
        {pathname === ROUTE_ANALYTICS_KDX && (
          <Kdx
            KDX_TOTAL_SUPPLY={KDX_TOTAL_SUPPLY}
            kdxSupply={isMainnet() ? kdxSupply : FIXED_SUPPLY}
            kdaPrice={kdaPrice}
            kdxBurnt={isMainnet() ? kdxBurnt : FIXED_BURNT}
          />
        )}
        {/* DEX */}
        {pathname === ROUTE_ANALYTICS_STATS && <StatsTable />}
      </FlexContainer>
    )
  );
};

export default AnalyticsContainer;
