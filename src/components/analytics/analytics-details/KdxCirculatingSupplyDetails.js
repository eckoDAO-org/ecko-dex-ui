import React from 'react';
import { humanReadableNumber } from '../../../utils/reduceBalance';
import { FlexContainer } from '../../shared/FlexContainer';
import Label from '../../shared/Label';

const KdxCirculatingSupplyDetails = ({ supply, tokensUsdPrice }) => {
  console.log('LOG --> supply', supply);
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
          <Label>Amount Locked</Label>
          <Label fontSize={24}>{`${humanReadableNumber(supply.lockedAmount)} KDX`}</Label>
          {tokensUsdPrice && (
            <Label fontSize={12} mobileFontSize={12} labelStyle={{ opacity: 0.7 }}>
              $ {humanReadableNumber(tokensUsdPrice?.KDX * supply.lockedAmount)}
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
      </FlexContainer>
    </FlexContainer>
  );
};

export default KdxCirculatingSupplyDetails;
