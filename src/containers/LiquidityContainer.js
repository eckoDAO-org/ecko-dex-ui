import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import { AddLiquidityLogo, BoosterIcon, LiquidityDollarLogo, VerifiedBoldLogo } from '../assets';
import LiquidityMyLiquidityTable from '../components/liquidity/LiquidityMyLiquidityTable';
import LiquidityPoolsTable from '../components/liquidity/LiquidityPoolsTable';
import LiquidityRewardsTable from '../components/liquidity/LiquidityRewardsTable';
import LiquidityTablesInfo from '../components/liquidity/LiquidityTablesInfo';
import LiquidityTokensTable from '../components/liquidity/LiquidityTokensTable';
import CustomButton from '../components/shared/CustomButton';
import CustomPopup from '../components/shared/CustomPopup';
import { FlexContainer } from '../components/shared/FlexContainer';
import InfoPopup from '../components/shared/InfoPopup';
import Label from '../components/shared/Label';
import { useApplicationContext } from '../contexts';
import useWindowSize from '../hooks/useWindowSize';
import {
  ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED,
  ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED,
  ROUTE_LIQUIDITY_CREATE_PAIR,
  ROUTE_LIQUIDITY_MY_LIQUIDITY,
  ROUTE_LIQUIDITY_POOLS,
  ROUTE_LIQUIDITY_REWARDS,
  ROUTE_LIQUIDITY_TOKENS,
} from '../router/routes';
import { theme, commonColors } from '../styles/theme';

const LiquidityContainer = () => {
  const { pathname } = useLocation();
  const history = useHistory();
  const { themeMode } = useApplicationContext();
  const [width] = useWindowSize();
  const [verifiedActive, setVerifiedActive] = useState(true);

  return (
    <FlexContainer
      className="column w-100 h-100 main"
      desktopStyle={{ paddingRight: theme().layout.desktopPadding, paddingLeft: theme().layout.desktopPadding }}
      tabletStyle={{ paddingRight: theme().layout.tabletPadding, paddingLeft: theme().layout.tabletPadding }}
      mobileStyle={{ paddingRight: theme().layout.mobilePadding, paddingLeft: theme().layout.mobilePadding }}
    >
      <Helmet>
        <meta name="description" content="Earn LP rewards with your digital assets on eckoDEX." />
        <title>eckoDEX | Pools/Liquidity</title>
      </Helmet>
      <FlexContainer
        className="w-100 justify-sb"
        mobileClassName="column"
        tabletClassName="column"
        style={{ marginBottom: 24, flexDirection: width < 1230 && 'column' }}
      >
        <FlexContainer
          className="align-ce"
          gap={16}
          mobileStyle={{ marginBottom: 16 }}
          tabletStyle={{ marginBottom: 16 }}
          style={{ marginBottom: width < 1230 && '16px' }}
        >
          <Label
            withShade={pathname !== ROUTE_LIQUIDITY_TOKENS}
            className="pointer"
            fontSize={24}
            fontFamily="syncopate"
            onClick={() => history.push(ROUTE_LIQUIDITY_TOKENS)}
          >
            TOKENS
          </Label>
          <Label
            withShade={pathname !== ROUTE_LIQUIDITY_POOLS}
            className="pointer"
            fontSize={24}
            fontFamily="syncopate"
            onClick={() => history.push(ROUTE_LIQUIDITY_POOLS)}
          >
            POOLS
          </Label>
          {(pathname === ROUTE_LIQUIDITY_TOKENS || pathname === ROUTE_LIQUIDITY_POOLS) && (
            <InfoPopup type="modal" title="Liquidity" containerStyle={{ marginLeft: 0 }}>
              <LiquidityTablesInfo pathname={pathname} />
            </InfoPopup>
          )}
        </FlexContainer>
        {width <= theme().mediaQueries.mobilePixel ? (
          /* MOBILE */

          <FlexContainer className="justify-sb" gap={16} mobilePixel={530}>
            <FlexContainer gap={16}>
              {(pathname === ROUTE_LIQUIDITY_TOKENS || pathname === ROUTE_LIQUIDITY_POOLS) && (
                <MobileButton
                  background={verifiedActive ? theme(themeMode).colors.white : 'transparent'}
                  color={theme(themeMode).colors.white}
                  onClick={() => {
                    if (verifiedActive) {
                      setVerifiedActive(false);
                    } else {
                      setVerifiedActive(true);
                    }
                  }}
                >
                  <VerifiedBoldLogo className={verifiedActive ? 'svg-app-inverted-color' : 'svg-app-color'} />
                </MobileButton>
              )}
              <MobileButton
                background={pathname === ROUTE_LIQUIDITY_REWARDS ? commonColors.pink : 'transparent'}
                color={commonColors.pink}
                onClick={() => history.push(ROUTE_LIQUIDITY_REWARDS)}
              >
                <BoosterIcon className={pathname === ROUTE_LIQUIDITY_REWARDS ? 'svg-app-color' : ''} />
              </MobileButton>
              <MobileButton
                background={pathname === ROUTE_LIQUIDITY_MY_LIQUIDITY ? theme(themeMode).colors.white : 'transparent'}
                color={theme(themeMode).colors.white}
                onClick={() => history.push(ROUTE_LIQUIDITY_MY_LIQUIDITY)}
              >
                <LiquidityDollarLogo className={pathname === ROUTE_LIQUIDITY_MY_LIQUIDITY ? 'svg-app-inverted-color' : 'svg-app-color'} />
              </MobileButton>
              <MobileButton
                color={theme(themeMode).colors.white}
                onClick={() =>
                  history.push(
                    pathname === ROUTE_LIQUIDITY_TOKENS ? ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED : ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED,
                    { from: pathname }
                  )
                }
              >
                <AddLiquidityLogo />
              </MobileButton>
            </FlexContainer>
            {pathname === ROUTE_LIQUIDITY_POOLS && (
              <CustomButton
                fontSize={13}
                buttonStyle={{ height: 33, width: 'min-content', padding: '0px 16px' }}
                type="primary"
                fontFamily="syncopate"
                onClick={() => history.push(ROUTE_LIQUIDITY_CREATE_PAIR)}
              >
                CREATE PAIR
              </CustomButton>
            )}
          </FlexContainer>
        ) : (
          /* DESKTOP & TABLET */

          <FlexContainer gap={16} mobilePixel={530}>
            {(pathname === ROUTE_LIQUIDITY_TOKENS || pathname === ROUTE_LIQUIDITY_POOLS) && (
              <CustomPopup
                offset={[-50, -130]}
                popupStyle={{ padding: 2 }}
                trigger={
                  <div style={{ display: 'flex' }}>
                    <MobileButton
                      background={verifiedActive ? theme(themeMode).colors.white : 'transparent'}
                      color={theme(themeMode).colors.white}
                      onClick={() => {
                        if (verifiedActive) {
                          setVerifiedActive(false);
                        } else {
                          setVerifiedActive(true);
                        }
                      }}
                    >
                      <VerifiedBoldLogo className={verifiedActive ? 'svg-app-inverted-color' : 'svg-app-color'} />
                    </MobileButton>
                  </div>
                }
              >
                <Label labelStyle={{ maxWidth: verifiedActive ? '150px' : '180px' }}>
                  {verifiedActive
                    ? `Click to display unverified ${pathname === ROUTE_LIQUIDITY_TOKENS ? 'tokens' : 'pools'}.`
                    : `Click to display only verified ${pathname === ROUTE_LIQUIDITY_TOKENS ? 'tokens' : 'pools'}.`}
                </Label>
              </CustomPopup>
            )}
            <CustomButton
              fontSize={13}
              buttonStyle={{ height: 33 }}
              type="basic"
              /*  color={commonColors.pink} */
              onClick={() => history.push(ROUTE_LIQUIDITY_REWARDS)}
            >
              <ButtonContent active={pathname === ROUTE_LIQUIDITY_REWARDS} color={commonColors.pink}>
                <BoosterIcon />
                <Label fontFamily="syncopate" color={commonColors.pink} labelStyle={{ marginTop: 1 }}>
                  REWARDS
                </Label>
              </ButtonContent>
            </CustomButton>
            <CustomButton
              fontSize={13}
              buttonStyle={{ height: 33 }}
              type="basic"
              fontFamily="syncopate"
              onClick={() => history.push(ROUTE_LIQUIDITY_MY_LIQUIDITY)}
            >
              <ButtonContent active={pathname === ROUTE_LIQUIDITY_MY_LIQUIDITY} color={theme(themeMode).colors.white}>
                <LiquidityDollarLogo className={'svg-app-color'} />
                <Label fontFamily="syncopate" color={theme(themeMode).colors.white} labelStyle={{ marginTop: 1 }}>
                  MY LIQUIDITY
                </Label>
              </ButtonContent>
            </CustomButton>

            <CustomButton
              fontSize={13}
              buttonStyle={{ height: 33 }}
              type="primary"
              fontFamily="syncopate"
              onClick={() =>
                history.push(
                  pathname === ROUTE_LIQUIDITY_TOKENS ? ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED : ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED,
                  { from: pathname }
                )
              }
            >
              ADD LIQUIDITY
            </CustomButton>

            {pathname === ROUTE_LIQUIDITY_POOLS && (
              <CustomButton
                fontSize={13}
                buttonStyle={{ height: 33 }}
                type="secondary"
                fontFamily="syncopate"
                onClick={() => history.push(ROUTE_LIQUIDITY_CREATE_PAIR)}
              >
                CREATE PAIR
              </CustomButton>
            )}
          </FlexContainer>
        )}
      </FlexContainer>
      {/* SINGLE SIDE TABLE */}
      {pathname === ROUTE_LIQUIDITY_TOKENS && <LiquidityTokensTable verifiedActive={verifiedActive} />}
      {/* DOUBLE SIDE TABLE */}
      {pathname === ROUTE_LIQUIDITY_POOLS && <LiquidityPoolsTable verifiedActive={verifiedActive} />}
      {/* MY LIQUIDITY TABLE */}
      {pathname === ROUTE_LIQUIDITY_MY_LIQUIDITY && <LiquidityMyLiquidityTable />}
      {/* MY LIQUIDITY TABLE */}
      {pathname === ROUTE_LIQUIDITY_REWARDS && <LiquidityRewardsTable />}
    </FlexContainer>
  );
};

export default LiquidityContainer;

const ButtonContent = styled.div`
  display: flex;
  align-self: baseline;
  border-top: 8px solid transparent;
  transition: border-bottom 0.5s ease-in-out;
  padding-bottom: 8px;
  border-bottom: ${({ color, active }) => (active ? `1px solid ${color}` : '1px solid transparent')};
  svg {
    margin-right: 8px;
    path {
      fill: ${({ color }) => color};
    }
  }

  &:hover {
    color: ${({ theme: { colors } }) => colors.white};
    transition: border-bottom 0.8s ease-in-out;
    border-bottom: ${({ color }) => `1px solid ${color}`};

    cursor: pointer;
  }
`;

const MobileButton = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border: ${({ color }) => `2px solid ${color}`};
  background-color: ${({ background }) => background};
  border-radius: 50%;
  height: 33px;
  min-width: 33px;
  svg {
    width: 13px !important;
    height: 13px !important;
    path {
      fill: ${({ color }) => color};
    }
  }
`;
