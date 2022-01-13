import React, { useContext, useEffect, useState } from 'react';
import styled, { css } from 'styled-components/macro';
import { HideWiresIcon } from '../../../assets';
import { WALLET } from '../../../constants/wallet';
import { useAccountContext } from '../../../contexts';
import { GameEditionContext, WIRE_CONTAINER_WIDTH } from '../../../contexts/GameEditionContext';

const WiresContainer = styled.div`
  display: flex;
  align-items: flex-end;
  position: relative;
  width: ${WIRE_CONTAINER_WIDTH}px;
  padding: 0 50px;
  justify-content: space-between;
`;

const HideWiresContainer = styled.div`
  position: absolute;
  z-index: 10;
  left: 50%;
  transform: translate(-50%, 0px);
  cursor: pointer;
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
  z-index: 1;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  flex-direction: column;
  align-items: center;
  svg {
    margin-top: 20px;
  }
  span {
    transition: opacity 1s;

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

  ${({ isSelected, translateX }) => {
    if (isSelected) {
      return css`
        transition: transform 0.5s;
        transform: translate(${translateX}px, -260px);
      `;
    } else {
      return css`
        transition: transform 0.3s;
        :hover {
          transform: scale(1.3);
        }
      `;
    }
  }}
`;

export const ConnectionWire = ({ wire, containerStyle, onClick }) => {
  const { selectedWire } = useContext(GameEditionContext);

  const [translateX, setTranslateX] = useState(0);
  useEffect(() => {
    if (selectedWire) {
      const wireElement = document.getElementById(selectedWire.id);

      setTranslateX((WIRE_CONTAINER_WIDTH - 50) / 2 - wireElement.offsetLeft - wireElement.offsetWidth / 2 + 20);
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
    >
      <span>{wire.name}</span>
      {wire.wireIcon}
    </ConnectionWireContainer>
  );
};

const WalletWires = () => {
  const { showWires, setShowWires, selectedWire, onWireSelect } = useContext(GameEditionContext);
  const { logout } = useAccountContext();

  return (
    <WiresContainer showWires={showWires}>
      {showWires && (
        <HideWiresContainer style={{ bottom: 30 }} onClick={() => setShowWires(false)}>
          <HideWiresIcon />
        </HideWiresContainer>
      )}

      <DisconnectButton
        showWires={showWires}
        selectedWire={selectedWire}
        style={{ top: -155 }}
        onClick={() => {
          logout({ notReload: true });
          onWireSelect(null);
        }}
      >
        <span>Disconnect</span>
      </DisconnectButton>

      {[WALLET.KADDEX_WALLET, WALLET.ZELCORE, WALLET.CHAINWEAVER, WALLET.TORUS].map((wire, i) => (
        <ConnectionWire key={i} wire={wire} onClick={selectedWire ? null : () => onWireSelect(wire)} />
      ))}
    </WiresContainer>
  );
};
export default WalletWires;
