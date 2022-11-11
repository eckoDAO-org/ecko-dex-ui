/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useHistory, useLocation } from 'react-router';
import useWindowSize from '../../hooks/useWindowSize';
import { useAccountContext, useApplicationContext, useGameEditionContext, usePactContext } from '../../contexts';
import { ReactComponent as Stripes } from '../../assets/images/shared/stripes.svg';
import { ROUTE_GAME_EDITION_MENU, ROUTE_GAME_START_ANIMATION, ROUTE_INDEX, ROUTE_STATS } from '../../router/routes';
import browserDetection from '../../utils/browserDetection';
import theme from '../../styles/theme';
import { isMainnet } from '../../constants/contextConstants';
import AppLoader from '../shared/AppLoader';
import { lazy } from 'react';
import { Suspense } from 'react';
import { lazily } from 'react-lazily';

const DesktopHeader = lazy(() => import(/* webpackChunkName: "desktopHeader" */ './header/DesktopHeader'));
const MobileHeader = lazy(() => import(/* webpackChunkName: "MobileHeader" */ './header/MobileHeader'));
const TabletHeader = lazy(() => import(/* webpackChunkName: "TabletHeader" */ './header/TabletHeader'));
const { FlexContainer } = lazily(() => import(/* webpackChunkName: "FlexContainer" */ '../shared/FlexContainer'));
const FooterPolicy = lazy(() => import(/* webpackChunkName: "footer-Policy" */ './FooterPolicy'));
const Banner = lazy(() => import(/* webpackChunkName: "footer-Policy" */ './header/Banner'));

const GameEditionContainer = lazy(() => import(/* webpackChunkName: "GameEditionContainer" */ '../game-edition-v2/GameEditionContainer'));
const gameEditionBackground = lazy(() =>
  import(/* webpackChunkName: "GEBackground" */ '../../assets/images/game-edition/game-edition-background.webp')
);

const WrapperContainer = styled.div`
  flex-direction: column;
  display: flex;
  height: 100%;

  .mainnet-chain-2 {
    font-size: 14px;
    text-align: center;
    @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
      padding-top: 20px;
    }
  }
`;

const CenterBackground = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  z-index: 0;
  animation: fade-in 0.5s linear;
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const StripesContainer = styled.div`
  position: absolute;
  bottom: ${browserDetection() === 'SAFARI' ? '4px' : '0px'};
  left: 0;
  line-height: 0;
  z-index: -1;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
    display: none;
  }
`;

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const [width, height] = useWindowSize();
  const { account } = useAccountContext();
  const { gameEditionView, setGameEditionView } = useGameEditionContext();
  const { resolutionConfiguration } = useApplicationContext();
  const pact = usePactContext();

  useEffect(() => {
    if (gameEditionView) {
      history.push(ROUTE_GAME_START_ANIMATION);
    } else if (pathname === ROUTE_GAME_EDITION_MENU || pathname === ROUTE_GAME_START_ANIMATION || pathname === ROUTE_STATS) {
      history.push(ROUTE_INDEX);
    }
  }, [gameEditionView]);

  useEffect(() => {
    if (!resolutionConfiguration || (gameEditionView && (width < resolutionConfiguration.width || height < resolutionConfiguration.heigt))) {
      setGameEditionView(false);
    }
  }, [gameEditionView, width, height, resolutionConfiguration]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FlexContainer className="w-100 h-100">
        <WrapperContainer>
          {width <= theme.mediaQueries.mobilePixel && <MobileHeader />}
          {width > theme.mediaQueries.mobilePixel && width < theme.mediaQueries.desktopPixel && <TabletHeader />}
          {width >= theme.mediaQueries.desktopPixel && <DesktopHeader gameEditionView={gameEditionView} />}
          {!account.account && !gameEditionView && !isMainnet() && <Banner />}
          {gameEditionView && resolutionConfiguration && width >= resolutionConfiguration.width && height >= resolutionConfiguration.height ? (
            <>
              <CenterBackground rel="preload" src={gameEditionBackground} alt="" />
              <GameEditionContainer>{children}</GameEditionContainer>
            </>
          ) : pact.allTokens ? (
            <div className="h-100 y-auto hide-scrollbar">{children}</div>
          ) : (
            <AppLoader containerStyle={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
          )}
        </WrapperContainer>
        <StripesContainer>
          <Stripes style={{ width: '45%', height: '45%' }} />
        </StripesContainer>
        {!gameEditionView && pathname === ROUTE_INDEX && <FooterPolicy />}
      </FlexContainer>
    </Suspense>
  );
};

export default Layout;
