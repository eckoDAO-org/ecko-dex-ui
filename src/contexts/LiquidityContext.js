import React, { useState, useContext } from "react";
import pairTokens from "../constants/pairs.json";
import Pact from "pact-lang-api";

export const LiquidityContext = React.createContext(null);

export const LiquidityProvider = (props) => {
  const [liquidityProviderFee, setLiquidityProviderFee] = useState(0.003);
  const [pairList, setPairList] = useState(pairTokens);
  const [pairListAccount, setPairListAccount] = useState(pairTokens);

  const contextValue = {};

  return (
    <LiquidityProvider.Provider value={contextValue}>
      {props.children}
    </LiquidityProvider.Provider>
  );
};
