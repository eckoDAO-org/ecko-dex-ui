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
