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
  background: linear-gradient(to right, #39fffc, #ed1cb5, #ffa900);
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

const ProgressBar = ({ currentValue, maxValue }) => {
  const getPercentage = (current, max) => {
    if (current <= maxValue) return (100 * current) / max;
    else return 100;
  };

  return (
    <>
      <STYMaxSupplyContainer>
        <STYMaxSupply width={getPercentage(currentValue, maxValue)} />
      </STYMaxSupplyContainer>
      <FlexContainer className="justify-sb align-ce w-100" gap={16}>
        <PercetageIndicator>
          <Label>0</Label>
        </PercetageIndicator>
        <PercetageIndicator>
          <Label labelStyle={{ position: 'absolute', bottom: 17 }}>|</Label>
          <Label>1.5</Label>
        </PercetageIndicator>
        <PercetageIndicator>
          <Label>3</Label>
        </PercetageIndicator>
      </FlexContainer>
    </>
  );
};

export default ProgressBar;
