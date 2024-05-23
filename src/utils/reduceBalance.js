import noExponents from './noExponents';
import reduceToken from './reduceToken';

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

export const getShorterNameSpace = (str) => {
  if (str.indexOf('.') === -1) {
    return str;
  } else {
    const beforeDotStr = str.slice(0, str.indexOf('.'));
    const afterDotStr = str.slice(str.indexOf('.'), str.length);
    if (beforeDotStr.length > 10) {
      const reducedString = reduceToken(beforeDotStr);
      return reducedString.concat(afterDotStr);
    } else {
      return str;
    }
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

export const getDecimalPositions = (value) => {
  const myValue = Number(value);
  const count = countDecimals(myValue);
  if (count < 2) {
    return myValue?.toFixed(2);
  } else if (count > 7) {
    if (countDecimals(myValue?.toFixed(7)) === 0) {
      var newValue = myValue?.toFixed(7);
      return newValue?.toFixed(2);
    } else {
      return myValue?.toFixed(7);
    }
  } else {
    if (countDecimals(myValue) === 0) {
      return myValue?.toFixed(2);
    } else {
      return myValue;
    }
  }
};

export const getDecimalPlaces = (value) => {
  const myValue = Number(value);
  if (myValue < 100) {
    return getDecimalPositions(myValue.toFixed(7));
  } else if (myValue >= 100 && myValue < 1000) {
    return getDecimalPositions(myValue.toFixed(5));
  } else {
    return humanReadableNumber(myValue);
  }
};

export const smallDecimalsFormatting = (value, power = 3) => {
  const myValue = noExponents(extractDecimal(value));

  if (myValue < 10 ** -power) {
    //counts the number of zeros after the '.'
    var zerosCount = -Math.floor(Math.log(myValue) / Math.log(10) + 1);

    var str = myValue.toString();

    const beforeZeros = str.substring(0, str.indexOf('.') + 2);

    var afterZeros = str.substring(zerosCount + 2, str.length);
    if (afterZeros.length > 4) {
      afterZeros = afterZeros.substring(0, 4);
    }

    return {
      initialNumber: myValue,
      beforeZeros: beforeZeros,
      zerosRemoved: zerosCount - 1,
      afterZeros: afterZeros,
    };
  } else {
    return {
      initialNumber: humanReadableNumber(myValue, 3),
    };
  }
};
