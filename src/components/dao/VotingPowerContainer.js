/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { VotingPowerFormulaIcon } from '../../assets';
import { usePactContext } from '../../contexts';
import { extractDecimal, humanReadableNumber } from '../../utils/reduceBalance';
import { EquationContainer, FlexContainer } from '../shared/FlexContainer';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';
import ProgressBar from '../shared/ProgressBar';
import VotingPowerInfo from './VotingPowerInfo';

const VotingPowerContainer = ({ accountData }) => {
  const { kdxPrice } = usePactContext();
  return (
    <FlexContainer gap={10} className="column" mobileStyle={{ marginBottom: 16 }}>
      <FlexContainer>
        <Label fontSize={16} fontFamily="syncopate">
          voting power (V)
        </Label>
        <InfoPopup size={16} type="modal" title="Voting Power (V)" centerIcon>
          <VotingPowerInfo />
        </InfoPopup>
      </FlexContainer>
      <EquationContainer className="flex align-ce">
        <VotingPowerFormulaIcon width={88} height={25} />
      </EquationContainer>
      <FlexContainer className="column background-fill" gap={10} withGradient style={{ height: 'min-content' }} desktopStyle={{ width: 268 }}>
        <FlexContainer className="column" gap={4} style={{ height: 'min-content' }} desktopStyle={{ width: 268 }}>
          <Label fontSize={32} className="gradient" fontFamily="syncopate" labelStyle={{ maxWidth: 'min-content', marginBottom: 10 }}>
            {accountData.vp
              ? accountData.vp >= 1000
                ? humanReadableNumber(extractDecimal(accountData.vp).toFixed(2))
                : extractDecimal(accountData.vp).toFixed(5)
              : '-'}
          </Label>
        </FlexContainer>

        <FlexContainer className="column" style={{ marginBottom: 6 }}>
          <Label fontSize={13} labelStyle={{ marginBottom: 10 }}>
            Position (P)
          </Label>

          <Label fontSize={20}>
            {accountData['staked-amount'] ? humanReadableNumber(extractDecimal(accountData['staked-amount']).toFixed(2)) : '-'} KDX
          </Label>
          <Label fontSize={14} labelStyle={{ marginTop: 6, marginBottom: 10, opacity: 0.7 }}>
            {accountData['staked-amount'] ? humanReadableNumber((kdxPrice * extractDecimal(accountData['staked-amount']))?.toFixed(2)) : '-'} USD
          </Label>
        </FlexContainer>

        <Label fontSize={13}>Multiplier (M)</Label>
        <Label fontSize={14}>{accountData?.multiplier?.toFixed(5)} x</Label>
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
