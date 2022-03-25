import React from 'react';
import { EquationContainer } from '../shared/FlexContainer';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';
import ProgressBar from '../shared/ProgressBar';
import CommonWrapper from './CommonWrapper';
import { VotingPowerFormulaIcon } from '../../assets';

const VotingPower = () => {
  return (
    <CommonWrapper
      gap={16}
      containerStyle={{ marginTop: 24 }}
      cardStyle={{ paddingBottom: 60 }}
      title={
        <EquationContainer className="flex align-ce">
          <Label fontFamily="syncopate" fontSize={24} labelStyle={{ marginRight: 16 }}>
            Voting Power (V)
          </Label>
          {/* <Equation className="equation" value="V = root(2, P*M)" /> */}
          <VotingPowerFormulaIcon width={88} />
        </EquationContainer>
      }
    >
      <div className="flex align-ce">
        <Label fontFamily="syncopate" fontSize={16}>
          multiplayer (m)
        </Label>

        <InfoPopup>
          The Voting Power Multiplier is a time-dependent function of your KDX staking amount and meaningful contributions (Vibedust). In 60 days the
          multiplier value goes up to 1 and can reach 2.5 over the course of 4 years.
        </InfoPopup>
      </div>

      <div>
        <ProgressBar
          maxValue={2.5}
          currentValue={1.1}
          values={[{ value: 0, label: 'START' }, { value: 0.5, label: '30d' }, { value: 1, label: '60d' }, 1.5, 2, { value: 2.5, label: '4Y' }]}
        />
      </div>
    </CommonWrapper>
  );
};

export default VotingPower;
