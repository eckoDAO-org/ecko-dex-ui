import React from 'react';
import styled from 'styled-components/macro';
import { useLocation } from 'react-router-dom';
import { GE_DESKTOP_CONFIGURATION } from '../../../contexts/GameEditionContext';
import { useApplicationContext, useGameEditionContext } from '../../../contexts';
import { ROUTE_GAME_START_ANIMATION } from '../../../router/routes';
import { FadeIn } from '../../shared/animations';
import { ConnectWalletIcon, WireConnectionLightIcon, WireConnectionDarkIcon } from '../../../assets';

const WireConnectionContainer = styled.div`
  margin-top: 8px;
  width: ${GE_DESKTOP_CONFIGURATION.WIRE_CONTAINER_WIDTH}px;
  display: flex;
  justify-content: center;
  position: relative;
  transition: transform 0.5s;
  transform: ${({ showWires }) => (showWires ? 'translateY(700px)' : 'translateY(0)')};
  min-height: 161px;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  z-index: 10;
`;

const ConnectWalletContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ConnectWalletWire = ({ onClick }) => {
  const location = useLocation();
  const { themeMode } = useApplicationContext();
  const { showWires, selectedWire } = useGameEditionContext();

  return (
    <WireConnectionContainer
      showWires={showWires}
      onClick={selectedWire || location.pathname === ROUTE_GAME_START_ANIMATION ? null : () => onClick()}
    >
      {location?.pathname !== ROUTE_GAME_START_ANIMATION && !selectedWire && (
        <FadeIn>
          {themeMode === 'light' ? <WireConnectionDarkIcon /> : <WireConnectionLightIcon />}
          <ConnectWalletContainer>
            <ConnectWalletIcon />
          </ConnectWalletContainer>
        </FadeIn>
      )}
    </WireConnectionContainer>
  );
};

export default ConnectWalletWire;
