import Pact from 'pact-lang-api';
import { NETWORK } from '../constants/contextConstants';

export const mkReq = function (cmd) {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(cmd),
  };
};

export const parseRes = async function (raw) {
  const rawRes = await raw;
  const res = await rawRes;
  if (res.ok) {
    const resJSON = await rawRes.json();
    return resJSON;
  } else {
    const resTEXT = await rawRes.text();
    return resTEXT;
  }
};

export const wait = async (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export const handleError = (error) => {
  error?.result?.error?.message
    ? console.log(` ERROR: ${JSON.stringify(error?.result?.error?.message)}`)
    : console.log(` ERROR: ${JSON.stringify(error)}`);

  return { errorMessage: 'Unhandled Exception' };
};

export const listen = async (reqKey) => {
  let time = 500;
  let pollRes;
  while (time > 0) {
    await wait(5000);
    pollRes = await Pact.fetch.poll({ requestKeys: [reqKey] }, NETWORK);
    if (Object.keys(pollRes).length === 0) {
      time = time - 5;
    } else {
      time = 0;
    }
  }
  if (pollRes && pollRes[reqKey]) {
    return pollRes[reqKey];
  }
  return null;
};
