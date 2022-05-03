/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { VotingPowerFormulaIcon } from '../../assets';
import { usePactContext } from '../../contexts';
import { extractDecimal } from '../../utils/reduceBalance';
import { EquationContainer, FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import ProgressBar from '../shared/ProgressBar';

const positionInfo = `"Position" accrues your KDX holdings from both the Vaulting and the Staking Programs. 
                        Please note that all Second Sale participants are automatically staking their KDX while it is being vesting.`;

const multiplierInfo = `The Voting Power Multiplier is a time-dependent function of your KDX staking amount and meaningful contributions (Vibedust).
                         In 60 days the multiplier value goes up to 1 and can reach 2.5 over the course of 4 years.`;

const VotingPowerContainer = ({ accountData }) => {
  const { kdxPrice } = usePactContext();
  return (
    <FlexContainer gap={10} className="column" mobileStyle={{ marginBottom: 16 }}>
      <FlexContainer>
        <Label fontSize={16} fontFamily="syncopate">
          voting power (V)
        </Label>
      </FlexContainer>
      <FlexContainer className="column background-fill" gap={10} withGradient style={{ height: 'min-content' }} desktopStyle={{ width: 268 }}>
        <FlexContainer className="column" gap={4} style={{ height: 'min-content' }} desktopStyle={{ width: 268 }}>
          <EquationContainer className="flex align-ce">
            <VotingPowerFormulaIcon width={88} height={25} />
          </EquationContainer>
          <Label fontSize={38} className="gradient" fontFamily="syncopate" labelStyle={{ maxWidth: 'min-content' }}>
            {accountData.vp ? extractDecimal(accountData.vp).toFixed(5) : '-'}
          </Label>
        </FlexContainer>

        <FlexContainer className="column" style={{ marginBottom: 6 }}>
          <Label fontSize={13} info={positionInfo}>
            Position (P)
          </Label>

          <Label fontSize={32}>{accountData['staked-amount'] ? extractDecimal(accountData['staked-amount']).toFixed(2) : '-'} KDX</Label>
          <Label fontSize={20} labelStyle={{ marginTop: 6 }}>
            {accountData['staked-amount'] ? (kdxPrice * extractDecimal(accountData['staked-amount'])).toFixed(2) : '-'} USD
          </Label>
        </FlexContainer>
        <Label fontSize={13} info={multiplierInfo} labelStyle={{ marginBottom: 10 }}>
          Multiplier (M)
        </Label>
        <ProgressBar
          containerStyle={{ marginBottom: 24 }}
          currentValue={accountData?.multiplier || 0}
          maxValue={2.5}
          values={[0, 0.5, 1, 1.5, 2, 2.5]}
        />
      </FlexContainer>
    </FlexContainer>
  );
};

export default VotingPowerContainer;
