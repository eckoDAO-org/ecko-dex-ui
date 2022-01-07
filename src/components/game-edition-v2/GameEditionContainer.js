import React, { useContext } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import menuItems from '../menuItems';
import useWindowSize from '../../hooks/useWindowSize';
import { KaddexLogo } from '../../assets';
import gameboyDesktop from '../../assets/images/game-edition/gameboy-desktop.png';
import gameboyMobile from '../../assets/images/game-edition/gameboy-mobile.png';

const MainContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  height: ${({ theme: { header } }) => `calc(100% - ${header.height}px)`};
  align-items: center;
  overflow: hidden;
`;

const GameEditionConatiner = styled.div`
  background-repeat: no-repeat;
  background-position: center;
  height: 540px;
  width: 930px;
  display: flex;
  align-items: center;
  flex-direction: column;
  .kaddex-logo {
    margin-top: 20px;
    margin-left: 24px;
    svg {
      height: 14.5px;
    }
    @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
      margin-top: 8px;
      svg {
        height: 6px;
      }
    }
  }
  background-image: ${`url(${gameboyDesktop})`};

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
    background-image: ${`url(${gameboyMobile})`};
  }
`;

const GameEditionContent = styled.div`
  width: 440px;
  margin-left: 25px;
  margin-top: 100px;
  height: 329px;
  background: rgba(0, 0, 0, 0.02);
  box-shadow: inset 0px 0px 20px rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 19px;
  & > *:first-child {
    border-radius: 19px;
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
    width: 205px;
    height: 255px;
    margin-left: 8px;
    margin-top: 93px;
    border-radius: 6px;
    & > *:first-child {
      border-radius: 6px;
    }
  }
`;

const GameEditionContainer = ({ children }) => {
  const { modalState, closeModal } = useContext(GameEditionContext);
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
      <GameEditionConatiner>
        <GameEditionContent>{children}</GameEditionContent>
        <div className="kaddex-logo">
          <KaddexLogo />
        </div>
      </GameEditionConatiner>
      {/*     
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
          <>
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
          </>
        </GameEditionWrapper>
      )} */}
    </MainContainer>
  );
};

export default GameEditionContainer;
