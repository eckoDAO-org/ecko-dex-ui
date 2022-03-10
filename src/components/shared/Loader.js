import React from 'react';
import styled from 'styled-components/macro';
import { KaddexLetterLogo } from '../../assets';
import { useGameEditionContext } from '../../contexts';

const LogoLoader = ({ withTopMargin, containerStyle, logoStyle }) => {
  return (
    <LogoLoaderContainer withTopMargin={withTopMargin} style={containerStyle}>
      <KaddexLetterLogo className="rotate" style={logoStyle} />
    </LogoLoaderContainer>
  );
};

export const GameEditionLoader = ({ style }) => {
  return (
    <GeLoaderContainer style={style}>
      <GeLoader className="loader">
        <span></span>
      </GeLoader>
    </GeLoaderContainer>
  );
};

const Loader = ({ withTopMargin, containerStyle, logoStyle }) => {
  const { gameEditionView } = useGameEditionContext();
  return gameEditionView ? <GameEditionLoader /> : <LogoLoader withTopMargin={withTopMargin} containerStyle={containerStyle} logoStyle={logoStyle} />;
};

export default Loader;

const LogoLoaderContainer = styled.div`
   {
    .rotate {
      -webkit-animation-name: rotation;
      -webkit-animation-duration: 2s;
      -webkit-animation-iteration-count: infinite;
      -webkit-animation-timing-function: linear;

      /* -webkit-animation: rotation 2s infinite linear; */
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin-top: ${({ withTopMargin }) => withTopMargin && '24px'};
    }

    @keyframes rotation {
      0% {
        -webkit-transform: rotateY(0deg);
      }
      50% {
        -webkit-transform: rotateY(179deg);
      }
      100% {
        -webkit-transform: rotateY(359deg);
      }
    }
  }
`;

const GeLoaderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
  margin-bottom: 4px;
  z-index: 1;
`;
const GeLoader = styled.div`
  &.loader {
    position: relative;
    width: 37px;
    height: 37px;
    overflow: hidden;
    border-radius: 50%;
  }

  &.loader:before {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    z-index: 10;
    border-radius: 50%;
    border: 2px solid #240229;
    background: black;
  }

  &.loader span {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-image: linear-gradient(-225deg, #ff7402 0%, #ffe700 50%, #fff55e 100%);

    /* filter: blur(20px); */
    z-index: -1;
    animation: animate 0.5s linear infinite;
  }

  @keyframes animate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
