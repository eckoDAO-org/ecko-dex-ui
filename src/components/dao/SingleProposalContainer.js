/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { PartialScrollableScrollSection } from '../layout/Containers';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import VotingPowerContainer from './VotingPowerContainer';
import { ArrowBack } from '../../assets';
import { commonColors, theme } from '../../styles/theme';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { ROUTE_DAO } from '../../router/routes';
import { useHistory } from 'react-router-dom';
import VoteResultsContainer from './VoteResultsContainer';
import { readSingleProposal } from '../../api/dao';
import AppLoader from '../shared/AppLoader';

const SingleProposalContainer = ({ proposal_id, accountData }) => {
  const { themeMode } = useContext(ApplicationContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const [singleProposalData, setSingleProposalData] = useState({});

  const fetchData = async () => {
    const readSingleProposalRes = await readSingleProposal(proposal_id);
    setSingleProposalData(readSingleProposalRes);

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const [fakeButtonSelect, setFakeButtonSelect] = useState('');

  const ColumnLabels = ({ title, description }) => (
    <FlexContainer className="column">
      <Label fontSize={13} labelStyle={{ opacity: 0.7 }}>
        {title}
      </Label>
      <Label fontSize={13}>{description}</Label>
    </FlexContainer>
  );

  return loading ? (
    <AppLoader containerStyle={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
  ) : (
    <>
      <Label fontSize={24} fontFamily="syncopate">
        <ArrowBack
          style={{
            cursor: 'pointer',
            color: theme(themeMode).colors.white,
            marginRight: '15px',
            justifyContent: 'center',
          }}
          onClick={() => history.push(ROUTE_DAO)}
        />
        back to proposals
      </Label>
      <FlexContainer className="row" gap={16} mobileClassName="column">
        <FlexContainer className="column" withGradient style={{ height: 'min-content' }} desktopStyle={{ flex: 1, maxHeight: 550 }}>
          <PartialScrollableScrollSection id="proposals-list" className="scrollbar-none" style={{ width: '100%' }}>
            <FlexContainer className="column" gap={16}>
              <FlexContainer className="justify-sb align-ce w-100">
                <Label fontSize={24}>{singleProposalData?.title}</Label>
                <Label
                  fontFamily="basier"
                  fontSize={10}
                  labelStyle={{
                    backgroundColor:
                      moment(singleProposalData['start-date']?.time) <= moment() && moment(singleProposalData['end-date']?.time) >= moment()
                        ? commonColors.active
                        : commonColors.closed,
                    borderRadius: 100,
                    padding: '2px 8px',
                  }}
                >
                  {moment(singleProposalData['start-date']?.time) <= moment() && moment(singleProposalData['end-date']?.time) >= moment()
                    ? 'active'
                    : 'closed'}
                </Label>
              </FlexContainer>
              <FlexContainer className="justify-sb align-ce w-100" mobileClassName="grid" columns={2}>
                <ColumnLabels title="Author" description={singleProposalData?.account} />
                <ColumnLabels title="Start Date" description={moment(singleProposalData['start-date']).format('LLL')} />
                <ColumnLabels title="End Date" description={moment(singleProposalData['end-date']).format('LLL')} />
                <ColumnLabels title="Voting System" description="Single choice voting" />
              </FlexContainer>
              <ColumnLabels title="Description" description={singleProposalData?.description} />
              <VoteResultsContainer />
            </FlexContainer>
          </PartialScrollableScrollSection>
        </FlexContainer>
        <FlexContainer className="column" gap={16}>
          <VotingPowerContainer accountData={accountData} />
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default SingleProposalContainer;
