import React from 'react';
import GameEditionLabel from './GameEditionLabel';

import A from '../../../assets/images/game-edition/pressed-buttons/A-BTN.png';
import B from '../../../assets/images/game-edition/pressed-buttons/B-BTN.png';

const PressButtonToActionLabel = ({ button, actionLabel }) => {
  const getButton = () => {
    switch (button) {
      case 'A':
        return A;
      default:
        return B;
    }
  };
  return (
    <GameEditionLabel color="yellow" fontSize={20}>
      PRESS <img src={getButton()} alt="btn" /> TO {actionLabel}
    </GameEditionLabel>
  );
};

export default PressButtonToActionLabel;
