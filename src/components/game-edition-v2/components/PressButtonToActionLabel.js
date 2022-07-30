import React from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
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

  animation: hithere 1s ease infinite;

  @keyframes hithere {
    30% {
      transform: scale(1.2);
    }
    40%,
    60% {
      transform: rotate(-20deg) scale(1.2);
    }
    50% {
      transform: rotate(20deg) scale(1.2);
    }
    70% {
      transform: rotate(0deg) scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;
const PressButtonToActionLabel = ({ button, actionLabel, hideTo, style }) => {
  return (
    <GameEditionLabel color="yellow" fontSize={20} style={{ justifyContent: 'center', ...style }}>
      PRESS{' '}
      <Btn style={{ backgroundImage: `url(${emptyButton})` }}>
        <span className="button-label">{button}</span>
      </Btn>{' '}
      {!hideTo && 'TO '}
      {actionLabel}
    </GameEditionLabel>
  );
};

export default PressButtonToActionLabel;

PressButtonToActionLabel.propTypes = {
  button: PropTypes.oneOf(['A', 'B']),
  actionLabel: PropTypes.string,
};

PressButtonToActionLabel.defaultProps = {
  button: 'A',
  actionLabel: '',
};
