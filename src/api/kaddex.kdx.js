import { handleError, pactFetchLocal } from './pact';

export const getKDXTotalSupply = async () => {
  try {
    const totalSupplyData = await pactFetchLocal(`(kaddex.kdx.total-supply)`);
    return totalSupplyData;
  } catch (e) {
    return handleError(e);
  }
};

export const getKDXAccountBalance = async (account) => {
  try {
    const accountBalance = await pactFetchLocal(`(kaddex.kdx.details "${account}")`);
    return accountBalance;
  } catch (e) {
    return handleError(e);
  }
};
