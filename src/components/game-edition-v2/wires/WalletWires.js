import React from 'react';
import styled from 'styled-components/macro';
import { HideWiresIcon } from '../../../assets';
import { WALLET } from '../../../constants/wallet';

const WiresContainer = styled.div`
  display: flex;
  align-items: flex-end;
  position: relative;
`;

const HideWiresContainer = styled.div`
  position: absolute;
  z-index: 10;
  left: 50%;
  bottom: 30px;
  transform: translate(-50%, 0);
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span {
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: left;
    color: ${({ theme: { colors } }) => colors.white};
  }
`;

const WireImg = styled.img`
  cursor: pointer;
  margin-top: 20px;
`;

const ConnectionWire = ({ img, label, style, containerStyle }) => {
  return (
    <Container style={containerStyle}>
      <span>{label}</span>
      <WireImg src={img} style={style} />
    </Container>
  );
};

const WalletWires = ({ showWires, setShowWires }) => {
  return (
    <WiresContainer showWires={showWires}>
      {showWires && (
        <HideWiresContainer onClick={() => setShowWires(false)}>
          <HideWiresIcon />
        </HideWiresContainer>
      )}

      <ConnectionWire
        img={WALLET.KADDEX_WALLET.wire}
        label={WALLET.KADDEX_WALLET.name}
        containerStyle={{ marginRight: 200 }}
        style={{ height: 475, width: 85 }}
      />
      <ConnectionWire
        img={WALLET.ZELCORE.wire}
        label={WALLET.ZELCORE.name}
        containerStyle={{ marginRight: 150 }}
        style={{ height: 402, width: 60 }}
      />
      <ConnectionWire
        img={WALLET.CHAINWEAVER.wire}
        label={WALLET.CHAINWEAVER.name}
        containerStyle={{ marginRight: 150 }}
        style={{ height: 402, width: 60 }}
      />
      <ConnectionWire img={WALLET.TORUS.wire} label={WALLET.TORUS.name} style={{ height: 402, width: 60 }} />
    </WiresContainer>
  );
};
export default WalletWires;
