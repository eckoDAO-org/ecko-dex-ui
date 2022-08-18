import React from 'react';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import styled from 'styled-components';
import { STAKING_REWARDS_PERCENT } from '../../../constants/contextConstants';
import Label from '../../shared/Label';
import { usePactContext } from '../../../contexts';
import RowTokenInfoPrice from '../../shared/RowTokenInfoPrice';
import { getTokenIconByCode } from '../../../utils/token-utils';

export const StakeModalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  div {
    display: flex;
    align-items: center;
  }
`;

export const IconSubTitle = styled.div`
  text-align: center;
  margin-bottom: 24px;
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
    g {
      stroke: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const CreatePairModal = ({ data, token0, token1, onConfirm }) => {
  const getModalText = () => {
    return `you are creating a pair`;
  };

  return (
    <div>
      <div>
        <Label>{getModalText()}</Label>
      </div>
      <CustomDivider style={{ margin: '15px 0' }} />
      <Label fontSize={16}>token 0: {token0} </Label>
      <Label fontSize={16}>token 1: {token1} </Label>

      <CustomButton type="gradient" buttonStyle={{ marginTop: 32 }} onClick={onConfirm}>
        CONFIRM
      </CustomButton>
    </div>
  );
};

export default CreatePairModal;
