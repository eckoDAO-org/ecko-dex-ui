import React from 'react';
import { TradeDownIcon, TradeUpIcon } from '../../assets';
import { commonColors } from '../../styles/theme';
import { FlexContainer } from './FlexContainer';
import Label from './Label';

const GraphicPercetage = ({ prevValue, currentValue }) => {
  const getPercentage = (a, b) => {
    return ((b - a) / a) * 100;
  };

  const percentage = getPercentage(prevValue, currentValue);

  return (
    <FlexContainer
      gap={8}
      className="align-ce"
      style={{ background: percentage >= 0 ? commonColors.green : commonColors.red, padding: '2px 8px', borderRadius: 20, marginTop: 10 }}
    >
      {percentage >= 0 ? <TradeUpIcon className="svg-app-color" /> : <TradeDownIcon className="svg-app-color" />}
      <Label>
        {percentage >= 0 ? '+' : '-'} {Math.abs(percentage.toFixed(1))}%
      </Label>
    </FlexContainer>
  );
};

export default GraphicPercetage;