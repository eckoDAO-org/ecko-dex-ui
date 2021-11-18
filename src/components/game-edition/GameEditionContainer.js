import React, { useContext } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { ROUTE_GAME_EDITION_MENU, ROUTE_SWAP } from '../../router/routes';
import { GameEditionWrapper } from './GameEditionWrapper';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import GameEditionModalsContainer from './GameEditionModalsContainer';
import { FadeIn } from '../shared/animations';
import theme from '../../styles/theme';
import GameEditionMobileWrapper from './GameEditionMobileWrapper';
import menuItems from '../menuItems';

const MainContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 24px;
  background: rgb(254, 251, 102);
  background: linear-gradient(
    180deg,
    rgba(254, 251, 102, 1) 35%,
    rgba(255, 54, 208, 1) 100%
  );
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  font-weight: 500;
  font-size: larger;
`;

const GameEditionContainer = ({ children }) => {
  const { modalState, closeModal, setIsSwapping } =
    useContext(GameEditionContext);
  const history = useHistory();

  const switchAppSection = (direction) => {
    let cur = history.location.pathname;
    if (direction === 'left') {
      let prevPage = menuItems.findIndex((path) => path.route === cur) - 1;
      if (prevPage < 0) history.push(menuItems[menuItems.length - 1].route);
      else return history.push(menuItems[prevPage].route);
    }
    if (direction === 'right') {
      let nextPage = menuItems.findIndex((path) => path.route === cur) + 1;
      if (nextPage > menuItems.length - 1) history.push(menuItems[0]?.route);
      else return history.push(menuItems[nextPage].route);
    }
  };

  // d3.select("#start_button").style("cursor","pointer").on("click",()=>setmessage("I'm swap Button"))
  // d3.select("#select_button").style("cursor","pointer").on("click",()=>setmessage("I'm Menu Button"))
  // d3.select("#left_button").style("cursor","pointer").on("click",()=>setmessage("I'm Left Button"))
  // d3.select("#right_button").style("cursor","pointer").on("click",()=>setmessage("I'm Right Button"))
  // d3.select("#power_button").style("cursor","pointer").on("click",()=>setmessage("I'm Power Button"))
  // d3.select("#a_button").style("cursor","pointer").on("click",()=>setmessage("I'm A Button"))
  // d3.select("#b_button").style("cursor","pointer").on("click",()=>setmessage("I'm B Button"))

  return (
    <MainContainer>
      {window.innerWidth <= theme.mediaQueries.mobilePixel - 1 ? (
        <GameEditionMobileWrapper
          selectLabel='MENU'
          selectOnClick={() => {
            history.push(ROUTE_GAME_EDITION_MENU);
            closeModal();
          }}
          startLabel='SWAP'
          startOnClick={() => {
            setIsSwapping(true);
            closeModal();
          }}
        >
          <ContentContainer>
            {children}
            {modalState.open && (
              <FadeIn>
                <GameEditionModalsContainer
                  title={modalState.title}
                  description={modalState.description}
                  content={modalState.content}
                  onClose={modalState.closeModal}
                />
              </FadeIn>
            )}
          </ContentContainer>
        </GameEditionMobileWrapper>
      ) : (
        <GameEditionWrapper
          selectLabel='MENU'
          selectOnClick={() => {
            history.push(ROUTE_GAME_EDITION_MENU);
            closeModal();
          }}
          startLabel='SWAP'
          startOnClick={() => {
            setIsSwapping(true);
            closeModal();
          }}
          buttonLOnClick={() => {
            switchAppSection('left');
            closeModal();
          }}
          buttonROnClick={() => {
            switchAppSection('right');
            closeModal();
          }}
        >
          <ContentContainer>
            {children}
            {modalState.open && (
              <FadeIn>
                <GameEditionModalsContainer
                  title={modalState.title}
                  description={modalState.description}
                  content={modalState.content}
                  onClose={modalState.closeModal}
                />
              </FadeIn>
            )}
          </ContentContainer>
        </GameEditionWrapper>
      )}
    </MainContainer>
  );
};

export default GameEditionContainer;
