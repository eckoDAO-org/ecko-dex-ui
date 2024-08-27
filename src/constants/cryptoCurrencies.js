import React from 'react';
import pairsJson from './pairs';
import { loadTokens } from './tokenLoader';
import {  CircleInfo } from '../assets';

const environment = process.env.REACT_APP_KDA_NETWORK_TYPE || 'testnet';
const BASE_ICON_URL = 'https://github.com/CryptoPascal31/kadena_tokens/tree/main/';
export const DEFAULT_ICON_URL = 'https://github.com/CryptoPascal31/kadena_tokens/tree/main/img/kdx.svg';

export let tokenData = {};
export let pairsData = pairsJson.pairs[environment];
export let blacklistedTokenData = [];

export const initializeTokenData = async () => {
  const yamlTokens = await loadTokens();
  if (yamlTokens) {
    // Extract blacklisted tokens
    blacklistedTokenData = yamlTokens.blacklist || [];

    // Process tokens for the current environment
    const environmentTokens = yamlTokens[environment] || {};

    tokenData = Object.entries(environmentTokens).reduce((acc, [key, token]) => {
      // Skip blacklisted tokens
      if (blacklistedTokenData.includes(key)) {
        return acc;
      }

      acc[key] = {
        name: token.name || key,
        coingeckoId: token.coingeckoId || '',
        tokenNameKaddexStats: token.code || key,
        code: token.code || key,
        icon: token.img ? `${BASE_ICON_URL}${token.img}` : DEFAULT_ICON_URL,
        color: token.color || '#FFFFFF',
        main: token.main || false,
        precision: token.precision || 12,
        isVerified: true,
      };
      console.log("acc", acc)
      return acc;
    }, {});

    // Filter out blacklisted tokens from pairsData
    pairsData = Object.entries(pairsData).reduce((acc, [pairKey, pairValue]) => {
      const [token0, token1] = pairKey.split(':');
      if (!blacklistedTokenData.includes(token0) && !blacklistedTokenData.includes(token1)) {
        acc[pairKey] = pairValue;
      }
      return acc;
    }, {});

    console.log('Initialized tokenData:', tokenData);
    console.log('Initialized pairsData:', pairsData);
    console.log('Blacklisted tokens:', blacklistedTokenData);
  }
};



// import React from 'react';
// import tokensJson from './tokens';
// import pairsJson from './pairs';
// import { loadTokens } from './tokenLoader';

// const environment = process.env.REACT_APP_KDA_NETWORK_TYPE || 'testnet';
// export const tokenData = tokensJson.tokens[environment];
// export const pairsData = pairsJson.pairs[environment];
// export const blacklistedTokenData = tokensJson.blacklistedTokens[environment];
// // TODO add img or similar to PactContext -> allTokens
// Object.values(tokenData).forEach((token) => {
//   tokenData[token.name].icon = <img alt="" src={tokenData[token.name].icon} style={{ width: 20, height: 20, marginRight: '8px' }} />;
// });
