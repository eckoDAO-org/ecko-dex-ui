/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import styled from 'styled-components';
import { useAccountContext, useApplicationContext } from '../../contexts';
import { theme } from '../../styles/theme';
import { getPercentage } from '../../utils/string-utils';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import ProgressBar from '../shared/ProgressBar';

const CheckboxContainer = styled.div`
  width: 58px;

  .ui.checkbox {
    margin-bottom: 4px;
  }

  .ui.radio.checkbox label {
    color: ${({ theme: { colors } }) => colors.white};
  }

  .ui.radio.checkbox input:checked ~ .box:after,
  .ui.radio.checkbox input:checked ~ label:after {
    background-color: ${({ theme: { colors } }) => colors.white};
  }

  .ui.radio.checkbox input:checked ~ .box:before,
  .ui.radio.checkbox input:checked ~ label:before {
    border: 1px solid ${({ theme: { colors } }) => colors.white};
    background-color: transparent;
  }

  .ui.radio.checkbox .box:before,
  .ui.radio.checkbox label:before {
    background-color: transparent;
    border: 1px solid ${({ theme: { colors } }) => colors.white};
  }
`;

const VoteResultsContainer = ({ onClickYes, onClickNo, proposalData, hasVoted }) => {
  const { account } = useAccountContext();
  const { themeMode } = useApplicationContext();

  const dataValidation = () =>
    !account?.account || hasVoted || moment(proposalData['start-date']?.time) >= moment() || moment(proposalData['end-date']?.time) <= moment();

  return (
    <FlexContainer className="column w-100" gap={16} style={{ marginTop: 4 }}>
      <FlexContainer gap={10} className="align-ce">
        <CheckboxContainer>
          <Checkbox disabled={dataValidation()} radio checked={hasVoted === 'approved'} label="Yes" value="yes" onChange={onClickYes} />
        </CheckboxContainer>
        <FlexContainer
          gap={8}
          className="align-ce w-100"
          style={{ border: `1px solid ${theme(themeMode).colors.white}99`, borderRadius: 10, padding: 8 }}
        >
          <ProgressBar currentValue={proposalData['tot-approved']} maxValue={proposalData['tot-approved'] + proposalData['tot-refused']} />
          <Label>{getPercentage(proposalData['tot-approved'], proposalData['tot-approved'] + proposalData['tot-refused']).toFixed(0)}%</Label>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer gap={10} className="align-ce">
        <CheckboxContainer>
          <Checkbox disabled={dataValidation()} radio checked={hasVoted === 'refused'} label="No" value="no" onChange={onClickNo} />
        </CheckboxContainer>
        <FlexContainer
          gap={8}
          className="align-ce w-100"
          style={{ border: `1px solid ${theme(themeMode).colors.white}99`, borderRadius: 10, padding: 8 }}
        >
          <ProgressBar darkBar currentValue={proposalData['tot-refused']} maxValue={proposalData['tot-approved'] + proposalData['tot-refused']} />
          <Label>{getPercentage(proposalData['tot-refused'], proposalData['tot-approved'] + proposalData['tot-refused']).toFixed(0)}%</Label>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default VoteResultsContainer;
