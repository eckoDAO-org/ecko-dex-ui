/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import styled from 'styled-components/macro';
import useAbsoluteContent from '../../hooks/useAbsoluteContent';
import { KaddexLogo } from '../../assets';
import gameboyMobile from '../../assets/images/game-edition/gameboy-mobile.png';

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

const GameEditionMobileWrapper = ({ startLabel, startOnClick, selectLabel, selectOnClick, children }) => {
  useAbsoluteContent('svgContent', 'Rectangle_38');
  return (
    <GameEditionConatiner style={{ backgroundImage: `url(${gameboyMobile})` }}>
      <GameEditionContent>{children}</GameEditionContent>
      <div className="kaddex-logo">
        <KaddexLogo />
      </div>
    </GameEditionConatiner>
  );
};

export default GameEditionMobileWrapper;
