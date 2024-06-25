import React from 'react';
import styled, { css } from 'styled-components/macro';
import useWindowSize from '../../hooks/useWindowSize';
import theme from '../../styles/theme';
import browserDetection from '../../utils/browserDetection';
import { useGameEditionContext } from '../../contexts';

export const FlexContainer = ({
  reference,
  className,
  gameEditionClassName,
  desktopClassName,
  desktopPixel,
  mobilePixel,
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
  const { gameEditionView } = useGameEditionContext();

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
      if (width < (mobilePixel || theme.mediaQueries.mobilePixel) && mobileClassName) {
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
      {children}
    </STYFlexContainer>
  );
};
const STYFlexContainer = styled.div`
  display: flex;

  ${({ gameEditionView, outOfGameEdition, withGradient }) => {
    if ((!gameEditionView || outOfGameEdition) && withGradient) {
      return css`
        border-radius: 20px;
        background: ${({ theme: { backgroundContainer } }) => {
          return backgroundContainer;
        }};

        background-clip: padding-box, border-box;
        background-origin: padding-box, border-box;
        border: ${({ theme: { colors } }) => `1px solid ${colors.white}66`};
        position: relative;
        border-radius: 10px;
        backdrop-filter: blur(50px);
        padding: 16px;
        :not(.gradient-button) {
          box-shadow: 2px 5px 24px #21275029;
        }
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
  
  ::-webkit-scrollbar {
    display: auto;
    width: 7px !important;
    height: 7px !important;
  }

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

  &.column-reverse {
    flex-direction: column-reverse;
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
    row-gap: ${({ gridColumnGap = 30 }) => gridColumnGap}px;
    column-gap: ${({ gridColumnGap = 30 }) => gridColumnGap}px;
  }
`;

export const CryptoContainer = styled.div`
  img {
    width: ${({ size = 32 }) => `${size}px`}!important;
    height: ${({ size = 32 }) => `${size}px`}!important;
  }
  svg {
    width: ${({ size = 32 }) => `${size}px`}!important;
    height: ${({ size = 32 }) => `${size}px`}!important;
    path {
      fill: #212750 !important;
    }
  }
`;

export const EquationContainer = styled(FlexContainer)`
  svg {
    path,
    rect {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
  .equation span {
    color: ${({ theme: { colors } }) => colors.white};
    font-family: ${({ theme: { fontFamily } }) => fontFamily.basier};
  }
`;
