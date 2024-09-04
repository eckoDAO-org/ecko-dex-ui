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
import {loadTokens } from '../constants/tokenLoader';
import { GAS_OPTIONS } from '../constants/gasConfiguration';
import { getPairs} from '../api/pairs';
import { reduceBalance, getShorterNameSpace} from '../utils/reduceBalance';
import { getAnalyticsKdaUsdPrice, getCoingeckoUsdPrice } from '../api/coingecko';
import { getAnalyticsDexscanPoolsData } from '../api/kaddex-analytics';
import {DEFAULT_ICON_URL} from '../constants/cryptoCurrencies';

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
  const [tokensKdaPrice, setTokensKdaPrice] = useState(null);

  const [enableGasStation, setEnableGasStation] = useState(true);
  const [gasConfiguration, setGasConfiguration] = useState(GAS_OPTIONS.DEFAULT.SWAP);
  const [networkGasData, setNetworkGasData] = useState(initialNetworkGasData);

  const [tokensBlacklist, setTokensBlacklist] = useState(null);

  const [allPairs, setAllPairs] = useState({});
  const [allTokens, setAllTokens] = useState({});

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

  const update_unverified = (old_toks, new_toks) => { const tmp_toks ={}
                                                      new_toks.forEach( ([k, v]) => {if (!old_toks?.[k]?.isVerified)
                                                                                      tmp_toks[k] = v})
                                                      return {...old_toks, ...tmp_toks}}


  /* Step1 => Load the Tokens + Blaclist from the YAML */
  useEffect(() => loadTokens().then( ({data, blacklist}) => {console.log("Tokens loaded from GH repository");
                                                             const good_tokens = data.filter( ([mod,]) => !blacklist.includes(mod) )
                                                             setAllTokens(Object.fromEntries(good_tokens))
                                                             setTokensBlacklist(blacklist);})
                              .catch( () => console.error("Cannot retrieve tokens list => This is very bad"))
            ,[])




    /* Step 2 => Once the blacklist is loaded, loat pairs from the node */
  const filter_pair_by_blacklist = (x) => {const [tokA, tokB] = x.split(":")
                                           return !tokensBlacklist.includes(tokA) && !tokensBlacklist.includes(tokB)}

  const create_unknwon_token = (t) => ({ name: getShorterNameSpace(t),
                                         coingeckoId: "",
                                         tokenNameKaddexStats: t,
                                         code: t,
                                         statsId: t,
                                         icon: DEFAULT_ICON_URL,
                                         color: '#FFFFFF',
                                         main: false,
                                         precision: 12,
                                         isVerified: false})

  const pair_to_token = (p) => {
    const [tokA, tokB] = p.split(":")
    return tokA === "coin"? [tokB, create_unknwon_token(tokB)]: [tokA, create_unknwon_token(tokA)]
  }

  const pair_to_pair_object = (p) => {
    const [tokA, tokB] = p.split(":")
    return [p, {name:p,
                token0: allTokens[tokA]?.name || getShorterNameSpace(tokA),
                token1: allTokens[tokB]?.name || getShorterNameSpace(tokB),
                token0_code: tokA,
                token1_code: tokB,
                main:true,
                isBoosted:false,
                color: allTokens[tokA==="coin"?tokB:tokA]?.color ||'#FFFFFF',
                isVerified:false}]
   }

  useEffect(() => {if(tokensBlacklist && tokensBlacklist.length > 0)
                      getPairs().then( (data) => { const flt_data = data.filter(filter_pair_by_blacklist);
                                                   console.log("Pairs list recieved from Pact node")
                                                   setAllPairs( (prev) => update_unverified(prev, flt_data.map(pair_to_pair_object)));
                                                   setAllTokens( (prev) => update_unverified(prev, flt_data.map(pair_to_token)))
                                                 })
                                .catch(()=> console.warn("Error during pair laoding from chain => Don't worry; not fatal"))
                  }, [tokensBlacklist]);


  const filter_apipair_by_blacklist = (x) => {const tokA = x.token0.address
                                              const tokB = x.token1.address
                                              return !tokensBlacklist.includes(tokA) && !tokensBlacklist.includes(tokB)}

  const apipair_to_pair_object = (p) => {
    const base_token =  p.token0.name === "KDA"?p.token1:p.token0;
    const tokens = [p.token0, p.token1].sort((a,b) => a.address > b.address)
    const pair = tokens.map(x=>x.address).join(":")
    return [pair, {name:pair,
                   token0: tokens[0].name,
                   token1: tokens[1].name,
                   token0_code: tokens[0].address,
                   token1_code: tokens[1].address,
                   main:true,
                   isBoosted:false,
                   color: allTokens[base_token.address]?.color ||'#FFFFFF',
                   isVerified:true}]
  }

  const apipair_to_token = (p) => {
    const token =  p.token0.name === "KDA"?p.token1:p.token0;
    return [token.address, { name: token.name,
                             coingeckoId: "",
                             tokenNameKaddexStats: token.address,
                             code: token.address,
                             statsId: token.address,
                             icon: token.img || DEFAULT_ICON_URL,
                             color: '#FFFFFF',
                             main: false,
                             precision: 12,
                             isVerified: true}]
  }




  useEffect(() => {if(!tokensBlacklist || tokensBlacklist.length === 0)
                      return
                   getAnalyticsDexscanPoolsData().then( (data) => { const flt_data = data.filter(filter_apipair_by_blacklist);
                                                                    console.log("Pairs list recieved from backend")
                                                                    setAllPairs( (prev) => update_unverified(prev, flt_data.map(apipair_to_pair_object)));
                                                                    setAllTokens( (prev) => update_unverified(prev, flt_data.map(apipair_to_token)))
                                                                  })
                                                  .catch(()=> console.warn("Error during pair laoding from API => Not fatal but UX may be degraded"))
                  }, [tokensBlacklist]);



  const updateTokenUsdPrice = async (kdaPrice) => {
    const pairList = await getPairList(allPairs);
    const resultUsd = {};
    const resultKda = {};
    const dexscanPoolsStats = await getAnalyticsDexscanPoolsData();
    if (allTokens) {
      for (const [token_key, token] of Object.entries(allTokens)) {
        await getTokenUsdPriceByName(token.name, pairList, allTokens, kdaPrice, dexscanPoolsStats).then((price) => {
          resultUsd[token_key] = price.usd;
          resultKda[token_key] = price.kda;
        });
      }
    }
    setTokensUsdPrice(resultUsd);
    setTokensKdaPrice(resultKda);
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
    tokensKdaPrice,
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
