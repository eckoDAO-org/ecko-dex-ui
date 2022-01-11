import React from 'react';
import styled from 'styled-components/macro';
import { useLocation } from 'react-router-dom';
import { ROUTE_GAME_EDITION_MENU } from '../../../router/routes';
import { FadeIn } from '../../shared/animations';
import { ConnectWalletIcon, WireConnectionIcon } from '../../../assets';

const WireConnectionContainer = styled(FadeIn)`
  margin-top: 8px;
  position: relative;
  transition: transform 0.5s;

  transform: ${({ showWires }) => (showWires ? 'translateY(1000%)' : 'translateY(0)')};
  min-height: 161px;
`;

const ConnectWalletContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
`;

const ConnectWalletWire = ({ showWires, onClick }) => {
  const location = useLocation();

  return (
    <WireConnectionContainer showWires={showWires} onClick={onClick}>
      {location?.pathname === ROUTE_GAME_EDITION_MENU && (
        <>
          <WireConnectionIcon />
          <ConnectWalletContainer>
            <ConnectWalletIcon />
          </ConnectWalletContainer>
        </>
      )}
    </WireConnectionContainer>
  );
};

export default ConnectWalletWire;
