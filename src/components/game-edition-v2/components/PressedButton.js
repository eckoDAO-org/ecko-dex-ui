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
import AButton from '../../../assets/images/game-edition/pressed-buttons/A-BTN.png';
import BButton from '../../../assets/images/game-edition/pressed-buttons/B-BTN.png';
import { useGameEditionContext } from '../../../contexts';

const GameEditionButtons = () => {
  const history = useHistory();
  const { buttons } = useGameEditionContext();
  return (
    <>
      <PressedButton type="menu" onClick={() => history.push(ROUTE_GAME_EDITION_MENU)} />
      <PressedButton type="swap" onClick={() => console.log('swap')} />
      <PressedButton type="L1" onClick={() => console.log('L1')} />
      <PressedButton type="R1" onClick={() => console.log('R1')} />
      <PressedButton type="up" onClick={() => buttons.Up()} />
      <PressedButton type="down" onClick={() => buttons.Down()} />
      <PressedButton type="right" onClick={() => console.log('right')} />
      <PressedButton type="left" onClick={() => console.log('left')} />
      <PressedButton type="A" onClick={() => console.log('A')} />
      <PressedButton type="B" onClick={() => buttons.B()} />
    </>
  );
};

export default GameEditionButtons;

const ButtonContainer = styled.div`
  position: absolute;
  cursor: pointer;
  display:flex;


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
        return {
          img: menuButton,
          pressed: { top: 364, left: 156 },
          notPressed: { top: 364, left: 156, width: 42, height: 42 },
          imgSize: { width: 42, height: 42 },
        };
      case 'swap':
        return {
          img: swapButton,
          pressed: { top: 316, left: 156 },
          notPressed: { top: 316, left: 156, width: 42, height: 42 },
          imgSize: { width: 42, height: 42 },
        };
      case 'L1':
        return {
          img: L1Button,
          pressed: { top: -13, left: 6 },
          notPressed: { top: 0, left: 0, width: 230, height: 98 },
          imgSize: { width: 225, height: 98 },
        };
      case 'R1':
        return {
          img: R1Button,
          pressed: { top: -13, right: 6 },
          notPressed: { top: 0, right: 0, width: 230, height: 98 },
          imgSize: { width: 225, height: 98 },
        };
      case 'up':
        return {
          img: UpButton,
          pressed: { top: 114, left: 60 },
          notPressed: { top: 132, left: 114, height: 40, width: 40 },
          imgSize: { width: 150, height: 150 },
        };

      case 'down':
        return {
          img: DownButton,
          pressed: { top: 114, left: 60 },
          notPressed: { top: 207, left: 114, height: 40, width: 40 },
          imgSize: { width: 150, height: 150 },
        };
      case 'left':
        return {
          img: LeftButton,
          pressed: { top: 114, left: 58 },
          notPressed: { top: 170, left: 78, height: 40, width: 40 },
          imgSize: { width: 150, height: 150 },
        };
      case 'right':
        return {
          img: RightButton,
          pressed: { top: 114, left: 60 },
          notPressed: { top: 170, left: 150, height: 40, width: 40 },

          imgSize: { width: 150, height: 150 },
        };
      case 'A':
        return {
          img: AButton,
          pressed: { top: 158, right: 38 },
          notPressed: { top: 172, right: 58, height: 60, width: 60 },
          imgSize: { width: 92, height: 86 },
        };
      case 'B':
        return {
          img: BButton,
          pressed: { top: 195, right: 108 },
          notPressed: { top: 208, right: 125, height: 60, width: 60 },
          imgSize: { width: 92, height: 86 },
        };

      default:
        return null;
    }
  };

  const button = getButton();
  const [className, setClassName] = useState('not-pressed');
  return (
    <ButtonContainer
      className={className}
      style={{ ...(className === 'pressed' ? button.pressed : button.notPressed) }}
      onMouseDown={() => {
        setClassName('pressed');
        onClick();
      }}
      onMouseUp={() => setClassName('not-pressed')}
    >
      <img className={className} src={button.img} style={{ ...button.imgSize }} alt="btn" />
    </ButtonContainer>
  );
};

PressedButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['menu', 'swap', 'L1', 'R1', 'up', 'right', 'down', 'left', 'A', 'B']).isRequired,
};
