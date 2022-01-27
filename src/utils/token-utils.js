import tokenData from '../constants/cryptoCurrencies';

export const showTicker = (ticker) => {
  if (ticker === 'coin') return 'KDA';
  else if (ticker === 'runonflux.flux') return 'FLUX';
  else return ticker?.toUpperCase();
};

export const getTokenIcon = (token) => {
  return tokenData[showTicker(token)]?.icon;
};
