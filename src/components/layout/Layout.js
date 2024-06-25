/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useHistory, useLocation } from 'react-router';
import useWindowSize from '../../hooks/useWindowSize';
import { useAccountContext, useApplicationContext, useGameEditionContext, usePactContext } from '../../contexts';
import DesktopHeader from './header/DesktopHeader';
import MobileHeader from './header/MobileHeader';
import GameEditionContainer from '../game-edition-v2/GameEditionContainer';
import { ROUTE_GAME_EDITION_MENU, ROUTE_GAME_START_ANIMATION, ROUTE_INDEX, ROUTE_STATS } from '../../router/routes';
import gameEditionBackground from '../../assets/images/game-edition/game-edition-background.png';
import TabletHeader from './header/TabletHeader';
import { FlexContainer } from '../shared/FlexContainer';
import theme from '../../styles/theme';
import Banner from './header/Banner';
import FooterPolicy from './FooterPolicy';
import { isMainnet } from '../../constants/contextConstants';
import AppLoader from '../shared/AppLoader';

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
    <FlexContainer className="w-100 h-100">
      <WrapperContainer>
        {width <= theme.mediaQueries.mobilePixel && <MobileHeader />}
        {width > theme.mediaQueries.mobilePixel && width < theme.mediaQueries.desktopPixel && <TabletHeader />}
        {width >= theme.mediaQueries.desktopPixel && <DesktopHeader gameEditionView={gameEditionView} />}
        {!account.account && !gameEditionView && !isMainnet() && <Banner />}
        {gameEditionView && resolutionConfiguration && width >= resolutionConfiguration.width && height >= resolutionConfiguration.height ? (
          <>
            <CenterBackground src={gameEditionBackground} alt="" />
            <GameEditionContainer>{children}</GameEditionContainer>
          </>
        ) : pact.allTokens ? (
          <div className="h-100 y-auto hide-scrollbar">{children}</div>
        ) : (
          <AppLoader containerStyle={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
        )}
      </WrapperContainer>
      {!gameEditionView && pathname === ROUTE_INDEX && <FooterPolicy />}
    </FlexContainer>
  );
};

export default Layout;
