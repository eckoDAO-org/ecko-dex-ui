import React, { useState, createContext } from "react";

export const SwapContext = createContext();

export const SwapProvider = (props) => {
  return (
    <SwapContext.Provider value={{}}>{props.children}</SwapContext.Provider>
  );
};

export const SwapConsumer = SwapContext.Consumer;
