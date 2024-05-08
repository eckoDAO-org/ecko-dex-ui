import React from 'react';
import tokensJson from './tokens';
//import blacklistedTokens from './tokens';
import pairsJson from './pairs';

const environment = process.env.REACT_APP_KDA_NETWORK_TYPE || 'testnet';
export const tokenData = tokensJson.tokens[environment];
export const pairsData = pairsJson.pairs[environment];
export const blacklistedTokenData = tokensJson.blacklistedTokens[environment];
// TODO add img or similar to PactContext -> allTokens
Object.values(tokenData).forEach((token) => {
  tokenData[token.name].icon = <img alt="" src={tokenData[token.name].icon} style={{ width: 20, height: 20, marginRight: '8px' }} />;
});