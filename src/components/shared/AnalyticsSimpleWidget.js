import React from 'react';
import Label from './Label';
import { FlexContainer } from './FlexContainer';

const AnalyticsSimpleWidget = ({ title, mainText, subtitle, rightComponent }) => {
  return (
    <FlexContainer withGradient className=" w-100 column  background-fill" style={{ padding: 32 }}>
      <div className=" w-100 flex">
        <div className="flex column w-100 justify-sb">
          <Label fontSize={16}>{title}</Label>
          <Label fontSize={24}>{mainText}</Label>
        </div>
        {rightComponent && <div>{rightComponent}</div>}
      </div>

      <Label>{subtitle}</Label>
    </FlexContainer>
  );
};

export default AnalyticsSimpleWidget;
