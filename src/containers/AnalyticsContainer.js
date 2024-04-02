/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import useLazyImage from '../hooks/useLazyImage';
import { useApplicationContext, useGameEditionContext, usePactContext } from '../contexts';
import modalBackground from '../assets/images/game-edition/modal-background.png';
import LogoLoader from '../components/shared/Loader';
import { FlexContainer } from '../components/shared/FlexContainer';
import Label from '../components/shared/Label';
import Banner from '../components/layout/header/Banner';
import InfoPopup from '../components/shared/InfoPopup';
import { getPoolState } from '../api/kaddex.staking';
import { theme, commonColors } from '../styles/theme';
import { useHistory, useLocation } from 'react-router-dom';
import { ROUTE_ANALYTICS, ROUTE_ANALYTICS_KDX, ROUTE_ANALYTICS_STATS } from '../router/routes';
import Dex from '../components/analytics/Dex';
import Kdx from '../components/analytics/Kdx';
import { KDX_TOTAL_SUPPLY } from '../constants/contextConstants';
import { getAnalyticsData } from '../api/kaddex-analytics';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { VerifiedBoldLogo } from '../assets';
import CustomButton from '../components/shared/CustomButton';
import styled from 'styled-components';
import Pools from '../components/analytics/Pools';

export const FIXED_SUPPLY = 200577508;
export const FIXED_BURNT = 99422492;

const AnalyticsContainer = () => {
  const { pathname } = useLocation();
  const history = useHistory();
  const [analyticsData, setAnalyticsData] = useState({});
  const [poolState, setPoolState] = useState(null);
  const { gameEditionView } = useGameEditionContext();
  const { themeMode } = useApplicationContext();
  const { kdaUsdPrice } = usePactContext();
  const [verifiedActive, setVerifiedActive] = useState(true);

  useEffect(() => {
    const getInitialData = async () => {
      if (kdaUsdPrice) {
        getPoolState().then((res) => {
          setPoolState(res);
        });
        getAnalyticsData(moment().subtract(1, 'day').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')).then((res) => {
          if (res) {
            setAnalyticsData(res[res.length - 1]);
          }
        });
      }
    };
    getInitialData();
  }, [kdaUsdPrice]);

  const [loaded] = useLazyImage([modalBackground]);
  return !loaded && gameEditionView ? (
    <LogoLoader />
  ) : (
    !gameEditionView && (
      <>
        {pathname !== ROUTE_ANALYTICS_STATS && (
          <Banner
            position="unset"
            text={`The information displayed on this page is currently under BETA testing, and is provided on an "as is" and "as available" basis.`}
          />
        )}
        <Helmet>
          <meta
            name="description"
            content="Stay informed on eckoDEX stats and $KDX token with our analytics section. Track ecko-growth and stay ahead of the game."
          />
          <title>eckoDEX | Analytics</title>
        </Helmet>
        <FlexContainer
          className="column w-100 h-100 main"
          gap={24}
          desktopStyle={{ paddingRight: theme().layout.desktopPadding, paddingLeft: theme().layout.desktopPadding }}
          tabletStyle={{ paddingRight: theme().layout.tabletPadding, paddingLeft: theme().layout.tabletPadding }}
          mobileStyle={{ paddingRight: theme().layout.mobilePadding, paddingLeft: theme().layout.mobilePadding }}
        >
          <FlexContainer className="flex align-ce justify-sb" mobileStyle={{ alignItems: 'flex-start' }} mobileClassName="column">
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

            <FlexContainer className="align-ce">
              {pathname === ROUTE_ANALYTICS_STATS && (
                <CustomButton
                  fontSize={13}
                  buttonStyle={{ height: 33 }}
                  type={verifiedActive ? 'secondary' : 'primary'}
                  fontFamily="syncopate"
                  onClick={() => {
                    if (verifiedActive) {
                      setVerifiedActive(false);
                    } else {
                      setVerifiedActive(true);
                    }
                  }}
                >
                  <ButtonContent color={commonColors.white}>
                    <VerifiedBoldLogo className={verifiedActive ? 'svg-app-inverted-color' : 'svg-app-color'} />
                    <Label
                      fontFamily="syncopate"
                      color={verifiedActive ? theme(themeMode).colors.primary : theme(themeMode).colors.white}
                      labelStyle={{ marginTop: 1 }}
                    >
                      VERIFIED
                    </Label>
                  </ButtonContent>
                </CustomButton>
              )}

              <InfoPopup type="modal" title="Analytics data info">
                <Label>
                  The information displayed on this page is currently under BETA testing, and is provided on an "as is" and "as available" basis.
                </Label>
              </InfoPopup>
            </FlexContainer>
          </FlexContainer>
          {/* DEX */}
          {pathname === ROUTE_ANALYTICS && (
            <Dex kdxSupply={analyticsData?.circulatingSupply?.totalSupply} kdaPrice={kdaUsdPrice} poolState={poolState} />
          )}
          {/* KDX */}
          {pathname === ROUTE_ANALYTICS_KDX && <Kdx analyticsData={analyticsData} KDX_TOTAL_SUPPLY={KDX_TOTAL_SUPPLY} kdaPrice={kdaUsdPrice} />}
          {/* DEX */}
          {pathname === ROUTE_ANALYTICS_STATS && <Pools verifiedActive={verifiedActive} />}
        </FlexContainer>
      </>
    )
  );
};

export default AnalyticsContainer;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 8px;
    path {
      fill: ${({ color }) => color};
    }
  }
`;
