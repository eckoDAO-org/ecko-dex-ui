import React from 'react';
import styled from 'styled-components/macro';
import { KaddexLetterLogo } from '../assets';

const LogoLoaderContainer = styled.div`
   {
    .rotate {
      animation: rotation 3s infinite linear;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }

    @keyframes rotation {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotateY(359deg);
      }
    }
  }
`;

const LogoLoader = () => {
  return (
    <LogoLoaderContainer>
      <KaddexLetterLogo class="rotate" />
    </LogoLoaderContainer>
  );
};
export default LogoLoader;
