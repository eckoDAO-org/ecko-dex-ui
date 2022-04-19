/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useState } from 'react';
import Pact from 'pact-lang-api';
import pairTokens from '../constants/pairsConfig';
import { useInterval } from '../hooks/useInterval';
import axios from 'axios';
import { getTokenUsdPriceByName } from '../utils/token-utils';
import { CHAIN_ID, creationTime, FEE, GAS_PRICE, NETWORK, NETWORKID, KADDEX_NAMESPACE } from '../constants/contextConstants';
import { extractDecimal } from '../utils/reduceBalance';
import tokenData from '../constants/cryptoCurrencies';
import { useAccountContext, useNotificationContext } from '.';
import { listen } from '../api/pact';

export const PactContext = createContext();

const savedSlippage = localStorage.getItem('slippage');
const savedTtl = localStorage.getItem('ttl');

export const PactProvider = (props) => {
  const account = useAccountContext();
  const notificationContext = useNotificationContext();

  const [slippage, setSlippage] = useState(savedSlippage ? savedSlippage : 0.05);
  const [ttl, setTtl] = useState(savedTtl ? savedTtl : 600);
  const [pair, setPair] = useState('');
  const [pairReserve, setPairReserve] = useState('');
  const [precision, setPrecision] = useState(false);
  const [balances, setBalances] = useState(false);
  const [polling, setPolling] = useState(false);
  const [notificationNotCompletedChecked, setNotificationNotCompletedChecked] = useState(false);

  const [totalSupply, setTotalSupply] = useState('');
  const [ratio, setRatio] = useState(NaN);
  const [pairList, setPairList] = useState(pairTokens);
  const [swapList, setSwapList] = useState([]);
  const [offsetSwapList, setOffsetSwapList] = useState(0);
  const [moreSwap, setMoreSwap] = useState(true);
  const [loadingSwap, setLoadingSwap] = useState(false);

  const [kdxPrice, setKdxPrice] = useState(null);

  const updateKdxPrice = () => getTokenUsdPriceByName('KDX').then((price) => setKdxPrice(price || null));
  useEffect(() => {
    updateKdxPrice();
  }, []);
  useInterval(updateKdxPrice, 20000);
  useEffect(() => {
    if (!notificationNotCompletedChecked) {
      const pendingNotification = notificationContext.notificationList.filter((notif) => notif.type === 'info' && notif.isCompleted === false);
      pendingNotification.map((pendingNotif) => transactionListen(pendingNotif.description));

      setNotificationNotCompletedChecked(true);
    }
  }, []);

  useEffect(() => {
    pairReserve ? setRatio(pairReserve['token0'] / pairReserve['token1']) : setRatio(NaN);
  }, [pairReserve]);

  useEffect(() => {
    fetchPrecision();
  }, [precision]);

  useEffect(() => {
    fetchAllBalances();
  }, [balances, account.account, account.sendRes]);

  const storeSlippage = async (slippage) => {
    setSlippage(slippage);
    localStorage.setItem('slippage', slippage);
  };

  // const setReqKeysLocalStorage = (key) => {
  //   const swapReqKeysLS = JSON.parse(localStorage.getItem('swapReqKeys'));
  //   if (!swapReqKeysLS) {
  //     //first saving swapReqKeys in localstorage
  //     localStorage.setItem(`swapReqKeys`, JSON.stringify([key]));
  //   } else {
  //     swapReqKeysLS.push(key);
  //     localStorage.setItem(`swapReqKeys`, JSON.stringify(swapReqKeysLS));
  //   }
  // };

  const getEventsSwapList = async () => {
    setSwapList([]);
    const limit = 20;
    try {
      if (account.account.account) {
        setLoadingSwap(true);
        let response = await axios.get('https://estats.chainweb.com/txs/events', {
          params: {
            search: account.account.account,
            name: `${KADDEX_NAMESPACE}.exchange.SWAP`,
            offset: offsetSwapList,
            limit: limit,
          },
        });

        if (Object.values(response?.data).length < limit) setMoreSwap(false);
        if (Object.values(response?.data).length !== 0) {
          let swap = Object.values(response?.data);
          if (swap.length !== 0) {
            setSwapList(swap);
          } else setSwapList({ error: 'No swaps found' });
        } else {
          setSwapList({ error: 'No movement was performed' });
        }
        setLoadingSwap(false);
      } else {
        setSwapList({ error: 'Connect your wallet to view the swap history' });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMoreEventsSwapList = async () => {
    const limit = 20;
    let offset = offsetSwapList + limit;

    try {
      if (account.account.account) {
        setLoadingSwap(true);
        let response = await axios.get('https://estats.chainweb.com/txs/events', {
          params: {
            search: account.account.account,
            name: `${KADDEX_NAMESPACE}.exchange.SWAP`,
            offset: offset,
            limit: limit,
          },
        });
        // console.log('get more events list response: ',response);
        let swap = Object.values(response?.data);
        if (swap.length !== 0) {
          const newResults = [...swapList, ...swap];
          if (swap.length < limit) {
            setMoreSwap(false);
          }
          setSwapList(newResults);
        } else {
          setMoreSwap(false);
        }
        setLoadingSwap(false);
      } else {
        setSwapList({ error: 'Connect your wallet to view the swap history' });
      }
      setOffsetSwapList(offset);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (account.account) {
  //     getEventsSwapList();
  //   }
  // }, [account.account]);

  const fetchAllBalances = async () => {
    let endBracket = '';
    let tokenNames = Object.values(tokenData).reduce((accum, cumul) => {
      endBracket += ')';
      let code = `
      (let
        ((${cumul.name}
          (try -1 (${cumul.code}.get-balance "${account.account.account}"))
      ))`;
      accum += code;
      return accum;
    }, '');
    let objFormat = `{${Object.keys(tokenData)
      .map((token) => `"${token}": ${token}`)
      .join(',')}}`;
    tokenNames = tokenNames + objFormat + endBracket;
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: tokenNames,
          meta: Pact.lang.mkMeta('', CHAIN_ID, GAS_PRICE, 150000, creationTime(), 600),
        },
        NETWORK
      );
      if (data.result.status === 'success') {
        Object.keys(tokenData).forEach((token) => {
          tokenData[token].balance = extractDecimal(data.result.data[token]) === -1 ? '0' : extractDecimal(data.result.data[token]);
        });
        setBalances(true);
      } else {
        setBalances(false);
      }
    } catch (e) {
      console.log(e);
      setBalances(true);
    }
  };

  const fetchPrecision = async () => {
    let endBracket = '';
    let tokenNames = Object.values(tokenData).reduce((accum, cumul) => {
      endBracket += ')';
      let code = `
      (let
        ((${cumul.name}
          (try -1 (${cumul.code}.precision))
      ))`;
      accum += code;
      return accum;
    }, '');
    let objFormat = `{${Object.keys(tokenData)
      .map((token) => `"${token}": ${token}`)
      .join(',')}}`;
    tokenNames = tokenNames + objFormat + endBracket;
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: tokenNames,
          meta: Pact.lang.mkMeta('', CHAIN_ID, GAS_PRICE, 150000, creationTime(), 600),
        },
        NETWORK
      );
      if (data.result.status === 'success') {
        Object.keys(tokenData).forEach((token) => {
          tokenData[token].precision = extractDecimal(data.result.data[token]);
        });
        setPrecision(true);
      }
    } catch (e) {
      setPrecision(false);

      console.log(e);
    }
  };

  const getPairList = async () => {
    try {
      const tokenPairList = Object.keys(pairList).reduce((accum, pair) => {
        accum += `[${pair.split(':').join(' ')}] `;
        return accum;
      }, '');
      let data = await Pact.fetch.local(
        {
          pactCode: `
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
             `,
          meta: Pact.lang.mkMeta('', CHAIN_ID, GAS_PRICE, 150000, creationTime(), 600),
        },
        NETWORK
      );
      if (data.result.status === 'success') {
        let dataList = data.result.data.reduce((accum, data) => {
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
        setPairList(pairList);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const transactionListen = async (reqKey) => {
    const pollRes = await listen(reqKey);
    if (pollRes === 'success') {
      notificationContext.showSuccessNotification(reqKey);
    } else {
      notificationContext.showErrorNotification(reqKey);
    }
  };

  const tokens = async (token0, token1, account) => {
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: `
          (${KADDEX_NAMESPACE}.tokens.get-tokens)
           `,
          meta: Pact.lang.mkMeta('', CHAIN_ID, GAS_PRICE, 150000, creationTime(), 600),
        },
        NETWORK
      );
      if (data.result.status === 'success') {
        return data.result.data;
      } else {
        await setPairReserve(null);
        console.log('Failed');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getCurrentKdaUSDPrice = async () => {
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: `
          (${KADDEX_NAMESPACE}.public-sale.kda-current-usd-price)
          `,
          meta: Pact.lang.mkMeta('', '0', GAS_PRICE, 150000, creationTime(), 600),
          chainId: 0,
        },
        `https://api.chainweb.com/chainweb/0.0/${NETWORKID}/chain/0/pact`
      );
      return data.result?.status === 'success' ? data.result?.data : null;
    } catch (e) {
      console.log(e);
    }
  };

  const getTotalTokenSupply = async (token0, token1) => {
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: `(${KADDEX_NAMESPACE}.tokens.total-supply (${KADDEX_NAMESPACE}.exchange.get-pair-key ${token0} ${token1}))`,
          keyPairs: Pact.crypto.genKeyPair(),
          meta: Pact.lang.mkMeta('', CHAIN_ID, 0.01, 100000000, 28800, creationTime()),
        },
        NETWORK
      );
      if (data.result.status === 'success') {
        if (data.result.data.decimal) setTotalSupply(data.result.data.decimal);
        else setTotalSupply(data.result.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getPair = async (token0, token1) => {
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: `(${KADDEX_NAMESPACE}.exchange.get-pair ${token0} ${token1})`,
          keyPairs: Pact.crypto.genKeyPair(),
          meta: Pact.lang.mkMeta('', CHAIN_ID, GAS_PRICE, 150000, creationTime(), 600),
        },
        NETWORK
      );
      if (data.result.status === 'success') {
        setPair(data.result.data);
        return data.result.data;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getPairKey = async (token0, token1) => {
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: `(${KADDEX_NAMESPACE}.exchange.get-pair-key ${token0} ${token1})`,
          meta: Pact.lang.mkMeta(account.account.account, CHAIN_ID, GAS_PRICE, 150000, creationTime(), 600),
        },
        NETWORK
      );
      if (data.result.status === 'success') {
        return data.result.data;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getReserves = async (token0, token1) => {
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: `
          (use ${KADDEX_NAMESPACE}.exchange)
          (let*
            (
              (p (get-pair ${token0} ${token1}))
              (reserveA (reserve-for p ${token0}))
              (reserveB (reserve-for p ${token1}))
            )[reserveA reserveB])
           `,
          meta: Pact.lang.mkMeta('account', CHAIN_ID, GAS_PRICE, 150000, creationTime(), 600),
        },
        NETWORK
      );
      if (data.result.status === 'success') {
        await setPairReserve({
          token0: data.result.data[0].decimal ? data.result.data[0].decimal : data.result.data[0],
          token1: data.result.data[1].decimal ? data.result.data[1].decimal : data.result.data[1],
        });
      } else {
        await setPairReserve({});
      }
    } catch (e) {
      console.log(e);
    }
  };

  const storeTtl = async (ttl) => {
    await setTtl(slippage);
    await localStorage.setItem('ttl', ttl);
  };

  // UTILS

  const getRatio = (toToken, fromToken) => {
    if (toToken === fromToken) return 1;
    return pairReserve['token1'] / pairReserve['token0'];
  };

  const getRatio1 = (toToken, fromToken) => {
    if (toToken === fromToken) return 1;
    return pairReserve['token0'] / pairReserve['token1'];
  };

  const share = (amount) => {
    return Number(amount) / (Number(pairReserve['token0']) + Number(amount));
  };

  //COMPUTE_OUT
  var computeOut = function (amountIn) {
    let reserveOut = Number(pairReserve['token1']);
    let reserveIn = Number(pairReserve['token0']);
    let numerator = Number(amountIn * (1 - FEE) * reserveOut);
    let denominator = Number(reserveIn + amountIn * (1 - FEE));
    return numerator / denominator;
  };

  //COMPUTE_IN
  var computeIn = function (amountOut) {
    let reserveOut = Number(pairReserve['token1']);
    let reserveIn = Number(pairReserve['token0']);
    let numerator = Number(reserveIn * amountOut);
    let denominator = Number((reserveOut - amountOut) * (1 - FEE));
    // round up the last digit
    return numerator / denominator;
  };

  function computePriceImpact(amountIn, amountOut) {
    const reserveOut = Number(pairReserve['token1']);
    const reserveIn = Number(pairReserve['token0']);
    const midPrice = reserveOut / reserveIn;
    const exactQuote = amountIn * midPrice;
    const slippage = (exactQuote - amountOut) / exactQuote;
    return slippage;
  }

  function priceImpactWithoutFee(priceImpact) {
    return priceImpact - realizedLPFee();
  }

  function realizedLPFee(numHops = 1) {
    return 1 - (1 - FEE) * numHops;
  }

  const contextValues = {
    kdxPrice,
    slippage,
    setSlippage,
    storeSlippage,
    ttl,
    setTtl,
    storeTtl,
    precision,
    setPrecision,
    fetchPrecision,
    balances,
    setBalances,
    fetchAllBalances,
    pairList,
    setPairList,
    getPairList,
    swapList,
    totalSupply,
    getTotalTokenSupply,
    getMoreEventsSwapList,
    moreSwap,
    transactionListen,
    polling,
    setPolling,
    ratio,
    getRatio,
    getRatio1,
    share,
    pair,
    setPair,
    getPair,
    getPairKey,
    getReserves,
    tokens,
    computePriceImpact,
    priceImpactWithoutFee,
    computeOut,
    computeIn,
    setMoreSwap,
    getCurrentKdaUSDPrice,
    loadingSwap,
    getEventsSwapList,
  };
  return <PactContext.Provider value={contextValues}>{props.children}</PactContext.Provider>;
};

export const PactConsumer = PactContext.Consumer;
