/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useLocation } from 'react-router-dom';
import { GameEditionContext, GE_DESKTOP_CONFIGURATION } from '../../contexts/GameEditionContext';
import { useAccountContext, useApplicationContext, useKaddexWalletContext, useNotificationContext, useWalletContext } from '../../contexts';
import { STATUSES } from '../../contexts/NotificationContext';
import WalletWires from './components/WalletWires';
import ConnectWalletWire from './components/ConnectWalletWire';
import GameEditionModalsContainer from './GameEditionModalsContainer';
import { KaddexLogo } from '../../assets';
import { WALLET } from '../../constants/wallet';
import ConnectWalletZelcoreModal from '../modals/kdaModals/ConnectWalletZelcoreModal';
import ConnectWalletTorusModal from '../modals/kdaModals/ConnectWalletTorusModal';
import ConnectWalletChainweaverModal from '../modals/kdaModals/ConnectWalletChainweaverModal';
import { FadeIn } from '../shared/animations';
import GameboyButtons from './components/GameboyButtons';
import TokenSelectorModalContent from '../modals/swap-modals/TokenSelectorModalContent';
import gameboyDesktop from '../../assets/images/game-edition/gameboy-desktop.svg';
import menuBackground from '../../assets/images/game-edition/menu-background.png';
import loadingBackground from '../../assets/images/game-edition/loading-background.png';
import arcadeBackground from '../../assets/images/game-edition/arcade-background.png';
import arcadeDarkBackground from '../../assets/images/game-edition/arcade-dark-background.png';
import modalBackground from '../../assets/images/game-edition/modal-background.png';
import pixeledTokenSelectorBlueIcon from '../../assets/images/game-edition/pixeled-token-selector-blue.svg';
import pixeledTokenSelectorWhiteIcon from '../../assets/images/game-edition/pixeled-token-selector-white.svg';
import useLazyImage from '../../hooks/useLazyImage';
import LogoLoader from '../shared/LogoLoader';
import { ROUTE_GAME_EDITION_MENU, ROUTE_GAME_START_ANIMATION } from '../../router/routes';

const DesktopMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${({ theme: { header } }) => `calc(100% - ${header.height}px)`};
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel}px`}) {
    height: ${({ theme: { header } }) => `calc(100% - ${header.mobileHeight}px)`};
  }
  align-items: center;
  transition: transform 0.5s;
  transform: ${({ showWires, selectedWire, showTokens, resolutionConfiguration }) => {
    if (showTokens) {
      return `translate(-30%, ${resolutionConfiguration['game-mode'].geTranslateY}px) scale(${resolutionConfiguration['game-mode'].scale})`;
    }
    if (showWires && !selectedWire && !showTokens) {
      return `translateY(${resolutionConfiguration['game-mode'].wiresTranslateY}px) scale(${resolutionConfiguration['game-mode'].scale})`;
    } else {
      return `translateY(${resolutionConfiguration['game-mode'].geTranslateY}px) scale(${resolutionConfiguration['game-mode'].scale})`;
    }
  }};
  /* transform: ${({ showWires, selectedWire, showTokens, $scale }) => {
    if (showTokens) {
      return $scale ? 'translate(-600px, 560px) scale(1.28)' : 'translate(-600px, 442px) scale(1)';
    }
    if (showWires && !selectedWire && !showTokens) {
      return $scale ? 'translateY(560px) scale(1.28)' : 'translateY(0px) scale(1)';
    } else {
      return $scale ? 'translateY(560px) scale(1.28)' : 'translateY(442px) scale(1)';
    }
  }}; */
`;

const GameboyDesktopContainer = styled.div`
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  min-height: 534px;
  width: 930px;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  z-index: 2;
  transition: transform 0.5s;

  transform: ${({ showWires }) => {
    if (showWires) {
      return 'translateY(-85px)';
    } else {
      return 'translateY(0px)';
    }
  }};

  .kaddex-logo {
    margin-top: 20px;
    svg {
      height: 14.5px;
    }
  }
  opacity: ${({ showWires, showTokens }) => (showWires || showTokens ? 0.5 : 1)};
`;

const DisplayContent = styled.div`
  width: ${GE_DESKTOP_CONFIGURATION.DISPLAY_WIDTH}px;
  height: ${GE_DESKTOP_CONFIGURATION.DISPLAY_HEIGHT}px;
  margin-left: 6px;
  margin-top: 90px;
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

  @media (max-width: ${({ theme: { mediaQueries }, resolutionConfiguration }) =>
      `${mediaQueries.desktopPixel * resolutionConfiguration['game-mode'].scale - 1}px`}) {
    width: 280px;
    height: 357px;
    margin-left: 2px;
    margin-top: 26px;
    border-radius: 6px;
    & > *:first-child {
      border-radius: 6px;
    }
  }
`;

const SearchTokenList = styled(FadeIn)`
  height: fit-content;
  color: #ffff;
  margin-right: -7%;
  margin-left: 7%;
`;

const WiresContainer = styled.div`
  transition: transform 0s;
  transform: ${({ showTokens }) => {
    if (showTokens) {
      return 'translate(-250px, 0px)';
    }
    return 'translate(0px, 0px)';
  }};
  opacity: ${({ showTokens }) => (showTokens ? 0.5 : 1)};
`;

const GameEditionContainer = ({ children }) => {
  const location = useLocation();
  const { showNotification } = useNotificationContext();
  const { initializeKaddexWallet, isConnected, isInstalled } = useKaddexWalletContext();
  const { wallet, signingWallet, setSelectedWallet } = useWalletContext();
  const { resolutionConfiguration } = useApplicationContext();
  const { showWires, setShowWires, selectedWire, openModal, modalState, closeModal, onWireSelect, showTokens } = useContext(GameEditionContext);
  const { account } = useAccountContext();

  const onConnectionSuccess = async (wallet) => {
    await signingWallet();
    await setSelectedWallet(wallet);
    closeModal();
    showNotification({
      title: `${wallet.name}  was successfully connected`,
      type: 'game-mode',
      icon: wallet.notificationLogo,
      closeButton: false,
      titleStyle: { fontSize: 13 },
      autoClose: 3000,
    });
  };

  const onCloseModal = () => {
    closeModal();
    let oldWire = null;
    if (wallet && selectedWire && wallet?.id !== selectedWire?.id) {
      oldWire = WALLET[wallet.id];
    }
    onWireSelect(oldWire);
  };

  const getWalletModal = (walletName) => {
    switch (walletName) {
      default:
        return <div />;
      case WALLET.ZELCORE.name:
        return openModal({
          title: WALLET.ZELCORE.name.toUpperCase(),
          onClose: () => {
            onCloseModal();
          },
          content: <ConnectWalletZelcoreModal onConnectionSuccess={async () => await onConnectionSuccess(WALLET.ZELCORE)} />,
        });

      case WALLET.TORUS.name:
        return openModal({
          title: WALLET.TORUS.name.toUpperCase(),
          onClose: () => {
            onCloseModal();
          },
          content: <ConnectWalletTorusModal onConnectionSuccess={async () => await onConnectionSuccess(WALLET.TORUS)} />,
        });

      case WALLET.CHAINWEAVER.name:
        return openModal({
          title: WALLET.CHAINWEAVER.name.toUpperCase(),
          onClose: () => {
            onCloseModal();
          },
          content: <ConnectWalletChainweaverModal onConnectionSuccess={async () => await onConnectionSuccess(WALLET.CHAINWEAVER)} />,
        });

      case WALLET.KADDEX_WALLET.name:
        if (!isInstalled) {
          showNotification({
            title: 'Wallet not found',
            message: `Please install ${WALLET.KADDEX_WALLET.name}`,
            type: STATUSES.WARNING,
          });
          onWireSelect(null);
        } else {
          initializeKaddexWallet();
          closeModal();
        }
        break;
    }
  };

  useEffect(() => {
    if (account.account && isConnected) {
      onWireSelect(WALLET.KADDEX_WALLET);

      showNotification({
        title: `${WALLET.KADDEX_WALLET.name}  was successfully connected`,
        type: 'game-mode',
        icon: WALLET.KADDEX_WALLET.notificationLogo,
        closeButton: false,
        titleStyle: { fontSize: 13 },
        autoClose: 3000,
      });
    }
  }, [account.account, isConnected]);
  useEffect(() => {
    if ((selectedWire && !account.account) || (selectedWire && selectedWire?.id !== wallet?.id)) {
      getWalletModal(selectedWire.name);
    } else {
      closeModal();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWire, account.account]);

  const scale =
    location.pathname !== ROUTE_GAME_EDITION_MENU && location.pathname !== ROUTE_GAME_START_ANIMATION && !showWires && account?.account
      ? true
      : false;

  const [loaded] = useLazyImage([
    gameboyDesktop,
    menuBackground,
    loadingBackground,
    arcadeBackground,
    arcadeDarkBackground,
    modalBackground,
    pixeledTokenSelectorBlueIcon,
    pixeledTokenSelectorWhiteIcon,
  ]);

  return !loaded ? (
    <LogoLoader containerStyle={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} logoStyle={{ height: 75 }} />
  ) : (
    <DesktopMainContainer
      showWires={showWires}
      selectedWire={selectedWire}
      showTokens={showTokens}
      $scale={scale}
      style={{ justifyContent: 'flex-end' }}
      resolutionConfiguration={resolutionConfiguration}
    >
      <div style={{ display: 'flex' }}>
        <GameboyDesktopContainer showWires={showWires} showTokens={showTokens} style={{ backgroundImage: ` url(${gameboyDesktop})` }}>
          <GameboyButtons />

          <DisplayContent resolutionConfiguration={resolutionConfiguration}>
            {children}
            {modalState.open && (
              <GameEditionModalsContainer
                hideOnClose={modalState.hideOnClose}
                title={modalState.title}
                titleFontSize={modalState.titleFontSize}
                containerStyle={modalState.containerStyle}
                titleContainerStyle={modalState.titleContainerStyle}
                description={modalState.description}
                type={modalState.type}
                content={modalState.content}
                onClose={modalState.onClose}
              />
            )}
          </DisplayContent>

          <div className="kaddex-logo">
            <KaddexLogo />
          </div>
        </GameboyDesktopContainer>
        {showTokens && (
          <SearchTokenList>
            <TokenSelectorModalContent />
          </SearchTokenList>
        )}
      </div>
      <WiresContainer showTokens={showTokens}>
        <ConnectWalletWire onClick={() => setShowWires(true)} />
        <WalletWires />
      </WiresContainer>
    </DesktopMainContainer>
  );
};

export default GameEditionContainer;
