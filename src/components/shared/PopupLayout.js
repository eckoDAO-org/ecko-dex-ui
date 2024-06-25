import React from 'react';
import styled from 'styled-components/macro';
import { useApplicationContext } from '../../contexts';
import { FlexContainer } from './FlexContainer';

const STYContainer = styled(FlexContainer)`
  display: flex;
  padding: ${({ padding = 16 }) => padding}px;
  background: ${({ theme: { backgroundContainer }, backgroundColor }) => backgroundColor || backgroundContainer};
  border-radius: 10px;
  border: ${({ theme: { colors } }) => `1px solid ${colors.white}66`};
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    padding: 16px;
  }
  backdrop-filter: blur(50px);

  box-shadow: ${({ themeMode }) => themeMode === 'light' && ' 2px 5px 30px #00000029'};
`;

const PopupLayout = ({
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
      {children}
    </STYContainer>
  );
};

export default PopupLayout;
