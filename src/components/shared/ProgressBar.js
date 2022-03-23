import React from 'react';
import styled from 'styled-components';
import { FlexContainer } from './FlexContainer';
import Label from './Label';

const STYMaxSupplyContainer = styled.div`
  border: 1px solid ${({ theme: { colors } }) => `${colors.white}99`};
  border-radius: 10px;
  width: 100%;
  background: ${({ theme: { colors } }) => `${colors.grey}99`};
`;

const STYMaxSupply = styled.div`
  height: 8px;
  background: ${({ darkBar }) =>
    darkBar ? 'linear-gradient(to right, #E0E0E0, #5C5C5C99, #E0E0E0)' : 'linear-gradient(to right, #5dcbe5, #e37480, #f6cc7d)'};
  border-radius: 10px;
  width: ${({ width }) => width}%;
`;

const PercetageIndicator = styled(FlexContainer)`
  position: relative;
  flex-direction: column;
  align-items: center;
  & > *:not(:last-child) {
    margin-bottom: 6px;
  }
  span {
    font-family: ${({ theme: { fontFamily } }) => fontFamily.basier} !important;
    font-size: 13px;
  }
`;

const ProgressBar = ({ currentValue, maxValue, topLabelLeft, withBottomLabel, darkBar }) => {
  const getPercentage = (current, max) => {
    if (current <= maxValue) return (100 * current) / max;
    else return 100;
  };

  return (
    <>
      {topLabelLeft && (
        <FlexContainer className="justify-sb align-ce w-100">
          <Label fontSize={13}>{topLabelLeft}</Label>
          <Label fontSize={13}>{getPercentage(currentValue, maxValue).toFixed(1)}%</Label>
        </FlexContainer>
      )}
      <STYMaxSupplyContainer>
        <STYMaxSupply darkBar={darkBar} width={getPercentage(currentValue, maxValue)} />
      </STYMaxSupplyContainer>
      {withBottomLabel && (
        <FlexContainer className="justify-sb align-ce w-100" gap={16}>
          <PercetageIndicator>
            <Label>0</Label>
          </PercetageIndicator>
          <PercetageIndicator>
            <Label labelStyle={{ position: 'absolute', bottom: 17 }}>|</Label>
            <Label>1.5</Label>
          </PercetageIndicator>
          <PercetageIndicator>
            <Label>2.5</Label>
          </PercetageIndicator>
        </FlexContainer>
      )}
    </>
  );
};

export default ProgressBar;
