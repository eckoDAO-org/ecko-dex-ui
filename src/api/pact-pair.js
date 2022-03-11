import { handleError, pactFetchLocal } from './pact';
import pairTokens from '../constants/pairs.json';

export const getPairList = async () => {
  try {
    const tokenPairList = Object.keys(pairTokens).reduce((accum, pair) => {
      accum += `[${pair.split(':').join(' ')}] `;
      return accum;
    }, '');

    let data = await pactFetchLocal(
      `
              (namespace 'free)
  
              (module kswap-read G
  
                (defcap G ()
                  true)
  
                (defun pair-info (pairList:list)
                  (let* (
                    (token0 (at 0 pairList))
                    (token1 (at 1 pairList))
                    (p (kswap.exchange.get-pair token0 token1))
                    (reserveA (kswap.exchange.reserve-for p token0))
                    (reserveB (kswap.exchange.reserve-for p token1))
                    (totalBal (kswap.tokens.total-supply (kswap.exchange.get-pair-key token0 token1)))
                  )
                  [(kswap.exchange.get-pair-key token0 token1)
                   reserveA
                   reserveB
                   totalBal
                 ]
                ))
              )
              (map (kswap-read.pair-info) [${tokenPairList}])
               `
    );
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

            (module kswap-read G

              (defcap G ()
                true)

              (defun pair-info (pairList:list)
                (let* (
                  (token0 (at 0 pairList))
                  (token1 (at 1 pairList))
                  (p (kswap.exchange.get-pair token0 token1))
                  (reserveA (kswap.exchange.reserve-for p token0))
                  (reserveB (kswap.exchange.reserve-for p token1))
                  (totalBal (kswap.tokens.total-supply (kswap.exchange.get-pair-key token0 token1)))
                  (acctBal
                      (try 0.0 (kswap.tokens.get-balance (kswap.exchange.get-pair-key token0 token1) ${JSON.stringify(account)})
                    ))
                )
                [(kswap.exchange.get-pair-key token0 token1)
                 reserveA
                 reserveB
                 totalBal
                 acctBal
                 (* reserveA (/ acctBal totalBal))
                 (* reserveB (/ acctBal totalBal))
               ]
              ))
            )
            (map (kswap-read.pair-info) [${tokenPairList}])
             `
    );
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
