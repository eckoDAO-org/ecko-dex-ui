import React from 'react';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';
import ProgressBar from '../shared/ProgressBar';
import CommonWrapper from './CommonWrapper';

const VotingPower = () => {
  return (
    <CommonWrapper
      gap={16}
      containerStyle={{ marginTop: 24 }}
      cardStyle={{ paddingBottom: 32 }}
      title={
        <div>
          <Label fontFamily="syncopate" fontSize={24}>
            Voting Power (V)
          </Label>
        </div>
      }
    >
      <div className="flex align-ce">
        <Label fontFamily="syncopate" fontSize={16}>
          multiplayer (m)
        </Label>
        <InfoPopup></InfoPopup>
      </div>

      <div>
        <ProgressBar maxValue={1.5} currentValue={1.1} bottomValues={[0, 0.75, 1.5]} />
      </div>
    </CommonWrapper>
  );
};

export default VotingPower;
