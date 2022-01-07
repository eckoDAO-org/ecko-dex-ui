/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import styled from 'styled-components';
import { KaddexLogo } from '../../assets';
import gameboy from '../../assets/images/game-edition/gameboy.png';

const GameEditionConatiner = styled.div`
  background-repeat: no-repeat;
  background-position: center;
  height: 540px;
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
`;

const GameEditionContent = styled.div`
  width: 440px;
  margin-left: 25px;
  margin-top: 100px;
  height: 329px;
  border-radius: 19px;
  background: rgba(0, 0, 0, 0.02);
  box-shadow: inset 0px 0px 20px rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > *:first-child {
    border-radius: 19px;
  }
`;

export const GameEditionWrapper = ({ startLabel, startOnClick, selectLabel, selectOnClick, buttonLOnClick, buttonROnClick, children }) => {
  return (
    <GameEditionConatiner style={{ backgroundImage: `url(${gameboy})` }}>
      <GameEditionContent>{children}</GameEditionContent>
      <div className="kaddex-logo">
        <KaddexLogo />
      </div>
    </GameEditionConatiner>
  );
};
