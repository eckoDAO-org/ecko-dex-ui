import React from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import { commonColors } from '../../../styles/theme';
import { CloseGe } from '../../../assets';

const STYText = styled.span`
  display: flex;
  position: relative;
  align-items: center;
  cursor: ${({ onClick }) => onClick && 'pointer'};
  color: ${({ color }) => color} !important;
  font-size: ${({ fontSize }) => fontSize}px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.pixeboy};
  font-weight: ${({ fontWeight }) => fontWeight};
`;

const GameEditionLabel = ({ center, withShade, children, fontSize, fontWeight, color, style, onClick, onClose }) => {
  const getColor = () => {
    switch (color) {
      case 'white':
        return '#ffffff';
      case 'yellow':
        return commonColors.gameEditionYellow;
      case 'white-grey':
        return commonColors.gameEditionWhiteGrey;
      case 'blue':
        return commonColors.gameEditionBlue;
      case 'blue-grey':
        return commonColors.gameEditionBlueGrey;
      case 'error':
        return commonColors.error;
      case 'red':
        return commonColors.red;
      case 'green':
        return commonColors.green;
      case 'black':
        return commonColors.black;
      case 'pink':
        return commonColors.pink;
      case 'orange':
        return commonColors.orange;
      default:
        return '#ffffff';
    }
  };

  return (
    <STYText
      style={
        center
          ? { display: 'block', textAlign: 'center', width: onClose || center ? '100%' : 'auto', ...style }
          : { width: onClose ? '100%' : 'auto', ...style }
      }
      fontWeight={fontWeight}
      fontSize={fontSize}
      color={withShade ? `${getColor()}${withShade === true ? 99 : withShade}` : getColor()}
      onClick={onClick}
    >
      {children}
      {onClose && <CloseGe style={{ cursor: 'pointer', position: 'absolute', right: 16, top: 6 }} onClick={onClose} />}
    </STYText>
  );
};

export default GameEditionLabel;

GameEditionLabel.propTypes = {
  children: PropTypes.any.isRequired,
  fontSize: PropTypes.number,
  fontWeight: PropTypes.number,
  onClose: PropTypes.func,
  color: PropTypes.oneOf(['white', 'white-grey', 'yellow', 'blue', 'blue-grey', 'green', 'black', 'red']),
};

GameEditionLabel.defaultProps = {
  fontSize: 20,
  fontWeight: 400,
  onClick: null,
  color: 'white',
};
