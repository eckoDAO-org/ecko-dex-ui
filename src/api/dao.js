import { KADDEX_NAMESPACE } from '../constants/contextConstants';
import { pactFetchLocal } from './pact';
import { handleError } from './utils';

export const getAccountData = async (account) => {
  try {
    const pactCode = `(${KADDEX_NAMESPACE}.dao.get-account-data "${account}")`;
    return await pactFetchLocal(pactCode);
  } catch (e) {
    return handleError(e);
  }
};
