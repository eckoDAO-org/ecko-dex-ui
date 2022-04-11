import React from 'react';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import { CoinKaddexIcon } from '../../../assets';
import { KaddexOutlineIcon } from '../../../assets';
import styled from 'styled-components';

const IconSubTitle = styled.div`
  text-align: center;
  margin: 15px 0 24px 0;
`;

const StakeModalText = styled.span`
  font-size: ${({ fontSize }) => `${fontSize || 13}px`};
`;

export const ClaimModal = ({ onConfirm, estimateUnstakeData }) => {
  return (
    <div>
      <IconSubTitle>
        <KaddexOutlineIcon />
      </IconSubTitle>
      <div>
        <StakeModalText>Your KDX staking rewards will unlock on the date shown below.</StakeModalText>
      </div>
      <CustomDivider style={{ margin: '15px 0' }} />
      <StakeModalText fontSize={16}>Stake </StakeModalText>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>
            <CoinKaddexIcon className="kaddex-price" style={{ marginRight: 16, height: 30, width: 30 }} />
          </span>
          <span>{estimateUnstakeData['reward-accrued']} </span>
        </div>
        <div>KDX</div>
      </div>
      <CustomButton type="gradient" buttonStyle={{ marginTop: 40 }} onClick={onConfirm}>
        WITHDRAW
      </CustomButton>
    </div>
  );
};
