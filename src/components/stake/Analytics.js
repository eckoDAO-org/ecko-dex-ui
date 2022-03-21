import React from 'react';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';
import CommonWrapper from './CommonWrapper';

const Analytics = ({ apr, volume, stakedShare, totalStaked }) => {
  return (
    <CommonWrapper title="analytics" gap={24}>
      <div>
        <div className="flex align-ce">
          <Label>APR</Label>
          <InfoPopup>
            Standing for Annual Percentage Rate, it shows the estimated yearly interest generated by your stake. It does not take compounding into
            account.
          </InfoPopup>
        </div>
        <Label fontSize={32}>{apr}%</Label>
      </div>
      <div>
        <Label>Volume</Label>
        <Label fontSize={32}>{volume} USD</Label>
      </div>
      <div>
        <div className="flex align-ce">
          <Label>Staked Share</Label>
          <InfoPopup>Your personal percentage share of KDX amongst all the KDX currently being staked.</InfoPopup>
        </div>
        <Label fontSize={32}>{stakedShare} %</Label>
      </div>
      <div>
        <Label>Total Staked</Label>
        <Label fontSize={32}>{totalStaked} %</Label>
      </div>
    </CommonWrapper>
  );
};

export default Analytics;