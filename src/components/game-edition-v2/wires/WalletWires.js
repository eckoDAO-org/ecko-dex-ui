import React, { useContext, useEffect, useState } from 'react';
import styled, { css } from 'styled-components/macro';
import { HideWiresIcon } from '../../../assets';
import { WALLET } from '../../../constants/wallet';
import { GameEditionContext } from '../../../contexts/GameEditionContext';

const WIRE_CONTAINER_WIDTH = 930;
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

  transform: translate(-50%, 0);
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  z-index: 1;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  flex-direction: column;
  align-items: center;
  transition: transform 1s;
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
        transform: translate(${translateX}px, -300px);

        img {
          transition: width 0.5s ease-in-out;
          width: 56px !important;
        }
      `;
    }
  }}
`;

const WireImg = styled.img`
  margin-top: ${({ selectedWire }) => !selectedWire && 20}px;
`;

export const ConnectionWire = ({ wire, style, containerStyle, onClick }) => {
  const { selectedWire } = useContext(GameEditionContext);

  const [translateX, setTranslateX] = useState(0);
  useEffect(() => {
    if (selectedWire) {
      const wireElement = document.getElementById(selectedWire.id);
      setTranslateX((WIRE_CONTAINER_WIDTH - 50) / 2 - wireElement.offsetLeft - 11);
    }
  }, [selectedWire]);
  return (
    <Container
      id={wire.id}
      style={containerStyle}
      translateX={translateX}
      onClick={onClick}
      isSelected={selectedWire?.id === wire.id}
      selectedWire={selectedWire}
    >
      <span>{wire.name}</span>
      <WireImg src={wire.wire} style={style} />
    </Container>
  );
};

const WalletWires = () => {
  const { showWires, setShowWires, selectedWire, onWireSelect } = useContext(GameEditionContext);
  return (
    <WiresContainer showWires={showWires}>
      {showWires && (
        <HideWiresContainer style={{ bottom: 30 }} onClick={() => setShowWires(false)}>
          <HideWiresIcon />
        </HideWiresContainer>
      )}

      {!showWires && selectedWire && (
        <HideWiresContainer style={{ top: -80, zIndex: 10 }} onClick={() => onWireSelect(null)}>
          <HideWiresIcon />
        </HideWiresContainer>
      )}
      {[WALLET.KADDEX_WALLET, WALLET.ZELCORE, WALLET.CHAINWEAVER, WALLET.TORUS].map((wire, i) => (
        <ConnectionWire
          key={i}
          wire={wire}
          style={wire.id === WALLET.KADDEX_WALLET.id ? { height: 475, width: 85 } : { height: 402, width: 60 }}
          onClick={selectedWire ? null : () => onWireSelect(wire)}
        />
      ))}
    </WiresContainer>
  );
};
export default WalletWires;
