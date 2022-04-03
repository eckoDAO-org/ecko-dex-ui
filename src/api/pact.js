import Pact from 'pact-lang-api';
import { CHAIN_ID, creationTime, GAS_PRICE, NETWORK } from '../constants/contextConstants';

export const mkReq = function (cmd) {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(cmd),
  };
};

export const handleError = (error) => {
  console.log(`ERROR: ${JSON.stringify(error)}`);
  return { errorMessage: 'Unhandled Exception' };
};

export const pactFetchLocal = async (pactCode, options) => {
  let data = await Pact.fetch.local(
    {
      pactCode,
      meta: Pact.lang.mkMeta('', CHAIN_ID, GAS_PRICE, 150000, creationTime(), 600),
      ...options,
    },
    NETWORK
  );
  if (data.result.status === 'success') {
    return data.result.data;
  } else if (data.result.error.message) {
    const errorMessage = handleError(data);
    return { errorMessage: data.result.error.message || errorMessage };
  } else {
    return handleError(data);
  }
};

export const listen = async (reqKey) => {
  //check kadena tx status every 10 seconds until we get a response (success or fail)
  var time = 240;
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
  if (pollRes[reqKey]?.result?.status === 'success') {
    console.log('SUCCESS!!!');
    return 'success';
  } else {
    console.log('FAILED!!!');
    return 'failed';
  }
};

const wait = async (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export const parseRes = function (raw) {
  const rawRes = raw;
  const res = rawRes;
  if (res.ok) {
    const resJSON = rawRes.json();
    return resJSON;
  } else {
    const resTEXT = rawRes.text();
    return resTEXT;
  }
};
