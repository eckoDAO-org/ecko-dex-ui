export function isEmpty(str) {
  return !str || str.length === 0;
}

export function isBlank(str) {
  return !str || /^\s*$/.test(str);
}

export function isValidString(str) {
  return !isEmpty(str) && !isBlank(str);
}
