import React from 'react';
import { EquationContainer } from '../shared/FlexContainer';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';
import ProgressBar from '../shared/ProgressBar';
import CommonWrapper from './CommonWrapper';
import { VotingPowerFormulaIcon } from '../../assets';
import { extractDecimal, humanReadableNumber } from '../../utils/reduceBalance';

const VotingPower = ({ daoAccountData }) => {
  return (
    <CommonWrapper
      gap={16}
      containerStyle={{ marginTop: 24 }}
      cardStyle={{ paddingBottom: 60 }}
      title={
        <EquationContainer className="flex align-ce" mobileStyle={{ flexDirection: 'column', display: 'flex', alignItems: 'flex-start' }}>
          <Label fontFamily="syncopate" fontSize={16} labelStyle={{ marginRight: 16 }}>
            Voting Power (V)
          </Label>
          <VotingPowerFormulaIcon width={88} height={37} style={{ marginRight: 20 }} />
          <Label fontSize={32} fontFamily="syncopate">
            {daoAccountData?.vp
              ? daoAccountData?.vp >= 1000
                ? humanReadableNumber(extractDecimal(daoAccountData.vp).toFixed(2))
                : extractDecimal(daoAccountData.vp).toFixed(5)
              : '-'}
          </Label>
        </EquationContainer>
      }
    >
      <div className="flex align-ce">
        <Label fontFamily="syncopate" fontSize={16}>
          multiplier (m)
        </Label>

        <InfoPopup size={16} type="modal" title="Multiplier">
          <Label>
            The Voting Power Multiplier is a time-dependent function of your KDX staking amount. In 60 days the multiplier value goes up to 1 and can
            reach 2.5 over the course of 4 years.
          </Label>
        </InfoPopup>

        {daoAccountData?.multiplier ? <Label labelStyle={{ marginLeft: 8 }}>{daoAccountData?.multiplier?.toFixed(5)} x</Label> : ''}
      </div>

      <div>
        <ProgressBar
          maxValue={2.5}
          currentValue={daoAccountData?.multiplier || 0}
          values={[
            { value: 0, label: 'Start' },
            { value: 0.5, label: '7d' },
            { value: 1, label: '2M' },
            { value: 1.5, label: '8.25M' },
            { value: 2, label: '22M' },
            { value: 2.5, label: '4y' },
          ]}
        />
      </div>
    </CommonWrapper>
  );
};

export default VotingPower;
