import React from 'react';
import styled from 'styled-components/macro';
import GameEditionLabel from './GameEditionLabel';

import emptyButton from '../../../assets/images/game-edition/empty-button.png';

const Btn = styled.div`
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin: 0 5px;
  .button-label {
    font-size: 20px;
    color: #ffffff;
  }
`;
const PressButtonToActionLabel = ({ button, actionLabel }) => {
  const getButton = () => {
    switch (button) {
      case 'A':
        return emptyButton;
      default:
        return emptyButton;
    }
  };
  return (
    <GameEditionLabel color="yellow" fontSize={20}>
      PRESS{' '}
      <Btn style={{ backgroundImage: `url(${getButton()})` }}>
        <span className="button-label">{button}</span>
      </Btn>{' '}
      TO {actionLabel}
    </GameEditionLabel>
  );
};

export default PressButtonToActionLabel;
