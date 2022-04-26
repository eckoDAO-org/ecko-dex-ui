export function isEmpty(str) {
  return !str || str.length === 0;
}

export function isBlank(str) {
  return !str || /^\s*$/.test(str);
}
export function isUndefined(str) {
  return !str || str === undefined || str === 'undefined';
}

export function isValidString(str) {
  return !isEmpty(str) && !isBlank(str) && !isUndefined(str);
}

export function getFloatPrecision(floatVal) {
  if (!floatVal || floatVal.toString().indexOf('.') < 0) {
    return 0;
  } else {
    return Math.abs(floatVal.toString().indexOf('.') - floatVal.toString().length + 1);
  }
}

export const genRandomString = () => {
  //Can change 7 to 2 for longer results.
  let r = (Math.random() + 1).toString(36).substring(2);
  return r;
};
