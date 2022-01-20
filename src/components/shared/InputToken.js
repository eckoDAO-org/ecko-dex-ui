import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { ArrowDown, PixeledArrowDownIcon } from '../../assets';
import CustomButton from './CustomButton';
import { GameEditionContext } from '../../contexts/GameEditionContext';

const Container = styled.div`
  position: absolute;
  padding-top: ${({ $gameEditionView }) => $gameEditionView && '10px'};
  cursor: pointer;
  right: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: ${({ theme: { inputTokenWidth } }) => `${inputTokenWidth}px`};
  svg {
    path {
      fill: ${({ $gameEditionView, theme: { colors } }) => !$gameEditionView && colors.white};
    }
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
    top: ${({ $gameEditionView }) => $gameEditionView && '0px'};
  }
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobileSmallPixel}px`}) {
    button {
      padding: 12px 4px !important;
    }
  }
`;

const ElementsContainer = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
  span {
    font-size: 16px;
    margin-right: 13px;
    font: ${({ $gameEditionView, theme: { fontFamily } }) => {
      if ($gameEditionView) return `normal normal normal 29px ${fontFamily.pixeboy}`;
    }};
    color: ${({ $gameEditionView, theme: { colors } }) => ($gameEditionView ? colors.black : colors.white)};
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
    span {
      font-size: 16px;
      margin-right: 13px;
      font: ${({ $gameEditionView, theme: { fontFamily } }) => {
        if ($gameEditionView) return `normal normal normal 13px ${fontFamily.pixeboy}`;
      }};
      color: ${({ $gameEditionView, theme: { colors } }) => ($gameEditionView ? colors.black : colors.white)};
    }
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobileSmallPixel}px`}) {
    img {
      margin-right: 4px !important;
    }
    span {
      margin-right: 4px;
    }
  }
`;

const InputToken = ({ icon, code, onClick, onClickButton, disabledButton }) => {
  const { gameEditionView } = useContext(GameEditionContext);

  return (
    <Container $gameEditionView={gameEditionView}>
      {!gameEditionView && (
        <CustomButton
          buttonStyle={{
            padding: '12px 8px',
          }}
          labelStyle={{ textTransform: 'uppercase' }}
          type="basic"
          fontSize={13}
          onClick={onClickButton}
          disabled={disabledButton}
        >
          Max
        </CustomButton>
      )}
      <ElementsContainer $gameEditionView={gameEditionView} onClick={onClick}>
        <>{icon}</>

        <span>{code}</span>
      </ElementsContainer>
      {gameEditionView ? <PixeledArrowDownIcon /> : <ArrowDown />}
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
