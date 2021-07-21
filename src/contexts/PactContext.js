import React, { createContext, useContext, useEffect, useState } from "react";
import Pact from "pact-lang-api";
import {
  chainId,
  creationTime,
  FEE,
  GAS_PRICE,
  network,
} from "../constants/contextConstants";
import { extractDecimal } from "../utils/reduceBalance";
import tokenData from "../constants/cryptoCurrencies";
import { AccountContext } from "./AccountContext";

export const PactContext = createContext();

const savedSlippage = localStorage.getItem("slippage");
const savedTtl = localStorage.getItem("ttl");

export const PactProvider = (props) => {
  const account = useContext(AccountContext);

  const [slippage, setSlippage] = useState(
    savedSlippage ? savedSlippage : 0.05
  );
  const [ttl, setTtl] = useState(savedTtl ? savedTtl : 600);
  const [pair, setPair] = useState("");
  const [pairReserve, setPairReserve] = useState("");
  const [precision, setPrecision] = useState(false);

  const [balances, setBalances] = useState(false);
  const [totalSupply, setTotalSupply] = useState("");
  const [ratio, setRatio] = useState(NaN);
  const storeSlippage = async (slippage) => {
    await setSlippage(slippage);
    await localStorage.setItem("slippage", slippage);
  };

  useEffect(() => {
    pairReserve
      ? setRatio(pairReserve["token0"] / pairReserve["token1"])
      : setRatio(NaN);
  }, [pairReserve]);

  const fetchAllBalances = async () => {
    let count = 0;
    let endBracket = "";
    let tokenNames = Object.values(tokenData).reduce((accum, cumul) => {
      count++;
      endBracket += ")";
      let code = `
      (let
        ((${cumul.name}
          (try -1 (${cumul.code}.get-balance "${account.account.account}"))
      ))`;
      accum += code;
      return accum;
    }, "");
    let objFormat = `{${Object.keys(tokenData)
      .map((token) => `"${token}": ${token}`)
      .join(",")}}`;
    tokenNames = tokenNames + objFormat + endBracket;
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: tokenNames,
          meta: Pact.lang.mkMeta(
            "",
            chainId,
            GAS_PRICE,
            3000,
            creationTime(),
            600
          ),
        },
        network
      );
      if (data.result.status === "success") {
        Object.keys(tokenData).forEach((token) => {
          tokenData[token].balance =
            extractDecimal(data.result.data[token]) === -1
              ? "0"
              : extractDecimal(data.result.data[token]);
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
    let count = 0;
    let endBracket = "";
    let tokenNames = Object.values(tokenData).reduce((accum, cumul) => {
      count++;
      endBracket += ")";
      let code = `
      (let
        ((${cumul.name}
          (try -1 (${cumul.code}.precision))
      ))`;
      accum += code;
      return accum;
    }, "");
    let objFormat = `{${Object.keys(tokenData)
      .map((token) => `"${token}": ${token}`)
      .join(",")}}`;
    tokenNames = tokenNames + objFormat + endBracket;
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: tokenNames,
          meta: Pact.lang.mkMeta(
            "",
            chainId,
            GAS_PRICE,
            3000,
            creationTime(),
            600
          ),
        },
        network
      );
      if (data.result.status === "success") {
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

  const getTotalTokenSupply = async (token0, token1) => {
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: `(kswap.tokens.total-supply (kswap.exchange.get-pair-key ${token0} ${token1}))`,
          keyPairs: Pact.crypto.genKeyPair(),
          meta: Pact.lang.mkMeta(
            "",
            chainId,
            0.01,
            100000000,
            28800,
            creationTime()
          ),
        },
        network
      );
      if (data.result.status === "success") {
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
          pactCode: `(kswap.exchange.get-pair ${token0} ${token1})`,
          keyPairs: Pact.crypto.genKeyPair(),
          meta: Pact.lang.mkMeta(
            "",
            chainId,
            GAS_PRICE,
            3000,
            creationTime(),
            600
          ),
        },
        network
      );
      if (data.result.status === "success") {
        setPair(data.result.data);
        return data.result.data;
      } else {
        return null;
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
          (use kswap.exchange)
          (let*
            (
              (p (get-pair ${token0} ${token1}))
              (reserveA (reserve-for p ${token0}))
              (reserveB (reserve-for p ${token1}))
            )[reserveA reserveB])
           `,
          meta: Pact.lang.mkMeta(
            "account",
            chainId,
            GAS_PRICE,
            3000,
            creationTime(),
            600
          ),
        },
        network
      );
      if (data.result.status === "success") {
        await setPairReserve({
          token0: data.result.data[0].decimal
            ? data.result.data[0].decimal
            : data.result.data[0],
          token1: data.result.data[1].decimal
            ? data.result.data[1].decimal
            : data.result.data[1],
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
    await localStorage.setItem("ttl", ttl);
  };

  // UTILS

  const getRatio = (toToken, fromToken) => {
    if (toToken === fromToken) return 1;
    return pairReserve["token1"] / pairReserve["token0"];
  };

  const getRatio1 = (toToken, fromToken) => {
    if (toToken === fromToken) return 1;
    return pairReserve["token0"] / pairReserve["token1"];
  };

  //COMPUTE_OUT
  var computeOut = function (amountIn) {
    let reserveOut = Number(pairReserve["token1"]);
    let reserveIn = Number(pairReserve["token0"]);
    let numerator = Number(amountIn * (1 - FEE) * reserveOut);
    let denominator = Number(reserveIn + amountIn * (1 - FEE));
    return numerator / denominator;
  };

  //COMPUTE_IN
  var computeIn = function (amountOut) {
    let reserveOut = Number(pairReserve["token1"]);
    let reserveIn = Number(pairReserve["token0"]);
    let numerator = Number(reserveIn * amountOut);
    let denominator = Number((reserveOut - amountOut) * (1 - FEE));
    // round up the last digit
    return numerator / denominator;
  };

  function computePriceImpact(amountIn, amountOut) {
    const reserveOut = Number(pairReserve["token1"]);
    const reserveIn = Number(pairReserve["token0"]);
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
    totalSupply,
    getTotalTokenSupply,
    ratio,
    getRatio,
    getRatio1,
    pair,
    setPair,
    getPair,
    getReserves,
    computePriceImpact,
    priceImpactWithoutFee,
    computeOut,
    computeIn,
  };
  return (
    <PactContext.Provider value={contextValues}>
      {props.children}
    </PactContext.Provider>
  );
};

export const PactConsumer = PactContext.Consumer;
