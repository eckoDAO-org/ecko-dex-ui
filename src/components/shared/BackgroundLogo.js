import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Logo } from '../../assets';
import { FadeIn } from './animations';
import browserDetection from '../../utils/browserDetection';

const LogoContainer = styled(FadeIn)`
  position: absolute;
  left: 50%;
  top: 45%;
  margin-left: auto;
  margin-right: auto;

  transform: translate(-50%, 0);

  ${() => {
    if (browserDetection() === 'FIREFOX') {
      return css`
        -webkit-filter: blur(50px);
        -moz-filter: blur(50px);
        -ms-filter: blur(50px);
        -o-filter: blur(50px);
      `;
    }
  }}
`;

const BackgroundLogo = () => {
  return (
    <LogoContainer time={0.2}>
      <Logo />
    </LogoContainer>
  );
};

export default BackgroundLogo;
