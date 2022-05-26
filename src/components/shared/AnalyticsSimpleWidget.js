import React from 'react';
import styled from 'styled-components/macro';
import Label from './Label';
import { FlexContainer } from './FlexContainer';

const IconContainer = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: flex-end;
  svg {
    height: 24px;
    width: auto;
    path {
      fill: ${({ theme: { colors } }) => `${colors.white}99`};
    }
  }
`;

const AnalyticsSimpleWidget = ({ title, mainText, subtitle, rightComponent, icon }) => {
  return (
    <FlexContainer withGradient className="relative w-100 column  background-fill" style={{ padding: 32, zIndex: 1 }}>
      <div className=" w-100 flex">
        <div className="flex column w-100 justify-sb">
          <Label fontSize={16}>{title}</Label>
          <Label fontSize={24}>{mainText}</Label>
        </div>
        {rightComponent && <div>{rightComponent}</div>}
      </div>

      <Label>{subtitle}</Label>
      {icon && <IconContainer>{icon}</IconContainer>}
    </FlexContainer>
  );
};

export default AnalyticsSimpleWidget;
