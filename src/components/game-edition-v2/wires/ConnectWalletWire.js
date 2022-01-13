import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { useLocation } from 'react-router-dom';
import { ROUTE_GAME_EDITION_MENU } from '../../../router/routes';
import { FadeIn } from '../../shared/animations';
import { ConnectWalletIcon, WireConnectionIcon } from '../../../assets';
import { GameEditionContext, WIRE_CONTAINER_WIDTH } from '../../../contexts/GameEditionContext';

const WireConnectionContainer = styled.div`
  margin-top: 8px;
  width: ${WIRE_CONTAINER_WIDTH}px;
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
  const { showWires, selectedWire } = useContext(GameEditionContext);

  return (
    <WireConnectionContainer showWires={showWires} onClick={() => onClick()}>
      {location?.pathname === ROUTE_GAME_EDITION_MENU && !selectedWire && (
        <FadeIn>
          <WireConnectionIcon />
          <ConnectWalletContainer>
            <ConnectWalletIcon />
          </ConnectWalletContainer>
        </FadeIn>
      )}
    </WireConnectionContainer>
  );
};

export default ConnectWalletWire;
