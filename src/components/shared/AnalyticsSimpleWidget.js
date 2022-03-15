import React from 'react';
import { CardContainer } from '../stats/StatsTab';
import Label from './Label';
import GradientBorder from './GradientBorder';
import { GraphCardHeader } from '../../components/charts/TVLChart';

const AnalyticsSimpleWidget = ({ title, containerStyle, mainText, subtitle }) => {
  return (
    <CardContainer style={containerStyle}>
      <GradientBorder />
      <GraphCardHeader>
        <div>
          <Label fontSize={16}>{title}</Label>
          <Label fontSize={24}>{mainText}</Label>
          <Label>{subtitle}</Label>
        </div>
      </GraphCardHeader>
    </CardContainer>
  );
};

export default AnalyticsSimpleWidget;
