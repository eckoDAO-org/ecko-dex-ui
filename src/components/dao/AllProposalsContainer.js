/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Divider } from 'semantic-ui-react';
import moment from 'moment';
import { PartialScrollableScrollSection } from '../layout/Containers';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import { commonColors } from '../../styles/theme';
import { ROUTE_DAO_PROPOSAL } from '../../router/routes';
import VotingPowerContainer from './VotingPowerContainer';

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

const AllProposalsContainer = () => {
  const history = useHistory();

  return (
    <>
      <Label fontSize={24} fontFamily="syncopate">
        proposals
      </Label>

      <FlexContainer className="row" gap={16} mobileClassName="column">
        <FlexContainer className="column" withGradient desktopStyle={{ flex: 1, maxHeight: 550, height: 'min-content', zIndex: 10 }}>
          <PartialScrollableScrollSection id="proposals-list" className="scrollbar-none" style={{ width: '100%' }}>
            {fakeData.map((data, index) => (
              <FlexContainer className="column pointer" key={index} onClick={() => history.push(ROUTE_DAO_PROPOSAL.replace(':proposal_id', data.id))}>
                <Label fontFamily="basier" fontSize={13} labelStyle={{ opacity: 0.7, marginBottom: 8 }}>
                  {moment(data['creation-date']).format('YYYY-MM-DD')}
                </Label>
                <Label fontFamily="basier" fontSize={16} labelStyle={{ marginBottom: 4 }}>
                  {data?.title}
                </Label>
                <Label fontFamily="basier" fontSize={13} labelStyle={{ marginBottom: 16 }}>
                  {data?.description}
                </Label>
                <FlexContainer>
                  <Label
                    fontFamily="basier"
                    fontSize={10}
                    labelStyle={{
                      backgroundColor: data.status === 'active' ? commonColors.active : commonColors.closed,
                      borderRadius: 100,
                      padding: '2px 8px',
                    }}
                  >
                    {data?.status}
                  </Label>
                </FlexContainer>
                {index < fakeData.length - 1 && <Divider />}
              </FlexContainer>
            ))}
          </PartialScrollableScrollSection>
        </FlexContainer>

        <VotingPowerContainer />
      </FlexContainer>
    </>
  );
};

export default AllProposalsContainer;
