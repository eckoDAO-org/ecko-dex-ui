import React from 'react';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router';
import { ROUTE_GAME_EDITION_MENU, ROUTE_SWAP } from '../../router/routes';
import { GameEditionWrapper } from './GameEditionWrapper';
import GameEditionModalsContainer from './GameEditionModalsContainer';
import { FadeIn } from '../components/shared/animations';
import theme from '../../styles/theme';
import GameEditionMobileWrapper from './GameEditionMobileWrapper';
import menuItems from '../menuItems';
import useWindowSize from '../../hooks/useWindowSize';
import { useGameEditionContext } from '../../contexts';

const MainContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  height: ${({ theme: { header } }) => `calc(100% - ${header.height}px)`};
  align-items: center;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: ${({ $radius }) => $radius || 'none'};
  background: rgb(254, 251, 102);
  background: linear-gradient(180deg, rgba(254, 251, 102, 1) 35%, rgba(255, 54, 208, 1) 100%);
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  font-weight: 500;
`;

const GameEditionContainer = ({ children }) => {
  const { modalState, closeModal } = useGameEditionContext();
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

  const [width] = useWindowSize();
  return (
    <MainContainer>
      {width < theme.mediaQueries.desktopPixel ? (
        <GameEditionMobileWrapper
          selectLabel="MENU"
          selectOnClick={() => {
            history.push(ROUTE_GAME_EDITION_MENU);
            closeModal();
          }}
          startLabel="SWAP"
          startOnClick={() => {
            history.push(ROUTE_SWAP);
            // it is used if you want to set the button to swap in Swap and Add Liquidity sections
            // setIsSwapping(true);
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
          style={{ height: 'auto !important' }}
          selectLabel="MENU"
          selectOnClick={() => {
            history.push(ROUTE_GAME_EDITION_MENU);
            closeModal();
          }}
          startLabel="SWAP"
          startOnClick={() => {
            history.push(ROUTE_SWAP);
            // it is used if you want to set the button to swap in Swap and Add Liquidity sections
            // setIsSwapping(true);
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
          <ContentContainer $radius="24px">
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
