/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import ProgressBar from '../shared/ProgressBar';
import { InfoIcon } from '../../assets/index.js';

const VotingPowerContainer = () => {
  return (
    <FlexContainer className="column">
      <FlexContainer className="column" gap={10} style={{ height: 'min-content', marginBottom: 18 }} desktopStyle={{ width: 268 }}>
        <Label fontSize={16} fontFamily="syncopate">
          voting power (V)
        </Label>
        <Label fontSize={13}>
          V = &radic;<span style={{ textDecoration: 'overline' }}>&nbsp;P * M&nbsp;</span>
        </Label>
        <Label fontSize={38} className="gradient" fontFamily="syncopate">
          1234324
        </Label>
      </FlexContainer>
      <FlexContainer className="column" gap={10} withGradient style={{ height: 'min-content' }} desktopStyle={{ width: 268 }}>
        <FlexContainer className="column" style={{ marginBottom: 6 }}>
          <Label fontSize={13} info="position info">
            Position (P)
          </Label>
          <FlexContainer className="justify-sb">
            <Label fontSize={32}>1020123</Label>
            <Label fontSize={32}>KDX</Label>
          </FlexContainer>
        </FlexContainer>
        <Label fontSize={13} info="multiplier info" labelStyle={{ marginBottom: 10 }}>
          Multiplier (M)
        </Label>
        <ProgressBar withBottomLabel currentValue={2} maxValue={3} />
      </FlexContainer>
    </FlexContainer>
  );
};

export default VotingPowerContainer;
