import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components/macro';
import { useAccountContext, useApplicationContext, useGameEditionContext, useKaddexWalletContext, useWalletContext } from '../../../contexts';
import { GE_DESKTOP_CONFIGURATION } from '../../../contexts/GameEditionContext';
import { FadeIn } from '../../shared/animations';
import { HideWiresIcon } from '../../../assets';
import { WALLET } from '../../../constants/wallet';

const WiresContainer = styled.div`
  display: flex;
  align-items: flex-end;
  position: relative;
  width: ${GE_DESKTOP_CONFIGURATION.WIRE_CONTAINER_WIDTH}px;
  padding: 0 50px;
  justify-content: space-between;
`;

const HideWiresContainer = styled.div`
  position: absolute;
  z-index: 10;
  left: 50%;
  transform: translate(-50%, 0px);
  cursor: pointer;
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const DisconnectButton = styled(HideWiresContainer)`
  background-color: #000000;
  border-radius: 40px;
  padding: 10px 50px;
  transition: transform 0.5s;
  transform: ${({ showWires, selectedWire }) => (!showWires && selectedWire ? 'translate(-50%, 0px)' : 'translate(-50%, 700px)')};

  span {
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
  }
`;

const ConnectionWireContainer = styled.div`
  display: flex;
  position: relative;
  z-index: 1;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  flex-direction: column;
  align-items: center;
  svg {
    margin-top: 40px;
  }
  span {
    transition: opacity 1s;
    position: absolute;
    white-space: nowrap;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: left;
    color: ${({ theme: { colors } }) => colors.white};

    ${({ selectedWire }) => {
      if (selectedWire) {
        return css`
          opacity: 0;
        `;
      }
    }}
  }

  ${({ isSelected, translateX, resolutionConfiguration }) => {
    if (isSelected) {
      return css`
        transition: transform 0.5s;
        transform: translate(${translateX}px, -260px);
      `;
    } else {
      return css`
        transition: transform 0.3s;
        :hover {
          transform: scale(calc(${resolutionConfiguration['game-mode'].scale} + 0.3));
        }
      `;
    }
  }}
`;

const BlurWire = styled(FadeIn)`
  position: absolute;
  filter: blur(16px);
  z-index: -1;
`;

export const ConnectionWire = ({ wire, containerStyle, onClick }) => {
  const { selectedWire, showWires } = useGameEditionContext();
  const { resolutionConfiguration } = useApplicationContext();
  const { account } = useAccountContext();

  const [translateX, setTranslateX] = useState(0);
  useEffect(() => {
    if (selectedWire) {
      const wireElement = document.getElementById(selectedWire.id);

      setTranslateX((GE_DESKTOP_CONFIGURATION.WIRE_CONTAINER_WIDTH - 50) / 2 - wireElement.offsetLeft - 10);
    }
  }, [selectedWire]);
  return (
    <ConnectionWireContainer
      id={wire.id}
      style={containerStyle}
      translateX={translateX}
      onClick={onClick}
      isSelected={selectedWire?.id === wire.id}
      selectedWire={selectedWire}
      resolutionConfiguration={resolutionConfiguration}
    >
      <span>{wire.name}</span>
      {wire.wireIcon}
      {account?.account && !showWires && <BlurWire>{wire.wireIcon}</BlurWire>}
    </ConnectionWireContainer>
  );
};

const WalletWires = () => {
  const { wallet, removeWallet, removeSigning } = useWalletContext();
  const { disconnectWallet } = useKaddexWalletContext();
  const { showWires, onWireSelect, selectedWire } = useGameEditionContext();
  const { logout } = useAccountContext();

  return (
    <WiresContainer showWires={showWires}>
      {showWires && (
        <HideWiresContainer
          style={{ top: -120 }}
          onClick={() => {
            let oldWire = null;
            if (wallet && !selectedWire && wallet?.id !== selectedWire?.id) {
              oldWire = WALLET[wallet.id];
            }
            onWireSelect(oldWire);
          }}
        >
          <HideWiresIcon />
        </HideWiresContainer>
      )}

      <DisconnectButton
        showWires={showWires}
        selectedWire={selectedWire}
        style={{ top: -77 }}
        onClick={() => {
          let oldWire = null;
          if (wallet && selectedWire && wallet?.id !== selectedWire?.id) {
            oldWire = WALLET[wallet.id];
          } else {
            if (wallet?.id === WALLET.ECKOWALLET) {
              disconnectWallet();
            } else {
              logout();
              removeWallet();
              removeSigning();
            }
          }
          onWireSelect(oldWire);
        }}
      >
        <span>Disconnect</span>
      </DisconnectButton>

      {[WALLET.ECKOWALLET, WALLET.ZELCORE, WALLET.CHAINWEAVER, WALLET.WALLETCONNECT].map((wire, i) => (
        <ConnectionWire key={i} wire={wire} onClick={selectedWire ? null : () => onWireSelect(wire)} />
      ))}
    </WiresContainer>
  );
};
export default WalletWires;
