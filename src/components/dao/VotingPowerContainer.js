/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { VotingPowerFormulaIcon } from '../../assets';
import { EquationContainer, FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import ProgressBar from '../shared/ProgressBar';

const positionInfo = `"Position" accrues your KDX holdings from both the Vaulting and the Staking Programs. 
                        Please note that all Second Sale participants are automatically staking their KDX while it is being vesting.`;

const multiplierInfo = `The Voting Power Multiplier is a time-dependent function of your KDX staking amount and meaningful contributions (Vibedust).
                         In 60 days the multiplier value goes up to 1 and can reach 2.5 over the course of 4 years.`;

const VotingPowerContainer = ({ accountData }) => {
  return (
    <FlexContainer className="column" mobileStyle={{ marginBottom: 16 }}>
      <FlexContainer className="column" gap={10} style={{ height: 'min-content', marginBottom: 18 }} desktopStyle={{ width: 268 }}>
        <Label fontSize={16} fontFamily="syncopate">
          voting power (V)
        </Label>
        <EquationContainer className="flex align-ce">
          <VotingPowerFormulaIcon width={88} />
        </EquationContainer>
        <Label fontSize={38} className="gradient" fontFamily="syncopate">
          {accountData.vp ? accountData.vp : '-'}
        </Label>
      </FlexContainer>
      <FlexContainer className="column" gap={10} withGradient style={{ height: 'min-content' }} desktopStyle={{ width: 268 }}>
        <FlexContainer className="column" style={{ marginBottom: 6 }}>
          <Label fontSize={13} info={positionInfo}>
            Position (P)
          </Label>
          <FlexContainer className="justify-sb">
            <Label fontSize={32}>{accountData['staked-amount'] ? accountData['staked-amount'] : '-'}</Label>
            <Label fontSize={32}>KDX</Label>
          </FlexContainer>
        </FlexContainer>
        <Label fontSize={13} info={multiplierInfo} labelStyle={{ marginBottom: 10 }}>
          Multiplier (M)
        </Label>
        <ProgressBar containerStyle={{ marginBottom: 24 }} currentValue={accountData.multiplier} maxValue={2.5} values={[0, 0.5, 1, 1.5, 2, 2.5]} />
      </FlexContainer>
    </FlexContainer>
  );
};

export default VotingPowerContainer;
