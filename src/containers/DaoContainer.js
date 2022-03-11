/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useParams } from 'react-router-dom';
import { FlexContainer } from '../components/shared/FlexContainer';
import AllProposalsContainer from '../components/dao/AllProposalsContainer';
import SingleProposalContainer from '../components/dao/SingleProposalContainer';

const DaoContainer = () => {
  const { proposal_id } = useParams();

  return (
    <FlexContainer className="column" gap={16} desktopStyle={{ padding: '60px 88px 0px' }}>
      {proposal_id ? <SingleProposalContainer proposal_id={proposal_id} /> : <AllProposalsContainer />}
    </FlexContainer>
  );
};

export default DaoContainer;
