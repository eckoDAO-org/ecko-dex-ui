import React from 'react';
import { EquationContainer } from '../shared/FlexContainer';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';
import ProgressBar from '../shared/ProgressBar';
import CommonWrapper from './CommonWrapper';
import { VotingPowerFormulaIcon } from '../../assets';

const VotingPower = ({ daoAccountData }) => {
  return (
    <CommonWrapper
      gap={16}
      containerStyle={{ marginTop: 24 }}
      cardStyle={{ paddingBottom: 60 }}
      title={
        <EquationContainer className="flex align-ce" mobileStyle={{ flexDirection: 'column', display: 'flex' }}>
          <Label fontFamily="syncopate" fontSize={24} labelStyle={{ marginRight: 16 }}>
            Voting Power (V)
          </Label>
          <VotingPowerFormulaIcon width={88} />
          <Label fontSize={38} className="gradient" fontFamily="syncopate" labelStyle={{ marginLeft: 20 }}>
            {daoAccountData?.vp}
          </Label>
        </EquationContainer>
      }
    >
      <div className="flex align-ce">
        <Label fontFamily="syncopate" fontSize={16}>
          multiplier (m)
        </Label>

        <InfoPopup centerIcon>
          The Voting Power Multiplier is a time-dependent function of your KDX staking amount and meaningful contributions (Vibedust). In 60 days the
          multiplier value goes up to 1 and can reach 2.5 over the course of 4 years.
        </InfoPopup>

        {daoAccountData?.multiplier && <Label labelStyle={{ marginLeft: 8 }}>{daoAccountData?.multiplier?.toFixed(5)}</Label>}
      </div>

      <div>
        <ProgressBar
          maxValue={2.5}
          currentValue={daoAccountData?.multiplier || 0}
          values={[
            { value: 0, label: 'START' },
            { value: 0.5, label: '7d' },
            { value: 1, label: '2m' },
            { value: 1.5, label: '8.25m' },
            { value: 2, label: '22m' },
            { value: 2.5, label: '4y' },
          ]}
        />
      </div>
    </CommonWrapper>
  );
};

export default VotingPower;
