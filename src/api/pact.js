import Pact from 'pact-lang-api';
import { CHAIN_ID, creationTime, GAS_PRICE, NETWORK } from '../constants/contextConstants';

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
