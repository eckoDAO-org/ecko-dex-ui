import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { useAccountContext } from '../../contexts';
import useWindowSize from '../../hooks/useWindowSize';
import { KaddexLogo } from '../../assets';
import gameboyDesktop from '../../assets/images/game-edition/gameboy-desktop.png';
import gameboyMobile from '../../assets/images/game-edition/gameboy-mobile.png';
import theme from '../../styles/theme';

import WalletWires from './wires/WalletWires';
import ConnectWalletWire from './wires/ConnectWalletWire';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 56px);
  align-items: center;
  transition: transform 0.5s;

  transform: ${({ showWires }) => (showWires ? 'translateY(0)' : 'translateY(512px)')};
`;

const GameboyDesktopContainer = styled.div`
  background-repeat: no-repeat;
  background-position: center;
  min-height: 540px;
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
  }
  opacity: ${({ showWires }) => (showWires ? 0.5 : 1)};
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

  background-size: contain;
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

const GameEditionContainer = ({ children }) => {
  const { showWires, setShowWires } = useContext(GameEditionContext);
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
      <GameboyMobileContainer style={{ backgroundImage: `url(${gameboyMobile})` }}>
        <DisplayContent>{children}</DisplayContent>
        <div className="kaddex-logo">
          <KaddexLogo />
        </div>
      </GameboyMobileContainer>
    </MainContainer>
  ) : (
    <MainContainer showWires={showWires} style={{ justifyContent: 'flex-end' }}>
      <GameboyDesktopContainer showWires={showWires} style={{ backgroundImage: `url(${gameboyDesktop})` }}>
        <DisplayContent>{children}</DisplayContent>
        <div className="kaddex-logo">
          <KaddexLogo />
        </div>
      </GameboyDesktopContainer>
      {!account?.account && <ConnectWalletWire showWires={showWires} onClick={() => setShowWires(true)} />}

      <WalletWires showWires={showWires} setShowWires={setShowWires} />
    </MainContainer>
  );
};

export default GameEditionContainer;
