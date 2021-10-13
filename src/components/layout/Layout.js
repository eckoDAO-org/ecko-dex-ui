import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import Wrapper from "../../shared/Wrapper";
import CustomParticles from "./CustomParticles";
import DesktopHeader from "./header/DesktopHeader";
import MobileHeader from "./header/MobileHeader";
import { ReactComponent as Stripes } from "../../assets/images/shared/stripes.svg";
import GameEditionContainer from "../game-edition/GameEditionContainer";
import { useHistory } from "react-router";
import { ROUTE_GAME_EDITION_MENU, ROUTE_SWAP } from "../../router/routes";
import { GameEditionContext } from "../../contexts/GameEditionContext";

const MainContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const WrapperContainer = styled(Wrapper)`
  height: 100%;
  padding: 0 7.5em;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    padding: 0 1.5em;
  }
`;

const MainContent = styled.div`
  height: ${({ theme: { header } }) => `calc(100% - ${header.height}px)`};
  & > div:first-child {
    height: ${({ theme: { header } }) => `calc(100% - ${header.height}px)`};
  }
`;

const StripesContainer = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0;
  line-height: 0;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    display: none;
  }
`;

const Layout = ({ children }) => {
const history = useHistory()
const game = useContext(GameEditionContext)

  useEffect(()=>{
    game.gameEditionView? history.push(ROUTE_GAME_EDITION_MENU) : history.push(ROUTE_SWAP)
  },[game.gameEditionView])
  
  return (
    <MainContainer>
      <CustomParticles />
      <WrapperContainer>
        <MobileHeader className="desktop-none"/>
        <DesktopHeader className="mobile-none" gameEditionView={game.gameEditionView}/>
        {game.gameEditionView ? (
        <GameEditionContainer>
          {children}
        </GameEditionContainer>
        )
        :
         <MainContent>{children}</MainContent>}
       
      </WrapperContainer>
      <StripesContainer>
        <Stripes />
      </StripesContainer>
    </MainContainer>
  );
};

export default Layout;
