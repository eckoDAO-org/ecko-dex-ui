import React, { createContext, useState } from "react";

export const PactContext = createContext();

const savedSlippage = localStorage.getItem("slippage");
const savedTtl = localStorage.getItem("ttl");

export const PactProvider = (props) => {
  const [slippage, setSlippage] = useState(
    savedSlippage ? savedSlippage : 0.05
  );
  const [ttl, setTtl] = useState(savedTtl ? savedTtl : 600);

  const storeSlippage = async (slippage) => {
    await setSlippage(slippage);
    await localStorage.setItem("slippage", slippage);
  };

  const storeTtl = async (ttl) => {
    await setTtl(slippage);
    await localStorage.setItem("ttl", ttl);
  };

  const contextValues = {
    slippage,
    setSlippage,
    storeSlippage,
    ttl,
    setTtl,
    storeTtl,
  };
  return (
    <PactContext.Provider value={contextValues}>
      {props.children}
    </PactContext.Provider>
  );
};

export const PactConsumer = PactContext.Consumer;
