import React from 'react';
import styled from 'styled-components';
import { NotificationWarningIcon } from '../../assets';
import { commonColors } from '../../styles/theme';
import { FlexContainer } from './FlexContainer';
import Label from './Label';

const SvgContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  margin-right: 8px;
  svg {
    height: 20px;
    width: 20px;
    path {
      fill: ${({ commonColors }) => commonColors.gold}!important;
    }
  }
`;

const DisclaimerUnverifiedTokens = () => {
  return (
    <FlexContainer className="align-ce justify-sb">
      <SvgContainer commonColors={commonColors}>
        <NotificationWarningIcon />
      </SvgContainer>

      <Label fontSize={12} fontFamily="basier" color={commonColors.gold}>
        None of the tokens on this platform are pre-verified. Review the preview throughly before confirming the transaction.
      </Label>
    </FlexContainer>
  );
};

export default DisclaimerUnverifiedTokens;
