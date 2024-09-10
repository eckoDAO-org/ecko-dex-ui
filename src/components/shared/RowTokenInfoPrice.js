import React from 'react';
import { extractDecimal, getShorterNameSpace, reduceBalance } from '../../utils/reduceBalance';
import { CryptoContainer, FlexContainer } from './FlexContainer';
import { usePactContext } from '../../contexts';
import Label from './Label';
import {DEFAULT_ICON_URL} from '../../constants/cryptoCurrencies';

const RowTokenInfoPrice = ({ tokenIcon, tokenName, amount, tokenPrice, contract }) => {
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
      <CryptoContainer size={30}>
      <img 
          src={tokenIcon}
          alt={tokenName}
          style={{ width: 20, height: 20 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_ICON_URL;
          }}
        />
        </CryptoContainer>
      <FlexContainer className="column w-100" style={{ alignSelf: !tokenPrice && 'center' }}>
        <FlexContainer className="justify-sb w-100">
          <Label>{reduceBalance(extractDecimal(amount), allTokens[contract].precision)}</Label>
          <Label>{getShorterNameSpace(contract)}</Label>
        </FlexContainer>

        <FlexContainer className="justify-sb w-100">
          {tokenPrice ? (
            <Label labelStyle={{ opacity: 0.6, fontSize: 12 }}>$ {(extractDecimal(amount) * tokenPrice).toFixed(2)}</Label>
          ) : (
            <Label labelStyle={{ fontSize: 12 }}></Label>
          )}
          <Label labelStyle={{ opacity: 0.6, fontSize: 12 }}>{getShorterNameSpace(allTokens[contract].name)}</Label>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default RowTokenInfoPrice;
