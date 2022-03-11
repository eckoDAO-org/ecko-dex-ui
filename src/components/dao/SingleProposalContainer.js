/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from 'react';
import { PartialScrollableScrollSection } from '../layout/Containers';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import VotingPowerContainer from './VotingPowerContainer';
import { ArrowBack } from '../../assets';
import { theme } from '../../styles/theme';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { ROUTE_DAO } from '../../router/routes';
import { useHistory } from 'react-router-dom';
import VoteResultsContainer from './VoteResultsContainer';

const fakeData = [
  {
    account: 'govaddress',
    'creation-date': '2022-01-10T14:59:00Z',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'end-date': '2022-05-20T23:59:00Z',
    id: 'Dn_zEzg1xaNeCLn7OAKb3ciuGir-R7iAnq3P1ataSDA',
    'start-date': '2022-05-10T23:59:00Z',
    status: 'active',
    title: 'First interesting proposal',
    'tot-approved': 118.7,
    'tot-refused': 593.51,
  },
  {
    account: 'govaddress',
    'creation-date': '2022-02-10T14:59:00Z',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.2',
    'end-date': '2022-05-20T23:59:00Z',
    id: 'Dn_zEzg1xaNeCLn7OAKb3ciuGir-R7iAnq3P1ataSDB',
    'start-date': '2022-05-10T23:59:00Z',
    status: 'active',
    title: 'Second interesting proposal',
    'tot-approved': 118.7,
    'tot-refused': 593.51,
  },
  {
    account: 'govaddress',
    'creation-date': '2022-03-10T14:59:00Z',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.3',
    'end-date': '2022-05-20T23:59:00Z',
    id: 'Dn_zEzg1xaNeCLn7OAKb3ciuGir-R7iAnq3P1ataSDC',
    'start-date': '2022-05-10T23:59:00Z',
    status: 'closed',
    title: 'Third interesting proposal',
    'tot-approved': 118.7,
    'tot-refused': 593.51,
  },
  {
    account: 'govaddress',
    'creation-date': '2022-04-10T14:59:00Z',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'end-date': '2022-05-20T23:59:00Z',
    id: 'Dn_zEzg1xaNeCLn7OAKb3ciuGir-R7iAnq3P1ataSDD',
    'start-date': '2022-05-10T23:59:00Z',
    status: 'active',
    title: 'Fourth interesting proposal',
    'tot-approved': 118.7,
    'tot-refused': 593.51,
  },
  {
    account: 'govaddress',
    'creation-date': '2022-05-10T14:59:00Z',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.2',
    'end-date': '2022-05-20T23:59:00Z',
    id: 'Dn_zEzg1xaNeCLn7OAKb3ciuGir-R7iAnq3P1ataSDE',
    'start-date': '2022-05-10T23:59:00Z',
    status: 'active',
    title: 'Fifth interesting proposal',
    'tot-approved': 118.7,
    'tot-refused': 593.51,
  },
  {
    account: 'govaddress',
    'creation-date': '2022-06-10T14:59:00Z',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.3',
    'end-date': '2022-05-20T23:59:00Z',
    id: 'Dn_zEzg1xaNeCLn7OAKb3ciuGir-R7iAnq3P1ataSDF',
    'start-date': '2022-05-10T23:59:00Z',
    status: 'closed',
    title: 'Sixth interesting proposal',
    'tot-approved': 118.7,
    'tot-refused': 593.51,
  },
];

const SingleProposalContainer = ({ proposal_id }) => {
  const { themeMode } = useContext(ApplicationContext);
  const history = useHistory();

  const fakeProposal = fakeData.find((data) => data.id === proposal_id);
  console.log('fakeProposal', fakeProposal);
  return (
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

      <FlexContainer className="row" gap={16}>
        <FlexContainer className="column" withGradient desktopStyle={{ flex: 1, maxHeight: 550, height: 'min-content', zIndex: 10 }}>
          <PartialScrollableScrollSection id="proposals-list" className="scrollbar-none" style={{ width: '100%' }}>
            {proposal_id}
          </PartialScrollableScrollSection>
        </FlexContainer>
        <FlexContainer className="column" gap={16}>
          <VotingPowerContainer />
          <VoteResultsContainer />
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default SingleProposalContainer;
