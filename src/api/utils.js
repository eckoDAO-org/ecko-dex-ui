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
  console.log(`ERROR: ${JSON.stringify(error)}`);
  return { errorMessage: 'Unhandled Exception' };
};

export const listen = async (reqKey) => {
  //check kadena tx status every 10 seconds until we get a response (success or fail)
  var time = 500;
  var pollRes;
  while (time > 0) {
    await wait(5000);
    pollRes = await Pact.fetch.poll({ requestKeys: [reqKey] }, NETWORK);
    if (Object.keys(pollRes).length === 0) {
      console.log('no return poll');
      console.log(pollRes);
      time = time - 5;
    } else {
      console.log(pollRes);
      time = 0;
    }
  }
  console.log(reqKey);
  console.log(pollRes);
  console.log(pollRes[reqKey]);
  console.log(pollRes[reqKey].result);
  if (pollRes?.[reqKey]?.result?.status === 'success') {
    console.log('SUCCESS!!!');
    return 'success';
  } else {
    console.log('FAILED!!!');
    return 'failed';
  }
};
