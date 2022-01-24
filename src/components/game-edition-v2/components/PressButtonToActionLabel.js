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
`;
const PressButtonToActionLabel = ({ button, actionLabel }) => {
  return (
    <GameEditionLabel color="yellow" fontSize={20}>
      PRESS{' '}
      <Btn style={{ backgroundImage: `url(${emptyButton})` }}>
        <span className="button-label">{button}</span>
      </Btn>{' '}
      TO {actionLabel}
    </GameEditionLabel>
  );
};

export default PressButtonToActionLabel;

PressButtonToActionLabel.propTypes = {
  button: PropTypes.oneOf(['A', 'B']),
  actionLabel: PropTypes.string,
};

PressButtonToActionLabel.defaultProps = {
  button: 'B',
  actionLabel: '',
};
