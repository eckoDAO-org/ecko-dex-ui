import React from 'react';
import { TradeDownIcon, TradeUpIcon } from '../../assets';
import { commonColors } from '../../styles/theme';
import { FlexContainer } from './FlexContainer';
import Label from './Label';

const GraphicPercentage = ({ prevValue, currentValue, percentageValue, componentStyle }) => {
  const getPercentage = (a, b) => {
    return ((b - a) / a) * 100;
  };

  // if there are prevValue and currentValue, the component returns getPercentage of these value.
  // if percentageValue is passed at the commponent, this return directly this value
  const percentage = percentageValue || getPercentage(prevValue, currentValue);

  return percentageValue || (prevValue && currentValue && prevValue !== 0) ? (
    <FlexContainer
      gap={8}
      className="align-ce"
      style={{
        minWidth: 105,
        background: percentage >= 0 ? commonColors.green : commonColors.redComponent,
        padding: '2px 8px',
        borderRadius: 20,
        marginTop: 7,
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
    <FlexContainer
      gap={8}
      className="align-ce justify-ce"
      style={{
        minWidth: 105,
        background: percentage >= 0 ? commonColors.green : commonColors.redComponent,
        padding: '2px 8px',
        borderRadius: 20,
        marginTop: 7,
        ...componentStyle,
      }}
    >
      {percentage >= 0 ? <TradeUpIcon /> : <TradeDownIcon />}
      {<Label color="white">{percentage >= 0 ? '+' : '-'} 0 %</Label>}
    </FlexContainer>
  );
};

export default GraphicPercentage;
