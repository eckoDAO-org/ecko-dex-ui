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
    const tokenPairListWithBooster = Object.values(pairTokens)
      .filter((token) => token.isBoosted)
      .reduce((accum, pair) => {
        accum += `[${pair.name.split(':').join(' ')}] `;
        return accum;
      }, '');
    const tokenPairListWithoutBooster = Object.values(pairTokens)
      .filter((token) => !token.isBoosted)
      .reduce((accum, pair) => {
        accum += `[${pair.name.split(':').join(' ')}] `;
        return accum;
      }, '');

    const boosterResult = await dataWithBooster(account, tokenPairListWithBooster);

    const noBoosterResult = await dataWithoutBooster(account, tokenPairListWithoutBooster);

    const totalResult = boosterResult.concat(noBoosterResult);

    return totalResult;
  } catch (e) {
    return handleError(e);
  }
};

export const getOneSideLiquidityPairInfo = async (amountA, slippage, token0, token1) => {
  try {
    let data = await pactFetchLocal(
      `
    (namespace 'free)

    (module ${KADDEX_NAMESPACE}-read G

      (defcap G ()
        true)

      (defun pair-info ()
        (let* (
          (p (${KADDEX_NAMESPACE}.exchange.get-pair ${token0} ${token1}))
          (pair-account (at 'account p))
          (amountB (${KADDEX_NAMESPACE}.wrapper.get-other-side-token-amount-after-swap ${amountA} ${token0} ${token1} (+ 1.0 ${slippage})))
          (reserveA (${KADDEX_NAMESPACE}.exchange.reserve-for p ${token0}))
          (amountA-after-swap (- ${amountA} (${KADDEX_NAMESPACE}.wrapper.get-one-sided-liquidity-swap-amount reserveA ${amountA})))
          (amountA-min (${KADDEX_NAMESPACE}.exchange.truncate ${token0} (* amountA-after-swap (- 1.0 ${slippage}))))
          (amountB-min (${KADDEX_NAMESPACE}.exchange.truncate ${token1} (* (/ amountB (+ 1.0 ${slippage})) (- 1.0 ${slippage}))))
        )
        { 'account: pair-account, 'amountB: amountB, 'amountA-min: amountA-min, 'amountB-min: amountB-min }
      ))
    )
     (${KADDEX_NAMESPACE}-read.pair-info)
           `
    );
    if (data) {
      return data;
    } else {
      return handleError('');
    }
  } catch (e) {
    return handleError(e);
  }
};

const dataWithoutBooster = async (account, tokenPairList) => {
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

    const pairList = Object.values(pairTokens)
      .filter((token) => !token.isBoosted)
      .map((pair) => {
        return {
          ...pair,
          ...dataList[pair.name],
        };
      });
    return pairList;
  }
};

const dataWithBooster = async (account, tokenPairList) => {
  let data = await pactFetchLocal(
    `(namespace 'free)

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
          (result (try {
"initialA": 0.0,
"feesB": 0.0,
"totalB": 0.0,
"initialB": 0.0,
"feesA": 0.0,
"liquidity": 0.0,
"user-pool-share": 0.0,
"totalA": 0.0,
"reserveA":0.0,
"reserveB":0.0
} (${KADDEX_NAMESPACE}.wrapper.get-user-position-stats token0 token1 ${JSON.stringify(account)})))
        )
        [{"initialA":(at 'initialA result),
        "feesB":(at 'feesB result),
        "totalB":(at 'totalB result),
        "initialB":(at 'initialB result),
        "feesA":(at 'feesA result),
        "liquidity":(at 'liquidity result),
        "user-pool-share":(at 'user-pool-share result),
        "totalA":(at 'totalA result),
        "reserveA":reserveA,
        "reserveB":reserveB}]
      ))
    )
    (map (${KADDEX_NAMESPACE}-read.pair-info) [${tokenPairList}])`
  );

  if (data) {
    const dataList = data.map((data, index) => {
      let dataObj = {
        balance: data[0]['liquidity'],
        pooledAmount: [data[0]['totalA'], data[0]['totalB']],
        poolShare: data[0]['user-pool-share'],
        reserves: [data[0]['reserveA'], data[0]['reserveB']],
      };

      return dataObj;
    });

    const pairList = Object.values(pairTokens)
      .filter((token) => token.isBoosted)
      .map((pair, index) => {
        return {
          ...pair,
          ...dataList[index],
        };
      });
    return pairList;
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
