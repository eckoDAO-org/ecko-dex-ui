/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import React from 'react';
import { useAccountContext } from '../../contexts';
import CustomButton from '../shared/CustomButton';
import { FlexContainer } from '../shared/FlexContainer';

const VoteResultsContainer = ({ onClickYes, onClickNo, proposalData, hasVoted }) => {
  const { account } = useAccountContext();
  const dataValidation = () =>
    !account?.account || hasVoted || moment(proposalData['start-date']?.time) >= moment() || moment(proposalData['end-date']?.time) <= moment();

  return (
    <FlexContainer className="row justify-ce align-ce" gap={16} style={{ marginTop: 4 }}>
      {!hasVoted || hasVoted === 'approved' ? (
        <CustomButton disabled={dataValidation()} buttonStyle={{ maxWidth: 230, maxHeight: 36 }} onClick={onClickYes}>
          {hasVoted === 'approved' ? 'Approved' : 'Approve'}
        </CustomButton>
      ) : null}
      {!hasVoted || hasVoted === 'refused' ? (
        <CustomButton disabled={dataValidation()} buttonStyle={{ maxWidth: 230, maxHeight: 36 }} onClick={onClickNo}>
          {hasVoted === 'refused' ? 'Refused' : 'Refuse'}
        </CustomButton>
      ) : null}
    </FlexContainer>
  );
};

export default VoteResultsContainer;
