import BigNumber from 'bignumber.js';

export const bigNumberConverter = (value, decimalPlaces = 2) => {
  return BigNumber(value).decimalPlaces(decimalPlaces).toNumber();
};
