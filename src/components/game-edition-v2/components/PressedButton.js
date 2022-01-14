import React, { useState } from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { ROUTE_GAME_EDITION_MENU } from '../../../router/routes';
import menuButton from '../../../assets/images/game-edition/pressed-buttons/Menu.png';
import swapButton from '../../../assets/images/game-edition/pressed-buttons/Menu.png';
import L1Button from '../../../assets/images/game-edition/pressed-buttons/L1.png';
import R1Button from '../../../assets/images/game-edition/pressed-buttons/R1.png';
import UpButton from '../../../assets/images/game-edition/pressed-buttons/Cross-Up.png';
import RightButton from '../../../assets/images/game-edition/pressed-buttons/Cross-Right.png';
import DownButton from '../../../assets/images/game-edition/pressed-buttons/Cross-Down.png';
import LeftButton from '../../../assets/images/game-edition/pressed-buttons/Cross-Left.png';

const GameEditionButtons = () => {
  const history = useHistory();
  return (
    <>
      <PressedButton type="menu" onClick={() => history.push(ROUTE_GAME_EDITION_MENU)} />
      <PressedButton type="swap" onClick={() => console.log('swap')} />
      <PressedButton type="L1" onClick={() => console.log('L1')} />
      <PressedButton type="R1" onClick={() => console.log('R1')} />
      <PressedButton type="up" onClick={() => console.log('up')} />
      {/* <PressedButton type="right" onClick={() => console.log('right')} />
      <PressedButton type="down" onClick={() => console.log('down')} />
      <PressedButton type="left" onClick={() => console.log('left')} /> */}
    </>
  );
};

export default GameEditionButtons;

const ButtonContainer = styled.div`
  position: absolute;
  cursor: pointer;
  user-select: none;
  img.pressed {
      display: block;
    }
    
    img.not-pressed {
      display: none;
    }
  }
`;

export const PressedButton = ({ type, onClick }) => {
  const getButton = () => {
    switch (type) {
      case 'menu':
        return { img: menuButton, position: { top: 364, left: 156 }, dimension: { width: 42, height: 42 } };
      case 'swap':
        return { img: swapButton, position: { top: 316, left: 156 }, dimension: { width: 42, height: 42 } };
      case 'L1':
        return { img: L1Button, position: { top: 0, left: 0 }, dimension: { width: 42, height: 42 } };
      case 'R1':
        return { img: R1Button, position: { top: -20, right: 0 }, dimension: { width: 228, height: 110 } };
      case 'up':
        return { img: UpButton, position: { top: 118, left: 58 }, dimension: { width: 150, height: 150 } };
      //   case 'down':
      //     return { img: DownButton, position: { top: -20, right: 0 }, dimension: { width: 228, height: 110 } };
      //   case 'right':
      //     return { img: RightButton, position: { top: 0, left: 0 }, dimension: { width: 42, height: 42 } };
      //   case 'left':
      //     return { img: LeftButton, position: { top: -20, right: 0 }, dimension: { width: 228, height: 110 } };
      default:
        return null;
    }
  };

  const button = getButton();
  const [className, setClassName] = useState('not-pressed');
  return (
    <ButtonContainer
      className={className}
      style={{ ...button.position, ...button.dimension }}
      onMouseDown={() => {
        setClassName('pressed');
        onClick();
      }}
      onMouseUp={() => setClassName('not-pressed')}
    >
      <img className={className} src={button.img} style={{ ...button.dimension }} />
    </ButtonContainer>
  );
};

PressedButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['menu', 'swap', 'L1', 'R1', 'up', 'right', 'down', 'left', 'A', 'B']).isRequired,
};
