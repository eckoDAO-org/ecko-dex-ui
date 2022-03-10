/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Divider } from 'semantic-ui-react';
import styled from 'styled-components';
import { PartialScrollableScrollSection } from '../components/layout/Containers';
import { FlexContainer } from '../components/shared/FlexContainer';
import Label from '../components/shared/Label';
import ProgressBar from '../components/shared/ProgressBar';
import { commonColors } from '../styles/theme';

const ColoredLabel = styled(Label)`
  background-color: ${({ color }) => color};
  border-radius: 100px;
`;

const fakeData = [
  {
    account: 'govaddress',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'end-date': '2022-05-20T23:59:00Z',
    'start-date': '2022-05-10T23:59:00Z',
    status: 'active',
    title: 'First interesting proposal',
    'tot-approved': 118.7,
    'tot-refused': 593.51,
  },
  {
    account: 'govaddress',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.2',
    'end-date': '2022-05-20T23:59:00Z',
    'start-date': '2022-05-10T23:59:00Z',
    status: 'active',
    title: 'Second interesting proposal',
    'tot-approved': 118.7,
    'tot-refused': 593.51,
  },
  {
    account: 'govaddress',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.3',
    'end-date': '2022-05-20T23:59:00Z',
    'start-date': '2022-05-10T23:59:00Z',
    status: 'closed',
    title: 'Third interesting proposal',
    'tot-approved': 118.7,
    'tot-refused': 593.51,
  },
  {
    account: 'govaddress',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'end-date': '2022-05-20T23:59:00Z',
    'start-date': '2022-05-10T23:59:00Z',
    status: 'active',
    title: 'First interesting proposal',
    'tot-approved': 118.7,
    'tot-refused': 593.51,
  },
  {
    account: 'govaddress',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.2',
    'end-date': '2022-05-20T23:59:00Z',
    'start-date': '2022-05-10T23:59:00Z',
    status: 'active',
    title: 'Second interesting proposal',
    'tot-approved': 118.7,
    'tot-refused': 593.51,
  },
  {
    account: 'govaddress',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.3',
    'end-date': '2022-05-20T23:59:00Z',
    'start-date': '2022-05-10T23:59:00Z',
    status: 'closed',
    title: 'Third interesting proposal',
    'tot-approved': 118.7,
    'tot-refused': 593.51,
  },
];

const DaoContainer = () => {
  return (
    <>
      <FlexContainer className="column" gap={16} style={{ padding: '60px 88px 0px' }}>
        <Label fontSize={24} fontFamily="syncopate">
          proposals
        </Label>

        <FlexContainer className="row" gap={16}>
          <FlexContainer className="column" withGradient desktopStyle={{ flex: 1, maxHeight: 550, height: 'min-content' }}>
            <PartialScrollableScrollSection id="proposals-list" className="scrollbar-none" style={{ width: '100%' }}>
              {fakeData.map((data, index) => (
                <FlexContainer className="column pointer" key={index}>
                  <Label fontFamily="basier" fontSize={13} labelStyle={{ opacity: 0.7, marginBottom: 8 }}>
                    {fakeData.length - index}
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
