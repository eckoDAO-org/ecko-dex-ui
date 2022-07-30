import CryptoJS from 'crypto-js';

export const decryptKey = async (pw) => {
  const signing = await localStorage.getItem('signing');
  const encrypted = signing.key;
  const decryptedObj = CryptoJS.RC4Drop.decrypt(encrypted, pw);
  if (decryptedObj.sigBytes < 0) return null;
  return decryptedObj.toString(CryptoJS.enc.Utf8);
};
export const encryptKey = async (pk, pw, setMethod) => {
  const encrypted = CryptoJS.RC4Drop.encrypt(pk, pw);
  setMethod({ method: 'pk+pw', key: encrypted });
};
