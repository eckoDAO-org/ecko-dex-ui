import Pact from 'pact-lang-api';
import { CHAIN_ID, GAS_LIMIT, GAS_PRICE, NETWORK, NETWORKID } from '../constants/contextConstants';
import { handleError, listen, mkReq, pactFetchLocal, parseRes } from './pact';

const DEV_PACT_DAO_CONTRACT = 'kaddex.dao';

export const getAccountData = async (account) => {
  try {
    const pactCode = `(${DEV_PACT_DAO_CONTRACT}.get-account-data "${account}")`;
    return await pactFetchLocal(pactCode);
  } catch (e) {
    return handleError(e);
  }
};

export const hasAccountVoted = async (account, proposalId) => {
  try {
    const pactCode = `(${DEV_PACT_DAO_CONTRACT}.read-account-vote-proposal  "${account}" "${proposalId}")`;
    return await pactFetchLocal(pactCode);
  } catch (e) {
    return handleError(e);
  }
};

export const readAllProposals = async () => {
  try {
    const pactCode = `(${DEV_PACT_DAO_CONTRACT}.read-all-proposals)`;
    return await pactFetchLocal(pactCode);
  } catch (e) {
    return handleError(e);
  }
};

export const readSingleProposal = async (proposalId) => {
  try {
    const pactCode = `(${DEV_PACT_DAO_CONTRACT}.read-proposal "${proposalId}")`;
    return await pactFetchLocal(pactCode);
  } catch (e) {
    return handleError(e);
  }
};

export const voteCommandToSign = (type, proposalId, account) => {
  try {
    let pactCode = '';
    if (type === 'approved') pactCode = `(${DEV_PACT_DAO_CONTRACT}.approved-vote "${proposalId}" "${account.account}" )`;
    else pactCode = `(${DEV_PACT_DAO_CONTRACT}.refused-vote "${proposalId}" "${account.account}" )`;
    const cmdToSign = {
      pactCode,
      clist: [Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS').cap],
      sender: account.account,
      gasLimit: GAS_LIMIT,
      gasPrice: GAS_PRICE,
      chainId: CHAIN_ID,
      ttl: 600,
      signingPubKey: account.guard.keys[0],
      networkId: NETWORKID,
    };
    return cmdToSign;
  } catch (e) {
    return handleError(e);
  }
};

export const votePreview = async (signedCommand) => {
  try {
    let data = await fetch(`${NETWORK}/api/v1/local`, mkReq(signedCommand));
    // let data = await Pact.fetch.local(signedCommand, `${NETWORK}/api/v1/local`);
    return parseRes(data);
  } catch (e) {
    return handleError(e);
  }
};

export const vote = async (signedCmd, notification) => {
  let data = null;
  if (signedCmd.pactCode) {
    data = await Pact.fetch.send(signedCmd, NETWORK);
  } else {
    data = await Pact.wallet.sendSigned(signedCmd, NETWORK);
  }
  if (notification) notification(data.requestKeys[0]);
  console.log('voting data', data);
  return { listen: await listen(data.requestKeys[0]), data };
};
