import React from 'react';
import styled from 'styled-components/macro';
import { EckoLogoLoader } from '../../assets';
import { useGameEditionContext } from '../../contexts';

const LogoLoader = ({ withTopMargin, containerStyle, logoStyle }) => {
  return (
    <LogoLoaderContainer withTopMargin={withTopMargin} style={containerStyle}>
      <EckoLogoLoader className="rotate" style={logoStyle} />
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

export const CircularLoader = () => {
  return <CircularLoaderContainer />;
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

const CircularLoaderContainer = styled.div`
  font-size: 10px;
  margin: 50px auto;
  text-indent: -9999em;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ theme: { colors } }) => colors.white};
  background: ${({ theme: { colors } }) => `-moz-linear-gradient(left, ${colors.white} 10%, rgba(255, 255, 255, 0) 42%)`};
  background: ${({ theme: { colors } }) => `-webkit-linear-gradient(left, ${colors.white} 10%, rgba(255, 255, 255, 0) 42%)`};
  background: ${({ theme: { colors } }) => `-o-linear-gradient(left, ${colors.white} 10%, rgba(255, 255, 255, 0) 42%)`};
  background: ${({ theme: { colors } }) => `-ms-linear-gradient(left, ${colors.white} 10%, rgba(255, 255, 255, 0) 42%)`};
  background: ${({ theme: { colors } }) => `-linear-gradient(left, ${colors.white} 10%, rgba(255, 255, 255, 0) 42%)`};
  position: relative;
  -webkit-animation: load3 1.4s infinite linear;
  animation: load3 1.4s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);

  :before {
    width: 65%;
    height: 65%;
    background: ${({ theme: { colors } }) => colors.white};
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }
  :after {
    background: ${({ theme: { backgroundContainer } }) => backgroundContainer};
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  @-webkit-keyframes load3 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load3 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;
