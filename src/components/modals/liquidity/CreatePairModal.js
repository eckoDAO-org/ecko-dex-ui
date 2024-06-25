import React from 'react';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import styled from 'styled-components';
import Label from '../../shared/Label';
import { usePactContext } from '../../../contexts';
import { FlexContainer } from '../../shared/FlexContainer';
import { UnknownLogo } from '../../../assets';

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

export const IconAndLabel = styled.div`
  img {
    width: 24px !important;
    height: 24px !important;
  }
`;

const CreatePairModal = ({ data, token0Name, token1Name, token0, token1, onConfirm }) => {
  const { allTokens } = usePactContext();
  const getModalText = () => {
    return `By selecting confirm you are adding the pair bellow to the community pool list. After the pool is created, remember to add liquidity to allow trading. Refresh to view updated list.`;
  };

  return (
    <div>
      <div>
        <Label>{getModalText()}</Label>
      </div>
      <CustomDivider style={{ margin: '15px 0' }} />
      <FlexContainer className="column" gap={16}>
        <Label fontSize={16}>Token A </Label>
        <FlexContainer className="justify-sb">
          <IconAndLabel className="flex">
            {allTokens[token0Name]?.icon}
            <Label>{token0Name}</Label>
          </IconAndLabel>
          <Label>{token0}</Label>
        </FlexContainer>
        <Label fontSize={16}>Token B </Label>
        <FlexContainer className="justify-sb">
          <div className="flex">
            <UnknownLogo style={{ marginRight: 8 }} />
            <Label>{token1Name}</Label>
          </div>
          <Label>{token1}</Label>
        </FlexContainer>
      </FlexContainer>
      <CustomButton type="secondary" buttonStyle={{ marginTop: 32 }} onClick={onConfirm}>
        CONFIRM
      </CustomButton>
    </div>
  );
};

export default CreatePairModal;
