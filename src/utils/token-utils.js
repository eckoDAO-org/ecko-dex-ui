import tokenData from '../constants/cryptoCurrencies';

export const showTicker = (ticker) => {
  if (ticker === 'coin') return 'KDA';
  else if (ticker === 'runonflux.flux') return 'FLUX';
  else return ticker?.toUpperCase();
};

export const getTokenIcon = (token) => {
  return tokenData[showTicker(token)]?.icon;
};

export const getKadenaTokenPrice = () => {};

export const getInfoCoin = (item, coinPositionArray) => {
  let cryptoCode = item?.params[coinPositionArray]?.refName?.namespace
    ? `${item?.params[coinPositionArray]?.refName?.namespace}.${item?.params[coinPositionArray]?.refName?.name}`
    : item?.params[coinPositionArray]?.refName?.name;
  const crypto = Object.values(tokenData).find(({ code }) => code === cryptoCode);
  return crypto;
};
