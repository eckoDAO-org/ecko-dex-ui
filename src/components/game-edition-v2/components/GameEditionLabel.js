import React from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import { commonColors } from '../../../styles/theme';

const STYText = styled.span`
  display: flex;
  align-items: center;
  cursor: ${({ onClick }) => onClick && 'pointer'};
  color: ${({ color }) => color};
  font-size: ${({ fontSize }) => fontSize}px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.pixeboy};
  font-weight: ${({ fontWeight }) => fontWeight};
`;

const GameEditionLabel = ({ withShade, children, fontSize, fontWeight, color, style, onClick }) => {
  const getColor = () => {
    switch (color) {
      case 'white':
        return '#ffffff';
      case 'yellow':
        return commonColors.gameEditionYellow;
      case 'grey':
        return commonColors.gameEditionGrey;
      case 'blue':
        return commonColors.gameEditionBlue;
      default:
        return '#ffffff';
    }
  };
  return (
    <STYText style={style} fontWeight={fontWeight} fontSize={fontSize} color={withShade ? `${getColor()}99` : getColor()} onClick={onClick}>
      {children}
    </STYText>
  );
};

export default GameEditionLabel;

GameEditionLabel.propTypes = {
  children: PropTypes.any.isRequired,
  fontSize: PropTypes.number,
  fontWeight: PropTypes.number,
  onClose: PropTypes.func,
  color: PropTypes.oneOf(['white', 'yellow', 'blue', 'grey']),
};

GameEditionLabel.defaultProps = {
  fontSize: 14,
  fontWeight: 400,
  onClick: null,
  color: 'white',
};
