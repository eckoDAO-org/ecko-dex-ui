import { handleError, pactFetchLocal } from './pact';
import pairTokens from '../constants/pairsConfig';
import { KADDEX_NAMESPACE } from '../constants/contextConstants';

export const getPairList = async () => {
  try {
    const tokenPairList = Object.keys(pairTokens).reduce((accum, pair) => {
      accum += `[${pair.split(':').join(' ')}] `;
      return accum;
    }, '');

    let data = await pactFetchLocal(
      `
              (namespace 'free)
  
              (module ${KADDEX_NAMESPACE}-read G
  
                (defcap G ()
                  true)
  
                (defun pair-info (pairList:list)
                  (let* (
                    (token0 (at 0 pairList))
                    (token1 (at 1 pairList))
                    (p (${KADDEX_NAMESPACE}.exchange.get-pair token0 token1))
                    (reserveA (${KADDEX_NAMESPACE}.exchange.reserve-for p token0))
                    (reserveB (${KADDEX_NAMESPACE}.exchange.reserve-for p token1))
                    (totalBal (${KADDEX_NAMESPACE}.tokens.total-supply (${KADDEX_NAMESPACE}.exchange.get-pair-key token0 token1)))
                  )
                  [(${KADDEX_NAMESPACE}.exchange.get-pair-key token0 token1)
                   reserveA
                   reserveB
                   totalBal
                 ]
                ))
              )
              (map (${KADDEX_NAMESPACE}-read.pair-info) [${tokenPairList}])
               `
    );
    if (data.errorMessage) {
      return data;
    }
    if (data) {
      let dataList = data.reduce((accum, data) => {
        accum[data[0]] = {
          supply: data[3],
          reserves: [data[1], data[2]],
        };
        return accum;
      }, {});
      const pairList = Object.values(pairTokens).map((pair) => {
        return {
          ...pair,
          ...dataList[pair.name],
        };
      });
      return pairList;
    }
  } catch (e) {
    return handleError(e);
  }
};

export const getPairListAccountBalance = async (account) => {
  try {
    const tokenPairList = Object.keys(pairTokens).reduce((accum, pair) => {
      accum += `[${pair.split(':').join(' ')}] `;
      return accum;
    }, '');
    let data = await pactFetchLocal(
      `
            (namespace 'free)

            (module ${KADDEX_NAMESPACE}-read G

              (defcap G ()
                true)

              (defun pair-info (pairList:list)
                (let* (
                  (token0 (at 0 pairList))
                  (token1 (at 1 pairList))
                  (p (${KADDEX_NAMESPACE}.exchange.get-pair token0 token1))
                  (reserveA (${KADDEX_NAMESPACE}.exchange.reserve-for p token0))
                  (reserveB (${KADDEX_NAMESPACE}.exchange.reserve-for p token1))
                  (totalBal (${KADDEX_NAMESPACE}.tokens.total-supply (${KADDEX_NAMESPACE}.exchange.get-pair-key token0 token1)))
                  (acctBal
                      (try 0.0 (${KADDEX_NAMESPACE}.tokens.get-balance (${KADDEX_NAMESPACE}.exchange.get-pair-key token0 token1) ${JSON.stringify(
        account
      )})
                    ))
                )
                [(${KADDEX_NAMESPACE}.exchange.get-pair-key token0 token1)
                 reserveA
                 reserveB
                 totalBal
                 acctBal
                 (* reserveA (/ acctBal totalBal))
                 (* reserveB (/ acctBal totalBal))
               ]
              ))
            )
            (map (${KADDEX_NAMESPACE}-read.pair-info) [${tokenPairList}])
             `
    );
    console.log('data', data);
    if (data) {
      let dataList = data.reduce((accum, data) => {
        accum[data[0]] = {
          balance: data[4],
          supply: data[3],
          reserves: [data[1], data[2]],
          pooledAmount: [data[5], data[6]],
        };
        return accum;
      }, {});

      const pairList = Object.values(pairTokens).map((pair) => {
        return {
          ...pair,
          ...dataList[pair.name],
        };
      });
      return pairList;
    }
  } catch (e) {
    return handleError(e);
  }
};

export const getPairAccount = async (token0, token1) => {
  try {
    let data = await pactFetchLocal(`(at 'account (${KADDEX_NAMESPACE}.exchange.get-pair ${token0} ${token1}))`);
    if (data.result.status === 'success') {
      return data.result.data;
    }
  } catch (e) {
    return e;
  }
};
