/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import CustomButton from '../shared/CustomButton';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import ProgressBar from '../shared/ProgressBar';

const VoteResultsContainer = ({ onClickYes, onClickNo }) => {
  return (
    <>
      <FlexContainer className="column" gap={10} withGradient desktopStyle={{ width: 268, height: 'min-content' }}>
        <Label fontSize={16} fontFamily="syncopate">
          vote results
        </Label>
        <ProgressBar topLabelLeft="Yes" currentValue={2} maxValue={3} />
        <ProgressBar topLabelLeft="No" darkBar currentValue={1} maxValue={3} />
        <CustomButton type="primary" buttonStyle={{ marginTop: 14 }} onClick={onClickYes}>
          YES
        </CustomButton>
        <CustomButton type="primary" onClick={onClickNo}>
          NO
        </CustomButton>
      </FlexContainer>
    </>
  );
};

export default VoteResultsContainer;
