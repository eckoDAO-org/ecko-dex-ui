import React from 'react';
import styled, { css } from 'styled-components/macro';
import { useApplicationContext } from '../../contexts';

const STYContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: ${({ padding = 16 }) => padding}px;
  background: ${({ theme: { backgroundContainer }, backgroundColor }) => backgroundColor || backgroundContainer};
  border-radius: 10px;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    padding: 16px;
  }
  backdrop-filter: blur(50px);
  ${({ gap }) => {
    if (gap) {
      return css`
        & > *:not(:last-child) {
          margin-bottom: ${() => (typeof rowGap === 'number' ? gap : 16)}px;
        }
      `;
    }
    return null;
  }}
  box-shadow: ${({ themeMode }) => themeMode === 'light' && ' 2px 5px 30px #00000029'};
`;

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
  z-index: -10;
`;

const GradientContainer = ({ className, children, padding, gap, style, hideGradient, backgroundColor }) => {
  const { themeMode } = useApplicationContext();
  return (
    <STYContainer className={className} padding={padding} gap={gap} style={style} themeMode={themeMode} backgroundColor={backgroundColor}>
      {!hideGradient && <STYGradientBorder />}
      {children}
    </STYContainer>
  );
};

export default GradientContainer;
