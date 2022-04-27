import { pactFetchLocal } from './pact';
import { handleError } from './utils';

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

export const getKDXSupply = async (purpose) => {
  try {
    const kdxSupply = await pactFetchLocal(`(kaddex.kdx.get-supply "${purpose}")`);
    return kdxSupply;
  } catch (e) {
    return handleError(e);
  }
};

export const getKDXTotalBurnt = async () => {
  try {
    const kdxSupply = await pactFetchLocal(`(- (kaddex.kdx.total-minted) (kaddex.kdx.total-supply))`);
    return kdxSupply;
  } catch (e) {
    return handleError(e);
  }
};
