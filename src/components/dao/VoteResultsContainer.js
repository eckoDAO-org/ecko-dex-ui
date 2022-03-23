/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Checkbox } from 'semantic-ui-react';
import styled from 'styled-components';
import CustomButton from '../shared/CustomButton';
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
    background-color: #fff;
  }

  .ui.radio.checkbox input:checked ~ .box:before,
  .ui.radio.checkbox input:checked ~ label:before {
    border: 1px solid #fff;
    background-color: transparent;
  }

  .ui.radio.checkbox .box:before,
  .ui.radio.checkbox label:before {
    background-color: transparent;
  }
`;

const VoteResultsContainer = ({ onClickYes, onClickNo }) => {
  return (
    <>
      <FlexContainer style={{ height: 'min-content' }}>
        <Label fontSize={13} labelStyle={{ opacity: 0.7 }}>
          Vote result
        </Label>
      </FlexContainer>
      <FlexContainer gap={10} className="align-ce">
        <CheckboxContainer>
          <Checkbox radio label="Yes" value="yes" onChange={() => onClickYes} />
        </CheckboxContainer>
        <FlexContainer className="align-ce w-100" style={{ border: '1px solid #FFFFFF99', borderRadius: 10, padding: 8 }}>
          <ProgressBar withRightLabel currentValue={2} maxValue={3} />
        </FlexContainer>
      </FlexContainer>
      <FlexContainer gap={10} className="align-ce">
        <CheckboxContainer>
          <Checkbox radio label="No" value="no" onChange={() => onClickNo} />
        </CheckboxContainer>
        <FlexContainer className="align-ce w-100" style={{ border: '1px solid #FFFFFF99', borderRadius: 10, padding: 8 }}>
          <ProgressBar darkBar withRightLabel currentValue={1} maxValue={3} />
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default VoteResultsContainer;
