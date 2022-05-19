import React from 'react';
import { extractDecimal, getDecimalPlaces } from '../../utils/reduceBalance';
import { CryptoContainer, FlexContainer } from './FlexContainer';
import Label from './Label';

const RowTokenInfoPrice = ({ tokenIcon, tokenName, amount, tokenPrice, isEstimated }) => {
  /*
      The component returns Token icon with amount and usd token price:
       --------
       | ICON |  {AMOUNT TOKEN }           {token-name}      
       |      |  {$ token value}         $
       -------- 
    */

  return (
    <FlexContainer className="w-100">
      <CryptoContainer size={30}>{tokenIcon}</CryptoContainer>
      <FlexContainer className="column w-100" style={{ alignSelf: !tokenPrice && 'center' }}>
        <FlexContainer className="justify-sb w-100">
          <Label>{isEstimated ? `~${getDecimalPlaces(extractDecimal(amount))}` : getDecimalPlaces(extractDecimal(amount))}</Label>
          <Label>{tokenName}</Label>
        </FlexContainer>
        {tokenPrice && (
          <FlexContainer className="justify-sb w-100">
            <Label labelStyle={{ opacity: 0.7, fontSize: 13 }}>
              {isEstimated ? `~${(extractDecimal(amount) * tokenPrice).toFixed(2)}` : (extractDecimal(amount) * tokenPrice).toFixed(2)}
            </Label>
            <Label labelStyle={{ opacity: 0.7, fontSize: 13 }}>$</Label>
          </FlexContainer>
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

export default RowTokenInfoPrice;
