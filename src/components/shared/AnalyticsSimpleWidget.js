import React from 'react';
import Label from './Label';
import { FlexContainer } from './FlexContainer';

const AnalyticsSimpleWidget = ({ title, mainText, subtitle }) => {
  return (
    <FlexContainer withGradient className="column w-100" style={{ padding: 32 }}>
      <Label fontSize={16}>{title}</Label>
      <Label fontSize={24}>{mainText}</Label>
      <Label>{subtitle}</Label>
    </FlexContainer>
  );
};

export default AnalyticsSimpleWidget;
