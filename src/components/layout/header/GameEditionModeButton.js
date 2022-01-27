/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled, { css } from 'styled-components/macro';
import { GameModeIcon } from '../../../assets';
import { useGameEditionContext } from '../../../contexts';
import { GE_DESKTOP_CONFIGURATION } from '../../../contexts/GameEditionContext';
import useWindowSize from '../../../hooks/useWindowSize';
import { commonTheme } from '../../../styles/theme';

const Button = styled.div`
  cursor: pointer;
  height: fit-content;
  position: absolute;
  width: 168px;
  left: 50%;
  transform: translate(-50%, 0);
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? colors.white : colors.primary)};

  @media (min-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel * GE_DESKTOP_CONFIGURATION.scaleValue}px`}) {
    svg {
      path {
        fill: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? colors.white : colors.primary)};
      }
    }

    background-color: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? 'transparent' : colors.white)};
    padding: 8px 18px;
    ${({ gameEditionView, theme: { colors } }) =>
      gameEditionView &&
      css`
        border: 1px solid ${colors.white}4D;
        box-sizing: border-box;
        border-radius: 40px;
      `}
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel * GE_DESKTOP_CONFIGURATION.scaleValue - 1}px`}) {
    svg {
      path {
        fill: ${({ themeMode, theme: { colors } }) => (themeMode === 'light' ? colors.primary : colors.white)};
      }
    }
  }
`;

const GameEditionModeButton = () => {
  const { gameEditionView, closeModal, setGameEditionView, showWires } = useGameEditionContext();
  const [width, height] = useWindowSize();

  return !showWires ? (
    <Button
      gameEditionView={gameEditionView}
      onClick={() => {
        if (
          width >= commonTheme.mediaQueries.desktopPixel * GE_DESKTOP_CONFIGURATION.scaleValue &&
          height >= commonTheme.mediaQueries.gameEditionDesktopHeightPixel * GE_DESKTOP_CONFIGURATION.scaleValue
        ) {
          setGameEditionView(!gameEditionView);
          closeModal();
        }
      }}
    >
      {!gameEditionView && <GameModeIcon style={{ marginRight: 9.4 }} />}
      <span style={{ fontFamily: commonTheme.fontFamily.bold, whiteSpace: 'nowrap' }}>{gameEditionView ? 'Exit Game Mode' : 'Game Mode'}</span>

      {/* 
         : (
           <>
             {gameEditionView && <ObliqueStrokeIcon style={{ position: 'absolute' }} />}
             <GameModeIcon />
           </>
         ) */}
    </Button>
  ) : (
    <></>
  );
};

export default GameEditionModeButton;
