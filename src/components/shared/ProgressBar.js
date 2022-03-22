import React from 'react';
import styled from 'styled-components';
import { FlexContainer } from './FlexContainer';
import Label from './Label';

const STYMaxSupplyContainer = styled.div`
  position: relative;
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

const ProgressBar = ({ currentValue, maxValue, topLabelLeft, bottomValues, withBottomLabel, darkBar }) => {
  const getPercentage = (current, max) => {
    if (current <= maxValue) return (100 * current) / max;
    else return 100;
  };

  return (
    <FlexContainer className="column">
      {topLabelLeft && (
        <FlexContainer className="justify-sb align-ce w-100">
          <Label fontSize={13}>{topLabelLeft}</Label>
          <Label fontSize={13}>{getPercentage(currentValue, maxValue).toFixed(1)}%</Label>
        </FlexContainer>
      )}
      <STYMaxSupplyContainer>
        <STYMaxSupply darkBar={darkBar} width={getPercentage(currentValue, maxValue)} />

        {bottomValues && (
          <FlexContainer className="align-ce w-100">
            {bottomValues?.map((v, i) => {
              const width = v.toString().length * 8;
              return (
                <PercetageIndicator
                  id={`value-${v}`}
                  key={i}
                  style={{ position: 'absolute', left: `calc(${getPercentage(v, maxValue)}% - ${width / 2}px)`, top: -6 }}
                >
                  <Indicator />
                  <Label>{v.toString()}</Label>
                </PercetageIndicator>
              );
            })}
          </FlexContainer>
        )}
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
            <Label>3</Label>
          </PercetageIndicator>
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

export default ProgressBar;

const Indicator = styled.div`
  background-color: ${({ theme: { colors } }) => colors.white};
  height: 20px;
  width: 1px;
`;
