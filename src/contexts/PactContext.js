/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useState } from 'react';
import Pact from 'pact-lang-api';
// import { useInterval } from '../hooks/useInterval';
import axios from 'axios';
import { getTokenUsdPriceByName } from '../utils/token-utils';
import { CHAIN_ID, creationTime, FEE, GAS_PRICE, NETWORK, KADDEX_NAMESPACE } from '../constants/contextConstants';
import { useNotificationContext, useWalletContext } from '.';
import { fetchPrecision, getPairList } from '../api/pact';
import {tokenData, pairsData, blacklistedTokenData } from '../constants/cryptoCurrencies';
import { GAS_OPTIONS } from '../constants/gasConfiguration';
import { getPairs, getTokenNameFromAddress } from '../api/pairs';
import { UnknownLogo } from '../assets';
import { reduceBalance } from '../utils/reduceBalance';
import { getAnalyticsKdaUsdPrice, getCoingeckoUsdPrice } from '../api/coingecko';
import { getAnalyticsDexscanPoolsData } from '../api/kaddex-analytics';

export const PactContext = createContext();

const savedSlippage = localStorage.getItem('slippage');
const savedTtl = localStorage.getItem('ttl');

const initialNetworkGasData = {
  highestGasPrice: 0,
  networkCongested: false,
  suggestedGasPrice: 0,
  lowestGasPrice: 0,
};

export const PactProvider = (props) => {
  const wallet = useWalletContext();
  const notificationContext = useNotificationContext();

  const [slippage, setSlippage] = useState(savedSlippage ? savedSlippage : 0.05);
  const [ttl, setTtl] = useState(savedTtl ? savedTtl : 600);
  const [pairReserve, setPairReserve] = useState('');
  const [multihopsReserves, setMultihopsReserves] = useState(null);

  const [precision, setPrecision] = useState(false);
  const [polling, setPolling] = useState(false);
  const [pactCmd, setPactCmd] = useState(null);

  const [ratio, setRatio] = useState(NaN);

  const [tokensUsdPrice, setTokensUsdPrice] = useState(null);

  const [enableGasStation, setEnableGasStation] = useState(true);
  const [gasConfiguration, setGasConfiguration] = useState(GAS_OPTIONS.DEFAULT.SWAP);
  const [networkGasData, setNetworkGasData] = useState(initialNetworkGasData);

  const [allPairs, setAllPairs] = useState(null);
  const [allTokens, setAllTokens] = useState(null);

  const [isMultihopsSwap, setIsMultihopsSwap] = useState(false);

  const [kdaUsdPrice, setKdaUsdPrice] = useState(null);

  const [multihopsCoinAmount, setMultihopsCoinAmount] = useState(null);

  const handleGasConfiguration = (key, value) => {
    setGasConfiguration((prev) => ({ ...prev, [key]: value }));
  };

  const getNetworkGasData = async () => {
    try {
      let response = await axios.get(`${process.env.REACT_APP_KADDEX_STATS_API_URL}/mempool/get-gas-data`);
      setNetworkGasData(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    getNetworkGasData();
  }, []);
  // useInterval(getNetworkGasData, 20000);

  const getPairsData = async () => {
    const result = await getPairs();
    let communityList = {};
    let communityTokenList = {};
    if (result.errorMessage) {
      console.log('ERROR');
      return;
    } else {
      const communityPairs = result.filter((r) => !pairsData.hasOwnProperty(r));
      const communityPairsWithKda = communityPairs.filter((res) => res.split(':')[0] === 'coin' || res.split(':')[1] === 'coin');

      communityPairsWithKda.map((item) => {
        // TOKENS
        const tokens = item.split(':');
        const token0 = tokens[0]; // Gets the first contract
        const token1 = tokens[1]; // Gets the second contract

        if (blacklistedTokenData.includes(token0) || blacklistedTokenData.includes(token1)) {
          return;
        }

        const tokenToCheck = token0 === 'coin' ? token1 : token0;
        const communityToken = {
          name: getTokenNameFromAddress(tokenToCheck, communityTokenList),
          coingeckoId: '',
          statsID: tokenToCheck,
          tokenNameKaddexStats: tokenToCheck,
          code: tokenToCheck,
          main: false,
          icon: <UnknownLogo style={{ marginRight: 8 }} />,
          color: '',
          precision: 12,
          isVerified: false,
        };
        communityTokenList[communityToken.name] = communityToken;

        let cpToken0Name = '';
        let cpToken1Name = '';

        Object.keys(communityTokenList).forEach((item) => {
          if (communityTokenList[item].code === token0) {
            cpToken0Name = communityTokenList[item].name;
          }
          if (communityTokenList[item].code === token1) {
            cpToken1Name = communityTokenList[item].name;
          }
        });

        // PAIRS
        const communityPair = {
          name: item,
          token0: tokens[0] === 'coin' ? 'KDA' : cpToken0Name,
          token1: tokens[1] === 'coin' ? 'KDA' : cpToken1Name,
          main: false,
          isBoosted: false,
          color: '#92187B',
          isVerified: false,
        };
        communityList[communityPair.name] = communityPair;
      });
      setAllTokens((prev) => ({ ...prev, ...tokenData, ...communityTokenList }));
      setAllPairs((prev) => ({ ...prev, ...pairsData, ...communityList }));
    }
    return;
  };

  useEffect(() => {
    async function fetchData() {
      await getPairsData();
    }

    fetchData();
  }, []);

  const updateTokenUsdPrice = async (kdaPrice) => {
    const pairList = await getPairList(allPairs);
    const result = {};
    const dexscanPoolsStats = await getAnalyticsDexscanPoolsData();
    if (allTokens) {
      for (const token of Object.values(allTokens)) {
        await getTokenUsdPriceByName(token.name, pairList, allTokens, kdaPrice, dexscanPoolsStats).then((price) => {
          result[token.name] = price;
        });
      }
    }
    setTokensUsdPrice(result);
  };

  useEffect(() => {
    if (allPairs && allTokens) {
      const getInitialData = async () => {
        let kdaUsdPrice = await getCoingeckoUsdPrice('kadena');
        if (!kdaUsdPrice) {
          kdaUsdPrice = await getAnalyticsKdaUsdPrice();
        }
        setKdaUsdPrice(kdaUsdPrice);
        updateTokenUsdPrice(kdaUsdPrice);
      };
      getInitialData();
    }
  }, [allTokens, allPairs]);
  // useInterval(updateTokenUsdPrice, 25000);

  useEffect(() => {
    if (pairReserve || multihopsReserves) {
      if (isMultihopsSwap) {
        const ratioFromToken = multihopsReserves.fromData.reserves.coin / multihopsReserves.fromData.reserves.token;
        const ratioToToken = multihopsReserves.toData.reserves.coin / multihopsReserves.toData.reserves.token;
        setRatio(ratioToToken / ratioFromToken);
      } else {
        pairReserve['token0'] === 0 && pairReserve['token1'] === 0 ? setRatio(0) : setRatio(pairReserve['token0'] / pairReserve['token1']);
      }
    } else {
      setRatio(NaN);
    }
  }, [pairReserve, multihopsReserves]);

  useEffect(() => {
    if (!wallet.wallet) {
      storeTtl(600);
    }
  }, []);

  const getReserves = async (token0, token1) => {
    setIsMultihopsSwap(false);
    setMultihopsReserves(null);
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
        setPairReserve({
          token0: data.result.data[0].decimal ? data.result.data[0].decimal : data.result.data[0],
          token1: data.result.data[1].decimal ? data.result.data[1].decimal : data.result.data[1],
        });
      } else {
        setPairReserve('');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getReservesMultihops = async (token0, token1) => {
    setPairReserve('');
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: `
          (use ${KADDEX_NAMESPACE}.exchange)
          (let*
            (
              (p (get-pair coin ${token0}))
              (reserveA (reserve-for p coin))
              (reserveB (reserve-for p ${token0}))
              (pairAccount (at 'account p))

              (p2 (get-pair coin ${token1}))
              (reserveC (reserve-for p2 coin))
              (reserveD (reserve-for p2 ${token1}))
              (pairAccount2 (at 'account p2))
            )[reserveA reserveB reserveC reserveD pairAccount pairAccount2])
           `,
          meta: Pact.lang.mkMeta('account', CHAIN_ID, GAS_PRICE, 150000, creationTime(), 600),
        },
        NETWORK
      );
      if (data.result.status === 'success') {
        setMultihopsReserves({
          fromData: {
            code: token0,
            reserves: {
              coin: data.result.data[0].decimal ? data.result.data[0].decimal : data.result.data[0],
              token: data.result.data[1].decimal ? data.result.data[1].decimal : data.result.data[1],
            },
            pairAccount: data.result.data[4],
          },
          toData: {
            code: token1,
            reserves: {
              coin: data.result.data[2].decimal ? data.result.data[2].decimal : data.result.data[2],
              token: data.result.data[3].decimal ? data.result.data[3].decimal : data.result.data[3],
            },
            pairAccount: data.result.data[5],
          },
        });
      } else {
        setMultihopsReserves(null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const txSend = async () => {
    setPolling(true);
    try {
      let data;
      if (pactCmd.pactCode) {
        data = await Pact.fetch.send(pactCmd, NETWORK);
      } else {
        data = await Pact.wallet.sendSigned(pactCmd, NETWORK);
      }
      notificationContext.pollingNotif(data.requestKeys[0], 'Transaction Pending');

      await notificationContext.transactionListen(data.requestKeys[0]);
      setPolling(false);
    } catch (e) {
      setPolling(false);
      notificationContext.showErrorNotification(null, 'Transaction Error', 'Insufficient funds - attempt to buy gas failed.');
      console.log('error', e);
    }
  };

  const storeSlippage = async (slippage) => {
    setSlippage(slippage);
    localStorage.setItem('slippage', slippage);
  };

  const storeTtl = async (ttl) => {
    setTtl(ttl);
    localStorage.setItem('ttl', ttl);
  };

  // UTILS

  const getRatioFirstAddLiquidity = (toToken, toTokenAmount, fromToken, fromTokenAmount) => {
    if (toToken === fromToken) return 1;
    else if (toTokenAmount / fromTokenAmount && toTokenAmount / fromTokenAmount !== Infinity) return reduceBalance(toTokenAmount / fromTokenAmount);
    else return '-';
  };

  const getRatioFirstAddLiquidityInverse = (toToken, toTokenAmount, fromToken, fromTokenAmount) => {
    if (toToken === fromToken) return 1;
    else if (fromTokenAmount / toTokenAmount && fromTokenAmount / toTokenAmount !== Infinity) return reduceBalance(fromTokenAmount / toTokenAmount);
    else return '-';
  };

  const getRatio = (toToken, fromToken) => {
    if (toToken === fromToken) return 1;
    else if (pairReserve['token1'] === 0 && pairReserve['token0'] === 0) return 1;
    else return pairReserve['token1'] / pairReserve['token0'];
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
    if (isMultihopsSwap) {
      return computeOutMultihopsHandler(amountIn);
    } else {
      let reserveOut = Number(pairReserve['token1']);
      let reserveIn = Number(pairReserve['token0']);
      let numerator = Number(amountIn * (1 - FEE) * reserveOut);
      let denominator = Number(reserveIn + amountIn * (1 - FEE));
      return denominator !== 0 ? numerator / denominator : 0;
    }
  };

  //COMPUTE_IN
  var computeIn = function (amountOut) {
    if (isMultihopsSwap) {
      return computeInMultihopsHandler(amountOut);
    } else {
      let reserveOut = Number(pairReserve['token1']);
      let reserveIn = Number(pairReserve['token0']);
      let numerator = Number(reserveIn * amountOut);
      let denominator = Number((reserveOut - amountOut) * (1 - FEE));
      // round up the last digit
      return denominator !== 0 ? numerator / denominator : 0;
    }
  };

  //COMPUTE_OUT_MULTIHOPS_HANDLER
  var computeOutMultihopsHandler = function (amountIn) {
    var newAmountIn = computeOutMultihops(
      amountIn,
      multihopsReserves.fromData.reserves.token /* reserveIn */,
      multihopsReserves.fromData.reserves.coin /* reserveOut */
    );
    var amountOut = computeOutMultihops(
      newAmountIn,
      multihopsReserves.toData.reserves.coin /* reserveIn */,
      multihopsReserves.toData.reserves.token /* reserveOut */
    );

    return amountOut;
  };

  //COMPUTE_IN_MULTIHOPS_HANDLER
  var computeInMultihopsHandler = function (amountOut) {
    var newAmountOut = computeInMultihops(
      amountOut,
      multihopsReserves.fromData.reserves.token /* reserveIn */,
      multihopsReserves.fromData.reserves.coin /* reserveOut */
    );
    var amountIn = computeInMultihops(
      newAmountOut,
      multihopsReserves.toData.reserves.coin /* reserveIn */,
      multihopsReserves.toData.reserves.token /* reserveOut */
    );
    return amountIn;
  };

  //COMPUTE_OUT_MULTIHOPS
  var computeOutMultihops = function (amountIn, reserveIn, reserveOut) {
    const reserveInNumber = Number(reserveIn);
    const reserveOutNumber = Number(reserveOut);

    let numerator = Number(amountIn * (1 - FEE) * reserveOutNumber);
    let denominator = Number(reserveInNumber + amountIn * (1 - FEE));
    return denominator !== 0 ? numerator / denominator : 0;
  };

  //COMPUTE_IN_MULTIHOPS
  var computeInMultihops = function (amountOut, reserveIn, reserveOut) {
    const reserveInNumber = Number(reserveIn);
    const reserveOutNumber = Number(reserveOut);
    let numerator = Number(reserveInNumber * amountOut);
    let denominator = Number((reserveOutNumber - amountOut) * (1 - FEE));
    // round up the last digit
    return denominator !== 0 ? numerator / denominator : 0;
  };

  //COMPUTE_PRICE_IMPACT
  function computePriceImpact(amountIn, amountOut) {
    if (isMultihopsSwap) {
      return computePriceImpactMultihopsHandler(amountIn, amountOut);
    } else {
      const reserveOut = Number(pairReserve['token1']);
      const reserveIn = Number(pairReserve['token0']);
      const midPrice = reserveIn !== 0 ? reserveOut / reserveIn : 0;
      const exactQuote = amountIn * midPrice;
      const slippage = exactQuote !== 0 ? (exactQuote - amountOut) / exactQuote : 0;
      return slippage;
    }
  }

  //COMPUTE_PRICE_IMPACT_MULTIHOPS_HANDLER
  function computePriceImpactMultihopsHandler(amountIn, amountOut) {
    const coinAmount = computeOutMultihops(
      amountIn,
      multihopsReserves.fromData.reserves.token /* reserveIn */,
      multihopsReserves.fromData.reserves.coin /* reserveOut */
    );
    setMultihopsCoinAmount(coinAmount);
    const priceImpactFirstPair = computePriceImpactMultihops(
      amountIn,
      coinAmount,
      multihopsReserves.fromData.reserves.token /* reserveIn */,
      multihopsReserves.fromData.reserves.coin /* reserveOut */
    );
    const priceImpactSecondPair = computePriceImpactMultihops(
      coinAmount,
      amountOut,
      multihopsReserves.toData.reserves.coin /* reserveIn */,
      multihopsReserves.toData.reserves.token /* reserveOut */
    );
    const priceImpact = priceImpactFirstPair >= priceImpactSecondPair ? priceImpactFirstPair : priceImpactSecondPair;
    return priceImpact;
  }

  //COMPUTE_PRICE_IMPACT_MULTIHOPS
  function computePriceImpactMultihops(amountIn, amountOut, reserveIn, reserveOut) {
    const midPrice = reserveIn !== 0 ? reserveOut / reserveIn : 0;
    const exactQuote = amountIn * midPrice;
    const slippage = exactQuote !== 0 ? (exactQuote - amountOut) / exactQuote : 0;
    return slippage;
  }

  function priceImpactWithoutFee(priceImpact) {
    return priceImpact - realizedLPFee();
  }

  function realizedLPFee(numHops = 1) {
    if (isMultihopsSwap) {
      numHops = 2;
    }
    const res = 1 - (1 - FEE * numHops);
    return res;
  }

  const contextValues = {
    setPactCmd,
    tokensUsdPrice,
    slippage,
    setSlippage,
    storeSlippage,
    ttl,
    setTtl,
    storeTtl,
    enableGasStation,
    setEnableGasStation,
    gasConfiguration,
    setGasConfiguration,
    handleGasConfiguration,
    networkGasData,
    precision,
    setPrecision,
    fetchPrecision,
    allPairs,
    allTokens,
    polling,
    setPolling,
    ratio,
    getRatioFirstAddLiquidity,
    getRatioFirstAddLiquidityInverse,
    getRatio,
    getRatio1,
    share,
    isMultihopsSwap,
    setIsMultihopsSwap,
    pairReserve,
    multihopsReserves,
    getReserves,
    getReservesMultihops,
    txSend,
    computePriceImpact,
    priceImpactWithoutFee,
    computeOut,
    computeIn,
    kdaUsdPrice,
    multihopsCoinAmount,
  };
  return <PactContext.Provider value={contextValues}>{props.children}</PactContext.Provider>;
};

export const PactConsumer = PactContext.Consumer;
