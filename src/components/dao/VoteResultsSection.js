/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import ProgressBar from '../shared/ProgressBar';

const VoteResultsSection = ({ proposalData }) => {
  return (
    <FlexContainer className="column" mobileStyle={{ marginBottom: 16 }}>
      <FlexContainer className="column background-fill" gap={16} withGradient style={{ height: 'min-content' }} desktopStyle={{ width: 268 }}>
        <FlexContainer className="column" gap={10} style={{ height: 'min-content' }} desktopStyle={{ width: 268 }}>
          <Label fontSize={16} fontFamily="syncopate">
            voting results
          </Label>
        </FlexContainer>
        <ProgressBar
          topLabelLeft="Yes"
          currentValue={proposalData['tot-approved']}
          maxValue={proposalData['tot-approved'] + proposalData['tot-refused']}
        />
        <ProgressBar
          topLabelLeft="No"
          darkBar
          currentValue={proposalData['tot-refused']}
          maxValue={proposalData['tot-approved'] + proposalData['tot-refused']}
        />
      </FlexContainer>
    </FlexContainer>
  );
};

export default VoteResultsSection;
