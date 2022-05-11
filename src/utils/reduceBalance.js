export const reduceBalance = (balance, prec = 6) => {
  if (balance) {
    if (balance.int) balance = balance.int;
    if (balance.decimal) balance = balance.decimal;
    if (parseFloat(balance) % 1 === 0) {
      return parseInt(balance);
    }
    return Math.trunc(parseFloat(balance) * Math.pow(10, prec)) / Math.pow(10, prec);
  }
  if (balance === 0) return 0;
};

export const keepDecimal = (decimal) => {
  const num = decimal.toString().indexOf('.') === -1 ? `${decimal}.0` : decimal;
  return num;
};

export const gasUnit = (decimal) => {
  return decimal.toFixed(12);
};

export const pairUnit = (decimal, toFixed = 14) => {
  return Number(decimal).toFixed(toFixed);
};

export const extractDecimal = (num) => {
  if (num?.int) return Number(num.int);
  if (num?.decimal) return Number(num.decimal);
  else return Number(num);
};

export const limitDecimalPlaces = (numStr, count) => {
  if (numStr.indexOf('.') === -1) {
    if (numStr === '') return '';
    if (!isNaN(numStr)) return Number(numStr);
  }
  if (numStr.indexOf('.') === numStr.length - 1 && !isNaN(numStr.slice(0, numStr.length - 1))) {
    return numStr;
  }
  if (numStr.length - numStr.indexOf('.') > count && count !== 0) {
    numStr = parseFloat(numStr).toFixed(count);
    return numStr;
  } else {
    return numStr;
  }
};

export const getCorrectBalance = (balance) => {
  const balanceClean = !isNaN(balance) ? balance : balance.decimal;
  return balanceClean;
};

export const humanReadableNumber = (num, toFixed = 2) =>
  extractDecimal(num)
    ?.toFixed(toFixed)
    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? '';

export const countDecimals = (value) => {
  if (Math.floor(value) === value) return 0;
  return value?.toString().split('.')[1]?.length || 0;
};

export const getDecimalPlaces = (value) => {
  const count = countDecimals(value);
  if (count < 2) {
    return value?.toFixed(2);
  } else if (count > 7) {
    return value?.toFixed(7);
  } else {
    return value;
  }
};
