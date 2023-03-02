import axios from 'axios';
import { KADDEX_NAMESPACE } from '../constants/contextConstants';

export const getSwapEventList = async (account, limit, next) => {
  return await axios
    .get('https://estats.chainweb.com/txs/events', {
      params: {
        search: account,
        name: `${KADDEX_NAMESPACE}.exchange.SWAP`,
        limit: limit,
        ...(next && { next: next }),
      },
    })
    .then((res) => {
      let swap = Object.values(res?.data).map((s) => ({
        ...s,
        tokenA: s.params[3],
        amountA: s.params[2],
        tokenB: s.params[5],
        amountB: s.params[4],
      }));
      return { data: swap, next: res?.headers?.['chainweb-next'] };
    })
    .catch((err) => {
      throw new Error(err);
    });
};
