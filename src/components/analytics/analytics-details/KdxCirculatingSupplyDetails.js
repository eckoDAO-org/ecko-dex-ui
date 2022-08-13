import React from 'react';
import { Divider } from 'semantic-ui-react';
import { humanReadableNumber } from '../../../utils/reduceBalance';
import { FlexContainer } from '../../shared/FlexContainer';
import Label from '../../shared/Label';

const KdxCirculatingSupplyDetails = ({ supply, tokensUsdPrice }) => {
  return (
    <FlexContainer className="w-100 column" gap={8}>
      <FlexContainer className="column" gap={16}>
        <FlexContainer className="w-100 column" gap={8}>
          <Label>Total Circulating Supply</Label>
          <Label fontSize={24}>{`${humanReadableNumber(supply.totalSupply)} KDX`}</Label>
          {tokensUsdPrice && (
            <Label fontSize={12} mobileFontSize={12} labelStyle={{ opacity: 0.7 }}>
              $ {humanReadableNumber(tokensUsdPrice?.KDX * supply.totalSupply)}
            </Label>
          )}
        </FlexContainer>
        <FlexContainer className="w-100 column" gap={8}>
          <Label>Amount Staked</Label>
          <Label fontSize={24}>{`${humanReadableNumber(supply.stakedAmount)} KDX`}</Label>
          {tokensUsdPrice && (
            <Label fontSize={12} mobileFontSize={12} labelStyle={{ opacity: 0.7 }}>
              $ {humanReadableNumber(tokensUsdPrice?.KDX * supply.stakedAmount)}
            </Label>
          )}
        </FlexContainer>
        <FlexContainer className="w-100 column justify-fe align-fe" gap={4}>
          <Label>Amount Vaulted</Label>
          <Label fontSize={16}>{`${humanReadableNumber(supply.vaultedAmount)} KDX`}</Label>
          {tokensUsdPrice && (
            <Label fontSize={12} mobileFontSize={12} labelStyle={{ opacity: 0.7 }}>
              $ {humanReadableNumber(tokensUsdPrice?.KDX * supply.vaultedAmount)}
            </Label>
          )}
        </FlexContainer>
        <Divider style={{ margin: '8px 0px' }} />
        <FlexContainer className="w-100 column" gap={8}>
          <Label>Available Supply</Label>
          <Label fontSize={24}>{`${humanReadableNumber(supply.totalSupply - supply.stakedAmount)} KDX`}</Label>
          {tokensUsdPrice && (
            <Label fontSize={12} mobileFontSize={12} labelStyle={{ opacity: 0.7 }}>
              $ {humanReadableNumber(tokensUsdPrice?.KDX * (supply.totalSupply - supply.stakedAmount))}
            </Label>
          )}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default KdxCirculatingSupplyDetails;
