import { handleError, pactFetchLocal } from './pact';

export const getKDXTotalSupply = async () => {
  try {
    const totalSupplyData = await pactFetchLocal(`(kaddex.kdx.total-supply)`);
    return totalSupplyData;
  } catch (e) {
    if (process.env.REACT_APP_STAKING_SIMULATION) {
      return 1000000000 * 0.9121;
    } else {
      return handleError(e);
    }
  }
};

export const getKDXAccountBalance = async (account) => {
  try {
    const accountBalance = await pactFetchLocal(`(kaddex.kdx.details "${account}")`);
    return accountBalance;
  } catch (e) {
    if (process.env.REACT_APP_STAKING_SIMULATION) {
      return 1000000000 * 0.9121;
    } else {
      return handleError(e);
    }
  }
};
