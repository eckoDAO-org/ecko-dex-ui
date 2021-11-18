import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { ArrowDown, DropdownGe } from '../assets';
import CustomButton from './CustomButton';
import { GameEditionContext } from '../contexts/GameEditionContext';
import { theme } from '../styles/theme';
import { LightModeContext } from '../contexts/LightModeContext';

const Container = styled.div`
  position: absolute;
  top: 13%;
  right: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: ${({ theme: { inputTokenWidth } }) => `${inputTokenWidth}px`};
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const ElementsContainer = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  svg:first-child {
    margin-right: 8px;
  }

  span {
    font-size: 16px;
    margin-right: 13px;
    font: ${({ gameEditionView, theme: { fontFamily } }) => {
      if (gameEditionView)
        return `normal normal normal 14px/17px ${fontFamily.pressStartRegular}`;
    }};
    color: ${({ gameEditionView, theme: { colors } }) =>
      gameEditionView ? colors.black : colors.white};
  }
`;

const InputToken = ({ icon, code, onClick, onClickButton, disabledButton }) => {
  const { gameEditionView } = useContext(GameEditionContext);
  const { themeMode } = useContext(LightModeContext);

  return (
    <Container gameEditionView={gameEditionView}>
      <CustomButton
        buttonStyle={{
          padding: 12,
          marginLeft: 12,
          textTransform: gameEditionView ? 'capitalize' : 'uppercase',
        }}
        border='none'
        color={!gameEditionView && theme(themeMode).colors.white}
        background='transparent'
        fontSize={gameEditionView ? '13px' : '13px'}
        onClick={onClickButton}
        disabled={disabledButton}
      >
        Max
      </CustomButton>
      <ElementsContainer gameEditionView={gameEditionView} onClick={onClick}>
        {!gameEditionView && <>{icon}</>}

        <span>{code}</span>
      </ElementsContainer>
      {gameEditionView ? <DropdownGe /> : <ArrowDown />}
    </Container>
  );
};

InputToken.propTypes = {
  icon: PropTypes.element,
  code: PropTypes.string,
};

InputToken.defaultProps = {
  icon: null,
  code: '',
};

export default InputToken;
