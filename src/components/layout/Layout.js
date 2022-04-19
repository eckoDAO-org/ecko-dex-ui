/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import styled, { css } from 'styled-components/macro';
import { useHistory, useLocation } from 'react-router';
import useWindowSize from '../../hooks/useWindowSize';
import { useAccountContext, useApplicationContext } from '../../contexts';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import DesktopHeader from './header/DesktopHeader';
import MobileHeader from './header/MobileHeader';
import { ReactComponent as Stripes } from '../../assets/images/shared/stripes.svg';
import GameEditionContainer from '../game-edition-v2/GameEditionContainer';
import { ROUTE_GAME_EDITION_MENU, ROUTE_GAME_START_ANIMATION, ROUTE_INDEX, ROUTE_STATS } from '../../router/routes';
import browserDetection from '../../utils/browserDetection';
import gameEditionBackground from '../../assets/images/game-edition/game-edition-background.png';
import TabletHeader from './header/TabletHeader';
import { FlexContainer } from '../shared/FlexContainer';
import theme from '../../styles/theme';
import Banner from './header/Banner';

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

const MainContent = styled.div`
  ${({ resolutionConfiguration }) => {
    if (resolutionConfiguration) {
      //const browser = browserDetection();
      // switch (browser) {
      //   case 'CHROME':
      //     return css`
      //       zoom: ${({ resolutionConfiguration }) => resolutionConfiguration['normal-mode'].scale};
      //     `;
      //   case 'FIREFOX':
      //     return css`
      //       & > :first-child {
      //         -ms-zoom: ${({ resolutionConfiguration }) => resolutionConfiguration['normal-mode'].scale};
      //         -webkit-zoom: ${({ resolutionConfiguration }) => resolutionConfiguration['normal-mode'].scale};
      //         -moz-transform: ${({ resolutionConfiguration }) => `scale(${resolutionConfiguration['normal-mode'].scale})`};
      //         -moz-transform-origin: center;
      //       }
      //     `;
      //   default:
      //     return css`
      //       transform: ${({ resolutionConfiguration }) => `scale(${resolutionConfiguration['normal-mode'].scale})`};
      //     `;
      // }
    }
  }}
  display: flex;
  align-items: center;
  height: ${({ theme: { header } }) => `calc(100% - ${header.height}px)`};
  ${() => {
    if (browserDetection() === 'FIREFOX') {
      return css`
        height: 99%;
      `;
    }
  }}

  @media (max-height: 550px) {
    /* padding-bottom: 40px; */

    display: block;
  }
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel}px`}) {
    padding: 0 24px;
    height: ${({ theme: { header } }) => `calc(100% - ${header.mobileHeight}px)`};
    overflow-x: auto;
    ::-webkit-scrollbar {
      display: none;
    }

    scrollbar-width: none;
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel - 1}px`}) {
    padding: 0 16px;
  }
  overflow: auto;
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
  const { gameEditionView, setGameEditionView } = useContext(GameEditionContext);
  const { resolutionConfiguration } = useApplicationContext();

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
        {!account.account && !gameEditionView && <Banner />}
        {gameEditionView && resolutionConfiguration && width >= resolutionConfiguration.width && height >= resolutionConfiguration.height ? (
          <>
            <CenterBackground src={gameEditionBackground} alt="" />
            <GameEditionContainer>{children}</GameEditionContainer>
          </>
        ) : (
          <MainContent resolutionConfiguration={resolutionConfiguration}>{children}</MainContent>
        )}
      </WrapperContainer>
      <StripesContainer>
        <Stripes />
      </StripesContainer>
    </FlexContainer>
  );
};

export default Layout;
