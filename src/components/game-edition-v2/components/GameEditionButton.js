import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { GeCancelButtonIcon, GeConfirmButtonIcon } from '../../../assets';

const Button = styled.div`
  cursor: ${({ onClick, disabled }) => (onClick && !disabled ? 'pointer' : 'default')};
`;

const GameEditionButton = ({ type, onClick, disabled }) => {
  const getButtonIcon = () => {
    switch (type) {
      case 'confirm':
        return <GeConfirmButtonIcon />;
      case 'cancel':
        return <GeCancelButtonIcon />;
      default:
        return null;
    }
  };

  return (
    <Button onClick={disabled ? null : () => onClick()} disabled={disabled}>
      {getButtonIcon()}
    </Button>
  );
};

export default GameEditionButton;

GameEditionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['confirm', 'cancel']),
  disabled: PropTypes.bool,
};

GameEditionButton.defaultProps = {
  type: 'confirm',
  disabled: false,
};
