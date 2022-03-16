import React, { useContext } from 'react';
import styled, { css } from 'styled-components/macro';
import useWindowSize from '../../hooks/useWindowSize';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import theme from '../../styles/theme';
import browserDetection from '../../utils/browserDetection';

export const STYGradientBorder = styled.div`
  border-radius: 10px; /*1*/
  border: 1px solid transparent; /*2*/
  background: linear-gradient(90deg, #ed1cb5, #ffa900, #39fffc) border-box; /*3*/

  -webkit-mask: /*4*/ linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: source-out !important; /*5'*/
  mask-composite: exclude !important; /*5*/
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  z-index: -1;

  &.gradient-button {
    border-radius: 20px;
    background: linear-gradient(90deg, #10c4df, #f04ca9, #edba31) border-box; /*3*/
  }
`;

export const FlexContainer = ({
  reference,
  className,
  gameEditionClassName,
  desktopClassName,
  desktopPixel,
  mobileClassName,
  tabletClassName,
  children,
  desktopStyle,
  style,
  tabletStyle,
  mobileStyle,
  gameEditionStyle,
  backgroundImage,
  withGradient,
  gradientColors,
  outOfGameEdition,
  ...rest
}) => {
  const [width] = useWindowSize();
  const { gameEditionView } = useContext(GameEditionContext);

  const getClassName = () => {
    let classname = className;

    if (gameEditionView && !outOfGameEdition) {
      classname = `${className} ${gameEditionClassName}`;
    } else {
      if (width >= (desktopPixel || theme.mediaQueries.desktopPixel) && desktopClassName) {
        classname = `${classname} ${desktopClassName} `;
      }
      if (width < (desktopPixel || theme.mediaQueries.desktopPixel) && width >= theme.mediaQueries.mobilePixel && tabletClassName) {
        classname = `${classname} ${tabletClassName} `;
      }
      if (width < theme.mediaQueries.mobilePixel && mobileClassName) {
        classname = `${classname} ${mobileClassName} `;
      }
    }
    return classname;
  };
  return (
    <STYFlexContainer
      {...rest}
      ref={reference}
      className={getClassName()}
      backgroundImage={backgroundImage}
      withGradient={withGradient || className?.includes('gradient-button')}
      gameEditionView={gameEditionView}
      outOfGameEdition={outOfGameEdition}
      style={
        gameEditionView
          ? { ...gameEditionStyle }
          : {
              ...style,
              ...(width >= (desktopPixel || theme.mediaQueries.desktopPixel) && desktopStyle),
              ...(width < (desktopPixel || theme.mediaQueries.desktopPixel) && width >= theme.mediaQueries.mobilePixel && tabletStyle),
              ...(width < theme.mediaQueries.mobilePixel && mobileStyle),
            }
      }
    >
      {(withGradient || className?.includes('gradient-button')) && (!gameEditionView || outOfGameEdition) && (
        <STYGradientBorder className={className?.includes('gradient-button') ? 'gradient-button' : ''} />
      )}
      {children}
    </STYFlexContainer>
  );
};
const STYFlexContainer = styled.div`
  display: flex;

  ${({ gameEditionView, outOfGameEdition }) => {
    if (!gameEditionView || outOfGameEdition) {
      return css`
        &.background-fill {
          backdrop-filter: blur(50px);
          background: ${({ theme: { backgroundContainer } }) => backgroundContainer};
        }
        ${({ withGradient }) =>
          withGradient &&
          css`
            border-radius: 10px;
            backdrop-filter: blur(50px);
            padding: 16px;
            :not(.gradient-button) {
              box-shadow: 2px 5px 24px #21275029;
            }
          `}
      `;
    }
  }}

  &.f-wrap {
    flex-wrap: wrap;

    ${({ gap }) => {
      if (gap) {
        const browser = browserDetection();

        if (browser === 'SAFARI') {
          return css`
            & > *:not(:last-child) {
              margin-bottom: ${gap}px;
            }
          `;
        }
      }
    }}
  }

  ${({ backgroundImage }) => {
    if (backgroundImage) {
      return css`
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        background-image: url(${backgroundImage});
      `;
    }
  }}

  ${({ gap }) => {
    if (gap) {
      const browser = browserDetection();

      if (browser === 'SAFARI') {
        return css`
          & > *:not(:last-child) {
            margin-right: ${gap}px;
          }
        `;
      } else
        return css`
          column-gap: ${({ gap }) => gap}px;
        `;
    }
  }}

  &.column {
    flex-direction: column;
    ${({ gap }) => {
      if (gap) {
        const browser = browserDetection();

        if (browser === 'SAFARI') {
          return css`
            & > *:not(:last-child) {
              margin-bottom: ${gap}px;
              margin-right: 0px;
            }
          `;
        } else
          return css`
            row-gap: ${({ gap }) => gap}px;
            column-gap: 0px;
          `;
      }
    }}
  }

  &.grid {
    display: grid;
    grid-template-columns: ${({ columns, px }) => `repeat(${columns}, ${px ? `${px}px` : '1fr'})`};
    row-gap: 30px;
    column-gap: ${({ gridColumnGap = 30 }) => gridColumnGap}px;
  }
`;

export const CryptoContainer = styled.div`
  img {
    width: ${({ size = 32 }) => `${size}px`}!important;
    height: ${({ size = 32 }) => `${size}px`}!important;
  }
`;
