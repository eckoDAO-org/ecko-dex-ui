import React from 'react';
import { tokens } from './tokens';
import { pairs } from './pairs';

const environment = process.env.REACT_APP_KDA_NETWORK_TYPE || 'testnet';
const tokenData = tokens[environment];
export const pairsData = pairs[environment];

// TODO add img or similar to PactContext -> allTokens
Object.values(tokenData).forEach((token) => {
  tokenData[token.name].icon = <img alt="" src={tokenData[token.name].icon} style={{ width: 20, height: 20, marginRight: '8px' }} />;
});

export default tokenData;
