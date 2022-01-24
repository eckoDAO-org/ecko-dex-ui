import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';
import { GeCancelButtonIcon, GeConfirmButtonIcon, GeRetryButtonIcon } from '../../../assets';
import GameEditionLabel from './GameEditionLabel';
import pixeledPinkBox from '../../../assets/images/game-edition/pixeled-box-pink.svg';

const Button = styled.div`
  cursor: ${({ onClick, disabled }) => (onClick && !disabled ? 'pointer' : 'default')};
  ${({ type }) => {
    if (type && type !== 'confirm' && type !== 'cancel' && type !== 'retry') {
      let img = null;
      switch (type) {
        case 'pink':
          img = pixeledPinkBox;
          break;
        default:
          img = null;
          break;
      }
      return css`
        background-image: ${`url(${img})`};
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
      `;
    }
  }}
`;

const GameEditionButton = ({ type, onClick, disabled, children, style }) => {
  const getButtonIcon = () => {
    switch (type) {
      case 'confirm':
        return <GeConfirmButtonIcon />;
      case 'cancel':
        return <GeCancelButtonIcon />;
      case 'retry':
        return <GeRetryButtonIcon />;
      case 'pink':
        return <GameEditionLabel fontSize={40}>{children}</GameEditionLabel>;
      default:
        return null;
    }
  };

  return (
    <Button onClick={disabled ? null : (e) => onClick(e)} disabled={disabled} type={type} style={style}>
      {getButtonIcon()}
    </Button>
  );
};

export default GameEditionButton;

GameEditionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['confirm', 'cancel', 'retry', 'pink']),
  disabled: PropTypes.bool,
};

GameEditionButton.defaultProps = {
  type: 'confirm',
  disabled: false,
};
