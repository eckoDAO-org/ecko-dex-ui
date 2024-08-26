// /* eslint-disable react-hooks/exhaustive-deps */
// import React from 'react';
// import styled, { css } from 'styled-components/macro';
// import { GameModeIcon } from '../../../assets';
// import { useApplicationContext, useGameEditionContext } from '../../../contexts';
// import useWindowSize from '../../../hooks/useWindowSize';
// import { commonTheme } from '../../../styles/theme';

// const Button = styled.div`
//   cursor: pointer;
//   height: fit-content;

//   /* width: 168px; */

//   border-radius: 40px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 1;

//   .header {
//     position: absolute;
//     left: 50%;
//     transform: translate(-50%, 0);
//   }
//   color: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? colors.white : colors.primary)};

//   @media (min-width: ${({ theme: { mediaQueries }, resolutionConfiguration }) =>
//       `${mediaQueries.desktopPixel * resolutionConfiguration['game-mode'].scale}px`}) {
//     svg {
//       path {
//         fill: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? colors.white : colors.primary)};
//       }
//     }

//     background-color: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? 'transparent' : colors.white)};
//     padding: 8px 18px;
//     ${({ gameEditionView, theme: { colors } }) =>
//       gameEditionView &&
//       css`
//         border: 1px solid ${colors.white}4D;
//         box-sizing: border-box;
//         border-radius: 40px;
//       `}
//   }

//   @media (max-width: ${({ theme: { mediaQueries }, resolutionConfiguration }) =>
//       `${mediaQueries.desktopPixel * resolutionConfiguration['game-mode'].scale - 1}px`}) {
//     svg {
//       path {
//         fill: ${({ themeMode, theme: { colors } }) => (themeMode === 'light' ? colors.primary : colors.white)};
//       }
//     }
//   }
// `;

// const GameEditionModeButton = ({ className }) => {
//   const { gameEditionView, closeModal, setGameEditionView, showWires } = useGameEditionContext();
//   const { resolutionConfiguration } = useApplicationContext();
//   const [width, height] = useWindowSize();

//   return !showWires ? (
//     <Button
//       className={className}
//       resolutionConfiguration={resolutionConfiguration}
//       gameEditionView={gameEditionView}
//       onClick={() => {
//         if (width >= resolutionConfiguration.width && height >= resolutionConfiguration.height) {
//           setGameEditionView((prev) => !prev);
//           closeModal();
//         }
//       }}
//     >
//       {!gameEditionView && <GameModeIcon style={{ marginRight: 9.4 }} />}
//       <span style={{ fontFamily: commonTheme.fontFamily.syncopate, whiteSpace: 'nowrap' }}>{gameEditionView ? 'EXIT GAME MODE' : 'GAME MODE'}</span>

//       {/* 
//          : (
//            <>
//              {gameEditionView && <ObliqueStrokeIcon style={{ position: 'absolute' }} />}
//              <GameModeIcon />
//            </>
//          ) */}
//     </Button>
//   ) : (
//     <></>
//   );
// };

// export default GameEditionModeButton;
