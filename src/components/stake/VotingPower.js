import React from 'react';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';
import CommonWrapper from './CommonWrapper';

const VotingPower = () => {
  return (
    <CommonWrapper title="voting power">
      <div className="flex align-ce">
        <Label>multiplater (m)</Label>
        <InfoPopup></InfoPopup>
      </div>
    </CommonWrapper>
  );
};

export default VotingPower;
