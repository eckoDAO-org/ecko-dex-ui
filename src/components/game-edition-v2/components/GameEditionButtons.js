import React, { useState } from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { useGameEditionContext } from '../../../contexts';
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
import GameEditionL1R1PageModal from '../GameEditionL1R1PageModal';
import { ROUTE_GAME_EDITION_MENU, ROUTE_GAME_START_ANIMATION, ROUTE_SWAP } from '../../../router/routes';
import { useEffect } from 'react';

const GameEditionButtons = () => {
  const history = useHistory();
  const location = useLocation();
  const { buttons, openModal, closeModal } = useGameEditionContext();

  const openGameEditionL1R1Page = (buttonKey) => {
    return openModal({
      title: null,
      type: 'arcade',
      content: <GameEditionL1R1PageModal direction={buttonKey === 'L1' ? 'left' : 'right'} />,
      hideOnClose: true,
    });
  };

  const handleSwitchPage = (buttonKey) => {
    if (location.pathname === ROUTE_GAME_START_ANIMATION) {
      return null;
    }
    return buttons[buttonKey] ? buttons[buttonKey]() : openGameEditionL1R1Page(buttonKey);
  };

  return (
    <>
      <PressedButton
        type="menu"
        onClick={() => {
          if (buttons?.Menu) {
            buttons.Menu();
          } else {
            closeModal();
            history.push(ROUTE_GAME_EDITION_MENU);
          }
        }}
      />
      <PressedButton
        type="swap"
        onClick={() => {
          if (buttons?.Swap) {
            buttons.Swap();
          } else {
            closeModal();
            history.push(ROUTE_SWAP);
          }
        }}
      />
      <PressedButton type="L1" onClick={() => handleSwitchPage('L1')} />
      <PressedButton type="R1" onClick={() => handleSwitchPage('R1')} />
      <PressedButton type="up" onClick={buttons.Up ? () => buttons.Up() : null} />
      <PressedButton type="down" onClick={buttons.Down ? () => buttons.Down() : null} />
      <PressedButton type="right" onClick={buttons.Right ? () => buttons.Right() : null} />
      <PressedButton type="left" onClick={buttons.Left ? () => buttons.Left() : null} />
      <PressedButton type="A" onClick={buttons.A ? () => buttons.A() : null} />
      <PressedButton type="B" onClick={buttons.B ? () => buttons.B() : null} />
    </>
  );
};

export default GameEditionButtons;

const ButtonContainer = styled.div`
  position: absolute;
  cursor: ${({ showTokens }) => (showTokens ? 'default' : 'pointer')};
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
          pressed: { top: 366, left: 152 },
          notPressed: { top: 366, left: 152, width: 42, height: 42 },
          imgSize: { width: 42, height: 42 },
        };
      case 'swap':
        return {
          img: swapButton,
          pressed: { top: 316, left: 152 },
          notPressed: { top: 316, left: 152, width: 42, height: 42 },
          imgSize: { width: 42, height: 42 },
        };
      case 'L1':
        return {
          img: L1Button,
          pressed: { top: -17, left: -1 },
          notPressed: { top: 0, left: 0, width: 230, height: 98 },
          imgSize: { width: 225, height: 98 },
        };
      case 'R1':
        return {
          img: R1Button,
          pressed: { top: -17, right: 5 },
          notPressed: { top: 0, right: 0, width: 230, height: 98 },
          imgSize: { width: 225, height: 98 },
        };
      case 'up':
        return {
          img: UpButton,
          pressed: { top: 112, left: 54 },
          notPressed: { top: 130, left: 108, height: 40, width: 40 },
          imgSize: { width: 150, height: 150 },
        };

      case 'down':
        return {
          img: DownButton,
          pressed: { top: 112, left: 54 },
          notPressed: { top: 205, left: 108, height: 40, width: 40 },
          imgSize: { width: 150, height: 150 },
        };
      case 'left':
        return {
          img: LeftButton,
          pressed: { top: 112, left: 54 },
          notPressed: { top: 168, left: 71, height: 40, width: 40 },
          imgSize: { width: 150, height: 150 },
        };
      case 'right':
        return {
          img: RightButton,
          pressed: { top: 112, left: 54 },
          notPressed: { top: 168, left: 146, height: 40, width: 40 },

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
  const { showTokens } = useGameEditionContext();

  useEffect(() => {
    if (showTokens) {
      setTimeout(() => {
        setClassName('not-pressed');
      }, 100);
    }
  }, [showTokens]);
  return (
    <ButtonContainer
      className={className}
      style={{ ...(className === 'pressed' ? button.pressed : button.notPressed) }}
      disabled={showTokens}
      onMouseDown={() => {
        if (!showTokens) {
          setClassName('pressed');
          if (onClick) {
            onClick();
          }
        }
      }}
      onMouseUp={() => {
        if (!showTokens) {
          setClassName('not-pressed');
        }
      }}
    >
      <img className={className} src={button.img} style={{ ...button.imgSize }} alt="btn" />
    </ButtonContainer>
  );
};

PressedButton.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['menu', 'swap', 'L1', 'R1', 'up', 'right', 'down', 'left', 'A', 'B']).isRequired,
};
PressedButton.defaultProps = {
  onClick: null,
};
