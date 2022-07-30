/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useState } from 'react';
import Pact from 'pact-lang-api';
import pairTokens from '../constants/pairsConfig';
import { useInterval } from '../hooks/useInterval';
import axios from 'axios';
import { getTokenUsdPriceByName } from '../utils/token-utils';
import { CHAIN_ID, creationTime, FEE, GAS_PRICE, NETWORK, KADDEX_NAMESPACE, KADDEX_API_URL } from '../constants/contextConstants';
import { useAccountContext, useNotificationContext, useWalletContext } from '.';
import { fetchPrecision } from '../api/pact';
import tokenData from '../constants/cryptoCurrencies';
import { GAS_OPTIONS } from '../constants/gasConfiguration';

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
  const account = useAccountContext();
  const wallet = useWalletContext();
  const notificationContext = useNotificationContext();

  const [slippage, setSlippage] = useState(savedSlippage ? savedSlippage : 0.05);
  const [ttl, setTtl] = useState(savedTtl ? savedTtl : 600);
  const [pairReserve, setPairReserve] = useState('');
  const [precision, setPrecision] = useState(false);
  const [polling, setPolling] = useState(false);
  const [pactCmd, setPactCmd] = useState(null);

  const [ratio, setRatio] = useState(NaN);
  const [pairList, setPairList] = useState(pairTokens);
  const [swapList, setSwapList] = useState([]);
  const [offsetSwapList, setOffsetSwapList] = useState(0);
  const [moreSwap, setMoreSwap] = useState(true);
  const [loadingSwap, setLoadingSwap] = useState(false);

  const [tokensUsdPrice, setTokensUsdPrice] = useState(null);

  const [enableGasStation, setEnableGasStation] = useState(true);
  const [gasConfiguration, setGasConfiguration] = useState(GAS_OPTIONS.DEFAULT.SWAP);
  const [networkGasData, setNetworkGasData] = useState(initialNetworkGasData);

  const handleGasConfiguration = (key, value) => {
    setGasConfiguration((prev) => ({ ...prev, [key]: value }));
  };

  const getNetworkGasData = async () => {
    try {
      let response = await axios.get(`${KADDEX_API_URL}/api/mempool/getgasdata`, {
        params: {
          chain: CHAIN_ID,
        },
      });
      setNetworkGasData(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    getNetworkGasData();
  }, []);
  useInterval(getNetworkGasData, 20000);

  const updateTokenUsdPrice = async () => {
    const result = {};
    for (const token of Object.values(tokenData)) {
      await getTokenUsdPriceByName(token.name).then((price) => {
        result[token.name] = price;
      });
    }
    setTokensUsdPrice(result);
  };

  useEffect(() => {
    updateTokenUsdPrice();
  }, []);
  useInterval(updateTokenUsdPrice, 25000);

  useEffect(() => {
    pairReserve ? setRatio(pairReserve['token0'] / pairReserve['token1']) : setRatio(NaN);
  }, [pairReserve]);

  useEffect(() => {
    fetchPrecision();
  }, []);

  useEffect(() => {
    if (!wallet.wallet) {
      storeTtl(600);
    }
  }, []);

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
          setSwapList({ error: 'This Devnet environment does not have a block explorer.' });
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
        setPairReserve({
          token0: data.result.data[0].decimal ? data.result.data[0].decimal : data.result.data[0],
          token1: data.result.data[1].decimal ? data.result.data[1].decimal : data.result.data[1],
        });
      } else {
        setPairReserve({});
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
    pairList,
    setPairList,
    swapList,
    getMoreEventsSwapList,
    moreSwap,
    polling,
    setPolling,
    ratio,
    getRatio,
    getRatio1,
    share,
    getReserves,
    txSend,
    computePriceImpact,
    priceImpactWithoutFee,
    computeOut,
    computeIn,
    setMoreSwap,
    loadingSwap,
    getEventsSwapList,
  };
  return <PactContext.Provider value={contextValues}>{props.children}</PactContext.Provider>;
};

export const PactConsumer = PactContext.Consumer;
