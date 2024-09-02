import React from 'react';
import pairsJson from './pairs';
import { loadTokens } from './tokenLoader';
import {  CircleInfo } from '../assets';

const environment = process.env.REACT_APP_KDA_NETWORK_TYPE || 'mainnet';
const BASE_ICON_URL = 'https://raw.githubusercontent.com/CryptoPascal31/kadena_tokens/main/';
// export const DEFAULT_ICON_URL = `${BASE_ICON_URL}img/kdx.svg`;
export const DEFAULT_ICON_URL = `/images/crypto/q.svg`;

export let tokenData = {};
export let pairsData = pairsJson.pairs[environment];
export let blacklistedTokenData = [];

export const initializeTokenData = async () => {
  const yamlTokens = await loadTokens();

  if (yamlTokens) {
    blacklistedTokenData = yamlTokens.blacklist || [];

    const environmentTokens = yamlTokens[environment] || {};

    tokenData = Object.entries(environmentTokens).reduce((acc, [key, token]) => {
      if (blacklistedTokenData.includes(key)) {
        return acc;
      }

      // Construct the raw GitHub URL for the icon
      const iconUrl = token.img ? `${BASE_ICON_URL}${token.img}` : DEFAULT_ICON_URL;

      acc[key] = {
        name: token.name || key,
        coingeckoId: token.coingeckoId || '',
        tokenNameKaddexStats: token.code || key,
        code: token.code || key,
        statsId: token.code || key,
        icon: iconUrl,
        color: token.color || '#FFFFFF',
        main: token.main || false,
        precision: token.precision || 12,
        isVerified: true,
      };

      return acc;
    }, {});

    pairsData = Object.entries(pairsData).reduce((acc, [pairKey, pairValue]) => {
      const [token0, token1] = pairKey.split(':');
      if (!blacklistedTokenData.includes(token0) && !blacklistedTokenData.includes(token1)) {
        acc[pairKey] = pairValue;
      }
      return acc;
    }, {});

  
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
