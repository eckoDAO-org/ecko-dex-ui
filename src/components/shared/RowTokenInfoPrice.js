import React from 'react';
import { extractDecimal, getShorterNameSpace, reduceBalance } from '../../utils/reduceBalance';
import { CryptoContainer, FlexContainer } from './FlexContainer';
import { usePactContext } from '../../contexts';
import Label from './Label';

const RowTokenInfoPrice = ({ tokenIcon, tokenName, amount, tokenPrice }) => {
  const { allTokens } = usePactContext();
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
          <Label>{reduceBalance(extractDecimal(amount), allTokens[tokenName].precision)}</Label>
          <Label>{tokenName}</Label>
        </FlexContainer>

        <FlexContainer className="justify-sb w-100">
          {tokenPrice ? (
            <Label labelStyle={{ opacity: 0.6, fontSize: 12 }}>$ {(extractDecimal(amount) * tokenPrice).toFixed(2)}</Label>
          ) : (
            <Label labelStyle={{ fontSize: 12 }}></Label>
          )}
          <Label labelStyle={{ opacity: 0.6, fontSize: 12 }}>{getShorterNameSpace(allTokens[tokenName].code)}</Label>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default RowTokenInfoPrice;
