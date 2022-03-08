import React from 'react';
import styled from 'styled-components/macro';
import { useApplicationContext } from '../../contexts';
import { FlexContainer } from './FlexContainer';

const STYContainer = styled(FlexContainer)`
  display: flex;
  padding: ${({ padding = 16 }) => padding}px;
  background: ${({ theme: { backgroundContainer }, backgroundColor }) => backgroundColor || backgroundContainer};
  border-radius: 10px;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    padding: 16px;
  }
  backdrop-filter: blur(50px);

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

const GradientContainer = ({
  padding,
  gap,
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
  backgroundImage,
  hideGradient,
  backgroundColor,
}) => {
  const { themeMode } = useApplicationContext();
  return (
    <STYContainer
      className={`column ${className}`}
      padding={padding}
      gap={gap}
      style={style}
      themeMode={themeMode}
      backgroundColor={backgroundColor}
      reference={reference}
      gameEditionClassName={gameEditionClassName}
      desktopClassName={desktopClassName}
      desktopPixel={desktopPixel}
      mobileClassName={mobileClassName}
      tabletClassName={tabletClassName}
      desktopStyle={desktopStyle}
      tabletStyle={tabletStyle}
      mobileStyle={mobileStyle}
      backgroundImage={backgroundImage}
    >
      {!hideGradient && <STYGradientBorder />}
      {children}
    </STYContainer>
  );
};

export default GradientContainer;
