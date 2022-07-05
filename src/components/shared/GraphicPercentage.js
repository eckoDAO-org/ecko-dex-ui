import React from 'react';
import { TradeDownIcon, TradeUpIcon } from '../../assets';
import { commonColors } from '../../styles/theme';
import { FlexContainer } from './FlexContainer';
import Label from './Label';

const GraphicPercentage = ({ prevValue, currentValue, componentStyle }) => {
  const getPercentage = (a, b) => {
    return ((b - a) / a) * 100;
  };

  const percentage = getPercentage(prevValue, currentValue);

  return prevValue !== 0 ? (
    <FlexContainer
      gap={8}
      className="align-ce"
      style={{
        background: percentage >= 0 ? commonColors.green : commonColors.redComponent,
        padding: '2px 8px',
        borderRadius: 20,
        marginTop: 10,
        ...componentStyle,
      }}
    >
      {percentage >= 0 ? <TradeUpIcon /> : <TradeDownIcon />}
      {
        <Label color="white">
          {percentage >= 0 ? '+' : '-'} {Math.abs((percentage || 0).toFixed(1))} %
        </Label>
      }
    </FlexContainer>
  ) : (
    '-'
  );
};

export default GraphicPercentage;
