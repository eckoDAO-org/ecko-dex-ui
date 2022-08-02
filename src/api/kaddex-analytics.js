import { pactFetchLocal } from './pact';
import { handleError } from './utils';

export const getKDXAnalyticsData = async (purpose) => {
  try {
    const pactCode = `
    (use kaddex.kdx)
    (let*(
             (a (total-supply))
             (b (get-supply 'network-rewards))
             (c (get-supply 'dao-treasury))
             (tm (total-minted))
             (d (- tm a))
         ){'total-supply: a, 'supply-network-rewards: b, 'supply-dao-treasury: c, 'total-burnt:d}
     )
        `;
    const data = await pactFetchLocal(pactCode);
    return data;
  } catch (e) {
    return handleError(e);
  }
};
