import React from 'react';
import pairsJson from './pairs';
import { loadTokens } from './tokenLoader';
import { VerifiedBoldLogo } from '../assets';

const environment = process.env.REACT_APP_KDA_NETWORK_TYPE || 'testnet';

export let tokenData = {};
export const pairsData = pairsJson.pairs[environment];
export let blacklistedTokenData = [];

export const initializeTokenData = async () => {
  const yamlTokens = await loadTokens();
  if (yamlTokens) {
    tokenData = Object.entries(yamlTokens).reduce((acc, [key, token]) => {
      acc[key] = {
        name: token.name || key,
        coingeckoId: token.coingeckoId || '',
        tokenNameKaddexStats: token.code,
        code: token.code,
        icon: token.icon ? (
          <img alt="" src={token.icon} style={{ width: 20, height: 20, marginRight: '8px' }} />
        ) : (
          <VerifiedBoldLogo style={{ marginRight: 8 }} />
        ),
        color: token.color || '#FFFFFF',
        main: token.main || false,
        precision: token.precision || 12,
        isVerified: true, 
      };
      return acc;
    }, {});

    blacklistedTokenData = Object.keys(yamlTokens).filter(key => yamlTokens[key].blacklisted || false);
  }
  
  console.log('Initialized tokenData:', tokenData); // For debugging only
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
