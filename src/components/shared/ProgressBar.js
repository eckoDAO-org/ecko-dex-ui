import React from 'react';
import styled from 'styled-components';
import { getPercentage } from '../../utils/string-utils';
import { FlexContainer } from './FlexContainer';
import Label from './Label';

const STYMaxSupplyContainer = styled.div`
  position: relative;
  border: 1px solid ${({ theme: { colors } }) => `${colors.white}99`};
  border-radius: 10px;
  width: 100%;
  background: ${({ theme: { backgroundProgressBar } }) => `${backgroundProgressBar}`};
`;

const STYMaxSupply = styled.div`
  height: 8px;
  background: ${({ darkBar, activeBackground }) =>
    darkBar ? 'linear-gradient(to right, #E0E0E0, #5C5C5C99, #E0E0E0)' : activeBackground || 'linear-gradient(to right,#FFD300, #FF00B8)'};
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
    font-size: 13px;
  }
`;

const SubLabel = styled(Label)`
  font-size: 16px;
  margin-top: 4px;
  opacity: 0.7;
`;

const ProgressBar = ({ currentValue, maxValue, topLabelLeft, bottomValues, withBottomLabel, values, darkBar, activeBackground, containerStyle }) => {
  return (
    <FlexContainer className="column w-100" style={containerStyle}>
      {topLabelLeft && (
        <FlexContainer className="justify-sb align-ce w-100" style={{ marginBottom: 8 }}>
          <Label fontSize={13}>{topLabelLeft}</Label>
          <Label fontSize={13}>{getPercentage(currentValue, maxValue).toFixed(1)} %</Label>
        </FlexContainer>
      )}
      <STYMaxSupplyContainer>
        <STYMaxSupply darkBar={darkBar} activeBackground={activeBackground} width={getPercentage(currentValue, maxValue)} />

        {values && (
          <FlexContainer className="align-ce w-100">
            {values?.map((v, i) => {
              const width = (typeof v === 'number' ? v : v.value).toString().length * 8;
              let left = 0;
              if (i === 0) {
                left = '0px';
              } else if (i === values.length - 1) {
                left = `calc(${getPercentage(typeof v === 'number' ? v : v.value, maxValue)}% - ${width}px)`;
              } else {
                left = `calc(${getPercentage(typeof v === 'number' ? v : v.value, maxValue)}% - ${width / 2}px)`;
              }
              return (
                <PercetageIndicator
                  key={i}
                  style={{
                    alignItems: i === 0 && 'flex-start',
                    position: 'absolute',
                    left,
                    top: 14,
                  }}
                >
                  {/* <Indicator /> */}
                  {/* <Indicator style={{ visibility: i === 0 || i === values.length - 1 ? 'hidden' : 'visible' }} />*/}
                  <Label>{typeof v === 'number' ? v.toString() : v.value.toString()}</Label>
                  {v?.label && <SubLabel labelStyle={{ fontWeight: 'bold' }}>{v.label}</SubLabel>}
                </PercetageIndicator>
              );
            })}
          </FlexContainer>
        )}
      </STYMaxSupplyContainer>
      {/* 
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
      )} */}
    </FlexContainer>
  );
};

export default ProgressBar;

// const Indicator = styled.div`
//   background-color: ${({ theme: { colors } }) => colors.white};
//   height: 20px;
//   width: 1px;
// `;
