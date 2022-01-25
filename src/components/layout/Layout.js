/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
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
      padding-top: 10px;
    }
  }
`;

const MainContent = styled.div`
  height: ${({ theme: { header } }) => `calc(100% - ${header.height}px)`};
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel}px`}) {
    padding: 0 16px;
    height: ${({ theme: { header } }) => `calc(100% - ${header.mobileHeight}px)`};
    overflow-x: auto;
    ::-webkit-scrollbar {
      display: none;
    }
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
  const game = useContext(GameEditionContext);

  useEffect(() => {
    game.gameEditionView ? history.push(ROUTE_GAME_START_ANIMATION) : history.push(ROUTE_SWAP);
  }, [game.gameEditionView]);

  return (
    <MainContainer>
      {/* <CustomParticles /> */}
      <WrapperContainer>
        <div>
          <MobileHeader className="desktop-none" />

          <DesktopHeader className="tablet-none" gameEditionView={game.gameEditionView} />
        </div>
        {game.gameEditionView ? (
          <>
            <img src={centerBackground} style={{ position: 'absolute', width: '100%', top: 0, zIndex: -1 }} alt="" />
            <GameEditionContainer>{children}</GameEditionContainer>
          </>
        ) : (
          <MainContent>{children}</MainContent>
        )}
      </WrapperContainer>
      <StripesContainer>
        <Stripes />
      </StripesContainer>
    </MainContainer>
  );
};

export default Layout;
