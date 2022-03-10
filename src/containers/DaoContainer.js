/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Divider } from 'semantic-ui-react';
import moment from 'moment';
import { PartialScrollableScrollSection } from '../components/layout/Containers';
import { FlexContainer } from '../components/shared/FlexContainer';
import Label from '../components/shared/Label';
import ProgressBar from '../components/shared/ProgressBar';
import { commonColors } from '../styles/theme';
import { ROUTE_DAO_PROPOSAL } from '../router/routes';

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
    title: 'First interesting proposal',
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
    title: 'Second interesting proposal',
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
    title: 'Third interesting proposal',
    'tot-approved': 118.7,
    'tot-refused': 593.51,
  },
];

const DaoContainer = () => {
  const { proposal_id } = useParams();
  console.log('pr_id', proposal_id);
  const history = useHistory();

  return proposal_id ? (
    <div>{proposal_id}</div>
  ) : (
    <>
      <FlexContainer className="column" gap={16} style={{ padding: '60px 88px 0px' }}>
        <Label fontSize={24} fontFamily="syncopate">
          proposals
        </Label>

        <FlexContainer className="row" gap={16}>
          <FlexContainer className="column" withGradient desktopStyle={{ flex: 1, maxHeight: 550, height: 'min-content', zIndex: 10 }}>
            <PartialScrollableScrollSection id="proposals-list" className="scrollbar-none" style={{ width: '100%' }}>
              {fakeData.map((data, index) => (
                <FlexContainer
                  className="column pointer"
                  key={index}
                  onClick={() => history.push(ROUTE_DAO_PROPOSAL.replace(':proposal_id', data.id))}
                >
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
                    {data.status === 'active' ? (
                      <Label
                        fontFamily="basier"
                        fontSize={10}
                        labelStyle={{ backgroundColor: commonColors.active, borderRadius: 100, padding: '2px 8px' }}
                      >
                        active
                      </Label>
                    ) : (
                      <Label
                        fontFamily="basier"
                        fontSize={10}
                        labelStyle={{ backgroundColor: commonColors.closed, borderRadius: 100, padding: '2px 8px' }}
                      >
                        closed
                      </Label>
                    )}
                  </FlexContainer>
                  {index < fakeData.length - 1 && <Divider />}
                </FlexContainer>
              ))}
            </PartialScrollableScrollSection>
          </FlexContainer>

          <FlexContainer className="column" gap={10} withGradient desktopStyle={{ width: 268, height: 'min-content' }}>
            <Label fontSize={16} fontFamily="syncopate">
              multiplier
            </Label>
            <ProgressBar currentValue={2} maxValue={3} />
            <FlexContainer className="column">
              <Label fontSize={13} fontFamily="basier">
                Voting power
              </Label>
              <Label fontSize={32} fontFamily="basier">
                1020123
              </Label>
            </FlexContainer>
            <FlexContainer className="column">
              <Label fontSize={13} fontFamily="basier" labelStyle={{ opacity: 0.2 }}>
                Vibe dust
              </Label>
              <Label fontSize={32} fontFamily="basier" labelStyle={{ opacity: 0.2 }}>
                Soon
              </Label>
            </FlexContainer>
            <FlexContainer className="column">
              <Label fontSize={13} fontFamily="basier" labelStyle={{ opacity: 0.2 }}>
                Role
              </Label>
              <Label fontSize={32} fontFamily="basier" labelStyle={{ opacity: 0.2 }}>
                Soon
              </Label>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default DaoContainer;
