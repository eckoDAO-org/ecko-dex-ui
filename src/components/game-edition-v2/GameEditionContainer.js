import React, { useContext } from 'react';
import styled, { css } from 'styled-components/macro';
import { useHistory } from 'react-router';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import menuItems from '../menuItems';
import useWindowSize from '../../hooks/useWindowSize';
import { ConnectWalletIcon, KaddexLogo, WireConnectionIcon } from '../../assets';
import gameboyDesktop from '../../assets/images/game-edition/gameboy-desktop.png';
import gameboyMobile from '../../assets/images/game-edition/gameboy-mobile.png';
import { useAccountContext } from '../../contexts';
import theme from '../../styles/theme';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  height: ${({ theme: { header } }) => `calc(100% - ${header.height}px)`};
  align-items: center;
  overflow: hidden;
`;

const GameboyDesktopContainer = styled.div`
  background-repeat: no-repeat;
  background-position: center;
  height: 540px;
  width: 930px;
  display: flex;
  align-items: center;
  flex-direction: column;
  transition: all 1s ease-in-out;
  transition-delay: 1s;
  .kaddex-logo {
    margin-top: 20px;
    margin-left: 24px;
    svg {
      height: 14.5px;
    }
  }
  background-image: ${`url(${gameboyDesktop})`};
`;
const GameboyMobileContainer = styled.div`
  background-repeat: no-repeat;
  background-position: center;
  height: 540px;
  width: 930px;
  display: flex;
  align-items: center;
  flex-direction: column;
  transition: all 1s ease-in-out;
  transition-delay: 1s;
  .kaddex-logo {
    margin-top: 8px;
    svg {
      height: 6px;
    }
    margin-left: 24px;
    margin-top: 8px;
    svg {
      height: 6px;
    }
  }
  background-image: ${`url(${gameboyMobile})`};
  background-size: contain;
  /* transform: ${({ isLoadingCompleted }) => (isLoadingCompleted ? 'scale(1.5)' : 'scale(1)')}; */
`;

const DisplayContent = styled.div`
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
    width: 253px;
    height: 310px;
    margin-left: 5px;
    margin-top: 53px;
    border-radius: 6px;
    & > *:first-child {
      border-radius: 6px;
    }
  }
`;

const WireConnectionContainer = styled.div`
  margin-top: 8px;
  position: relative;
`;

const ConnectWalletContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
`;

const GameEditionContainer = ({ children }) => {
  const history = useHistory();
  const { isLoadingCompleted } = useContext(GameEditionContext);
  const { account } = useAccountContext();

  // const switchAppSection = (direction) => {
  //   let cur = history.location.pathname;
  //   if (direction === 'left') {
  //     let prevPage = menuItems.findIndex((path) => path.route === cur) - 1;
  //     if (prevPage < 0) history.push(menuItems[menuItems.length - 1].route);
  //     else return history.push(menuItems[prevPage].route);
  //   }
  //   if (direction === 'right') {
  //     let nextPage = menuItems.findIndex((path) => path.route === cur) + 1;
  //     if (nextPage > menuItems.length - 1) history.push(menuItems[0]?.route);
  //     else return history.push(menuItems[nextPage].route);
  //   }
  // };

  const [width] = useWindowSize();
  return width < theme.mediaQueries.desktopPixel ? (
    <MainContainer>
      <GameboyMobileContainer isLoadingCompleted={isLoadingCompleted}>
        <DisplayContent>{children}</DisplayContent>
        <div className="kaddex-logo">
          <KaddexLogo />
        </div>
      </GameboyMobileContainer>
    </MainContainer>
  ) : (
    <MainContainer style={{ justifyContent: 'flex-end' }}>
      <GameboyDesktopContainer isLoadingCompleted={isLoadingCompleted}>
        <DisplayContent>{children}</DisplayContent>
        <div className="kaddex-logo">
          <KaddexLogo />
        </div>
      </GameboyDesktopContainer>
      {!account?.account && (
        <WireConnectionContainer>
          <WireConnectionIcon />
          <ConnectWalletContainer>
            <ConnectWalletIcon />
          </ConnectWalletContainer>
        </WireConnectionContainer>
      )}
    </MainContainer>
  );
};

export default GameEditionContainer;
