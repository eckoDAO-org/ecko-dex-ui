/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import styled, { css } from 'styled-components/macro';
import Wrapper from '../../components/shared/Wrapper';
import DesktopHeader from './header/DesktopHeader';
import MobileHeader from './header/MobileHeader';
import { ReactComponent as Stripes } from '../../assets/images/shared/stripes.svg';
import GameEditionContainer from '../game-edition-v2/GameEditionContainer';
import { useHistory } from 'react-router';
import { ROUTE_GAME_START_ANIMATION, ROUTE_SWAP } from '../../router/routes';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import browserDetection from '../../utils/browserDetection';
import centerBackground from '../../assets/images/game-edition/center-background.png';
import useWindowSize from '../../hooks/useWindowSize';
import TabletHeader from './header/TabletHeader';
import { useApplicationContext } from '../../contexts';

const MainContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const WrapperContainer = styled(Wrapper)`
  height: 100%;

  .mainnet-chain-2 {
    font-size: 13px;
    text-align: center;
    font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
    color: ${({ theme: { colors } }) => colors.white};
    @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel}px`}) {
      padding-top: 20px;
    }
  }
`;

const MainContent = styled.div`
  ${({ resolutionConfiguration }) => {
    if (resolutionConfiguration) {
      const browser = browserDetection();
      switch (browser) {
        case 'CHROME':
          return css`
            zoom: ${({ resolutionConfiguration }) => resolutionConfiguration['normal-mode'].scale};
          `;
        case 'FIREFOX':
          return css`
            & > :first-child {
              -ms-zoom: ${({ resolutionConfiguration }) => resolutionConfiguration['normal-mode'].scale};
              -webkit-zoom: ${({ resolutionConfiguration }) => resolutionConfiguration['normal-mode'].scale};
              -moz-transform: ${({ resolutionConfiguration }) => `scale(${resolutionConfiguration['normal-mode'].scale})`};
              -moz-transform-origin: center;
            }
          `;
        default:
          return css`
            transform: ${({ resolutionConfiguration }) => `scale(${resolutionConfiguration['normal-mode'].scale})`};
          `;
      }
    }
  }}

  height: 100%;
  ${() => {
    if (browserDetection() === 'FIREFOX') {
      return css`
        height: 99%;
      `;
    }
  }}
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel}px`}) {
    padding: 0 16px;
    height: ${({ theme: { header } }) => `calc(100% - ${header.mobileHeight}px)`};
    overflow-x: auto;
    ::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
`;

const StripesContainer = styled.div`
  position: absolute;
  bottom: ${browserDetection() === 'SAFARI' ? '4px' : '0px'};
  left: 0;
  line-height: 0;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    display: none;
  }
`;

const Layout = ({ children }) => {
  const history = useHistory();
  const [width, height] = useWindowSize();
  const { gameEditionView } = useContext(GameEditionContext);
  const { resolutionConfiguration } = useApplicationContext();

  useEffect(() => {
    gameEditionView ? history.push(ROUTE_GAME_START_ANIMATION) : history.push(ROUTE_SWAP);
  }, [gameEditionView]);

  return (
    <MainContainer>
      <WrapperContainer>
        <div>
          <MobileHeader className="mobile-only" />
          <TabletHeader className="desktop-none mobile-none" />

          <DesktopHeader className="desktop-only" gameEditionView={gameEditionView} />
        </div>
        {gameEditionView && resolutionConfiguration && width >= resolutionConfiguration.width && height >= resolutionConfiguration.height ? (
          <>
            <img src={centerBackground} style={{ position: 'absolute', width: '100%', top: 0, zIndex: -1 }} alt="" />
            <GameEditionContainer>{children}</GameEditionContainer>
          </>
        ) : (
          <MainContent resolutionConfiguration={resolutionConfiguration}>{children}</MainContent>
        )}
      </WrapperContainer>
      <StripesContainer>
        <Stripes />
      </StripesContainer>
    </MainContainer>
  );
};

export default Layout;
