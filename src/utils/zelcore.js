import { mkReq, parseRes } from '../api/utils';
import { WALLET } from '../constants/wallet';

const fetch = require('node-fetch');

const cmd = {
  asset: 'kadena',
};

const getAccounts = async () => {
  try {
    let res = await fetch(WALLET.ZELCORE.getAccountsUrl, mkReq(cmd));
    let pRes = await parseRes(res);
    return pRes;
  } catch (e) {
    return -1;
  }
};

const openZelcore = () => window.open('zel:', '_self');

export { getAccounts, openZelcore };
