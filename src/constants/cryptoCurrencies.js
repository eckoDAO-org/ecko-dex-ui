import React from 'react';
import { tokens } from './tokens';
import { pairs } from './pairs';

const environment = process.env.REACT_APP_KDA_NETWORK_TYPE || 'testnet';
const tokenData = tokens[environment];
export const pairsData = pairs[environment];

Object.values(tokenData).forEach((token) => {
  tokenData[token.name].icon = <img alt="" src={tokenData[token.name].icon} style={{ width: 20, height: 20, marginRight: '8px' }} />;
});

export const getPairByTokensName = (token0Name, token1Name) => {
  return Object.values(pairsData).find(
    (pair) => (pair.token0 === token0Name && pair.token1 === token1Name) || (pair.token0 === token1Name && pair.token1 === token0Name)
  );
};
export default tokenData;
