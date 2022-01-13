import React, { useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { useAccountContext } from '../../contexts';
import useWindowSize from '../../hooks/useWindowSize';
import WalletWires from './wires/WalletWires';
import ConnectWalletWire from './wires/ConnectWalletWire';
import GameEditionModalsContainer from './GameEditionModalsContainer';
import gameboyDesktop from '../../assets/images/game-edition/gameboy-desktop.png';
import gameboyMobile from '../../assets/images/game-edition/gameboy-mobile.png';
import { KaddexLogo } from '../../assets';
import theme from '../../styles/theme';
import { WALLET } from '../../constants/wallet';
import ConnectWalletZelcoreModal from '../modals/kdaModals/ConnectWalletZelcoreModal';
import ConnectWalletTorusModal from '../modals/kdaModals/ConnectWalletTorusModal';
import ConnectWalletChainweaverModal from '../modals/kdaModals/ConnectWalletChainweaverModal';

const DesktopMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${({ theme: { header } }) => `calc(100% - ${header.height}px)`};
  align-items: center;
  transition: transform 0.5s;
  transform: ${({ showWires, selectedWire }) => {
    return showWires && !selectedWire ? 'translateY(0)' : 'translateY(442px)';
  }};
`;

const MobileMainContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  height: ${({ theme: { header } }) => `calc(100% - ${header.height}px)`};
  align-items: center;
  overflow: hidden;
`;

const GameboyDesktopContainer = styled.div`
  background-repeat: no-repeat;
  background-position: center;
  min-height: 540px;
  width: 930px;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 2;
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
  background-size: contain;
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
`;

const DisplayContent = styled.div`
  width: 440px;
  margin-left: 25px;
  margin-top: 100px;
  height: 329px;
  background: rgba(0, 0, 0, 0.02);
  box-shadow: inset 0px 0px 20px rgba(0, 0, 0, 0.75);
  display: flex;
  position: relative;
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
  const [width] = useWindowSize();
  const { showWires, setShowWires, selectedWire, openModal, modalState, closeModal, onWireSelect } = useContext(GameEditionContext);
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

  const getWalletModal = (walletName) => {
    switch (walletName) {
      default:
        return <div />;
      case WALLET.ZELCORE.name:
        return openModal({
          title: 'ZELCORE',
          content: <ConnectWalletZelcoreModal />,
        });

      case WALLET.TORUS.name:
        return openModal({
          title: 'TORUS',
          content: <ConnectWalletTorusModal onClose={closeModal} />,
        });

      case WALLET.CHAINWEAVER.name:
        return openModal({
          title: 'connect wallet',
          description: 'Chainweaver',
          content: <ConnectWalletChainweaverModal onClose={closeModal} />,
        });

      // case WALLET.KADDEX_WALLET.name:
      //   if (!isInstalled) {
      //     showNotification({
      //       title: 'Wallet not found',
      //       message: `Please install ${WALLET.KADDEX_WALLET.name}`,
      //       type: STATUSES.WARNING,
      //     });
      //   }
      //   break;
    }
  };

  useEffect(() => {
    if (selectedWire) {
      getWalletModal(selectedWire.name);
    } else {
      closeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWire]);

  return width < theme.mediaQueries.desktopPixel ? (
    <MobileMainContainer>
      <GameboyMobileContainer style={{ backgroundImage: `url(${gameboyMobile})` }}>
        <DisplayContent>{children}</DisplayContent>
        <div className="kaddex-logo">
          <KaddexLogo />
        </div>
      </GameboyMobileContainer>
    </MobileMainContainer>
  ) : (
    <DesktopMainContainer showWires={showWires} selectedWire={selectedWire} style={{ justifyContent: 'flex-end' }}>
      <GameboyDesktopContainer showWires={showWires} style={{ backgroundImage: `url(${gameboyDesktop})` }}>
        <DisplayContent>
          {children}
          {modalState.open && (
            <GameEditionModalsContainer
              hideOnClose={modalState.hideOnClose}
              title={modalState.title}
              description={modalState.description}
              content={modalState.content}
              onClose={() => {
                closeModal();
                onWireSelect(null);
              }}
            />
          )}
        </DisplayContent>
        <div className="kaddex-logo">
          <KaddexLogo />
        </div>
      </GameboyDesktopContainer>
      {!account?.account && <ConnectWalletWire onClick={() => setShowWires(true)} />}
      <WalletWires />
    </DesktopMainContainer>
  );
};

export default GameEditionContainer;
