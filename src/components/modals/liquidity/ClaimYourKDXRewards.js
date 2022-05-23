import React from 'react';
import styled from 'styled-components/macro';
import { KaddexOutlineIcon } from '../../../assets';
import { getTokenIconById } from '../../../utils/token-utils';
import CustomButton from '../../shared/CustomButton';
import CustomDivider from '../../shared/CustomDivider';
import { CryptoContainer, FlexContainer } from '../../shared/FlexContainer';
import Label from '../../shared/Label';

export const IconSubTitle = styled.div`
  text-align: center;
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
    g {
      stroke: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const ClaimYourKDXRewards = ({ multiplier }) => {
  return (
    <FlexContainer className="column" gap={16}>
      <IconSubTitle>
        <KaddexOutlineIcon />
      </IconSubTitle>

      <div className="flex justify-sb">
        <Label fontSize={16}>KDX Multiplier</Label>
        <Label fontSize={16}>{multiplier.toFixed(2)} x</Label>
      </div>

      <div className="flex justify-sb">
        <Label fontSize={16}>5 Days Average Price</Label>
        <Label fontSize={16}>$</Label>
      </div>

      <CustomDivider />

      <Label fontSize={16}>Amount</Label>

      <div className="flex align-ce">
        <CryptoContainer size={30}>{getTokenIconById('KDX')}</CryptoContainer>
        <div className="column w-100">
          <div className="flex justify-sb">
            <Label fontSize={16}>1234.50</Label>
            <Label fontSize={16}>KDX</Label>
          </div>
          <div className="flex justify-sb">
            <Label withShade>$ 200.00</Label>
          </div>
        </div>
      </div>
      <CustomButton type="gradient">confirm</CustomButton>
    </FlexContainer>
  );
};

export default ClaimYourKDXRewards;
