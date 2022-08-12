import React from 'react';
import styled from 'styled-components/macro';
import Label from './Label';
import { FlexContainer } from './FlexContainer';
import { useRightModalContext } from '../../contexts';
import CustomButton from './CustomButton';

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
      fill: ${({ theme: { colors }, iconColor }) => (iconColor ? iconColor : `${colors.white}99`)};
    }
  }
`;

const AnalyticsSimpleWidget = ({ title, mainText, subtitle, rightComponent, icon, iconColor, detailsContent }) => {
  const rightModalContext = useRightModalContext();
  return (
    <FlexContainer withGradient className="relative w-100 column  background-fill" style={{ padding: 32, zIndex: 1 }}>
      <div className=" w-100 flex">
        <div className="flex column w-100 justify-sb">
          <Label fontSize={16} labelStyle={{ marginBottom: 7 }}>
            {title}
          </Label>
          <Label fontSize={24}>{mainText}</Label>
        </div>
        {rightComponent && <div>{rightComponent}</div>}
      </div>

      <Label>{subtitle}</Label>
      {icon && <IconContainer iconColor={iconColor}>{icon}</IconContainer>}
      {detailsContent && (
        <CustomButton
          buttonStyle={{ position: 'absolute', right: 24, top: 24, padding: '4px 8px', width: 'min-content', height: 'min-content' }}
          fontSize={8}
          onClick={() =>
            rightModalContext.openModal({
              className: 'info-popup',
              title: `${title} details`,
              content: detailsContent,
              contentStyle: { padding: 16, paddingTop: 0 },
            })
          }
        >
          details
        </CustomButton>
      )}
    </FlexContainer>
  );
};

export default AnalyticsSimpleWidget;
