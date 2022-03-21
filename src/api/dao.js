import Pact from 'pact-lang-api';
import { creationTime } from '../constants/contextConstants';
import { handleError } from './pact';

const DEV_CHAIN_ID = '0';
const DEV_GAS_PRICE = 0.0000001;
const DEV_GAS_LIMIT = 100000;
const DEV_NETWORK_ID = 'development';
const DEV_FEE = 0.003;
const DEV_NETWORK_TYPE = 'Custom';
const DEV_NETWORK = 'https://devnet.private.kate.land/chainweb/0.0/development/chain/0/pact';
const DEV_PACT_DAO_CONTRACT = 'kaddex.dao';

export const readAllProposals = async () => {
  try {
    const pactCode = `(${DEV_PACT_DAO_CONTRACT}.read-all-proposals)`;
    return await pactDevnetFetchLocal(pactCode);
  } catch (e) {
    return handleError(e);
  }
};

export const readSingleProposal = async (proposalId) => {
  try {
    const pactCode = `(${DEV_PACT_DAO_CONTRACT}.read-proposal "${proposalId}")`;
    return await pactDevnetFetchLocal(pactCode);
  } catch (e) {
    return handleError(e);
  }
};

export const pactDevnetFetchLocal = async (pactCode, options) => {
  let data = await Pact.fetch.local(
    {
      pactCode,
      meta: Pact.lang.mkMeta('', DEV_CHAIN_ID, DEV_GAS_PRICE, DEV_GAS_LIMIT, creationTime(), 600),
      ...options,
    },
    DEV_NETWORK
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
