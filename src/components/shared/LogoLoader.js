import React from 'react';
import styled from 'styled-components/macro';
import { KaddexLetterLogo } from '../../assets';

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

const LogoLoader = ({ withTopMargin, containerStyle }) => {
  return (
    <LogoLoaderContainer withTopMargin={withTopMargin} style={containerStyle}>
      <KaddexLetterLogo className="rotate" />
    </LogoLoaderContainer>
  );
};
export default LogoLoader;
