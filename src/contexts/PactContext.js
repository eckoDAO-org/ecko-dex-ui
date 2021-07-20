import React, { createContext, useEffect, useState } from "react";

export const PactContext = createContext();

const savedSlippage = localStorage.getItem("slippage");
const savedTtl = localStorage.getItem("ttl");

export const PactProvider = (props) => {
  const [slippage, setSlippage] = useState(
    savedSlippage ? savedSlippage : 0.05
  );
  const [ttl, setTtl] = useState(savedTtl ? savedTtl : 600);
  const [pairReserve, setPairReserve] = useState("");
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

  const storeTtl = async (ttl) => {
    await setTtl(slippage);
    await localStorage.setItem("ttl", ttl);
  };

  const getRatio = (toToken, fromToken) => {
    if (toToken === fromToken) return 1;
    return pairReserve["token1"] / pairReserve["token0"];
  };

  const getRatio1 = (toToken, fromToken) => {
    if (toToken === fromToken) return 1;
    return pairReserve["token0"] / pairReserve["token1"];
  };

  const contextValues = {
    slippage,
    setSlippage,
    storeSlippage,
    ttl,
    setTtl,
    storeTtl,
    getRatio,
    getRatio1,
  };
  return (
    <PactContext.Provider value={contextValues}>
      {props.children}
    </PactContext.Provider>
  );
};

export const PactConsumer = PactContext.Consumer;
