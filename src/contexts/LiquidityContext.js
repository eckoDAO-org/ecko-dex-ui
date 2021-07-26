import React, { useState, useContext, createContext } from "react";
import pairTokens from "../constants/pairs.json";
import Pact from "pact-lang-api";
import { PactContext } from "./PactContext";
import {
  chainId,
  creationTime,
  GAS_PRICE,
  network,
} from "../constants/contextConstants";

export const LiquidityContext = createContext(null);

export const LiquidityProvider = (props) => {
  const pact = useContext(PactContext);
  const [liquidityProviderFee, setLiquidityProviderFee] = useState(0.003);
  const [pairListAccount, setPairListAccount] = useState(pairTokens);

  const getPairListAccountBalance = async (account) => {
    try {
      const tokenPairList = Object.keys(pact.pairList).reduce((accum, pair) => {
        accum += `[${pair.split(":").join(" ")}] `;
        return accum;
      }, "");
      let data = await Pact.fetch.local(
        {
          pactCode: `
            (namespace 'free)

            (module kswap-read G

              (defcap G ()
                true)

              (defun pair-info (pairList:list)
                (let* (
                  (token0 (at 0 pairList))
                  (token1 (at 1 pairList))
                  (p (kswap.exchange.get-pair token0 token1))
                  (reserveA (kswap.exchange.reserve-for p token0))
                  (reserveB (kswap.exchange.reserve-for p token1))
                  (totalBal (kswap.tokens.total-supply (kswap.exchange.get-pair-key token0 token1)))
                  (acctBal
                      (try 0.0 (kswap.tokens.get-balance (kswap.exchange.get-pair-key token0 token1) ${JSON.stringify(
                        account
                      )})
                    ))
                )
                [(kswap.exchange.get-pair-key token0 token1)
                 reserveA
                 reserveB
                 totalBal
                 acctBal
                 (* reserveA (/ acctBal totalBal))
                 (* reserveB (/ acctBal totalBal))
               ]
              ))
            )
            (map (kswap-read.pair-info) [${tokenPairList}])
             `,
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
        let dataList = data.result.data.reduce((accum, data) => {
          accum[data[0]] = {
            balance: data[4],
            supply: data[3],
            reserves: [data[1], data[2]],
            pooledAmount: [data[5], data[6]],
          };
          return accum;
        }, {});
        const pairList = Object.values(pairTokens).map((pair) => {
          return {
            ...pair,
            ...dataList[pair.name],
          };
        });
        setPairListAccount(pairList);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const contextValue = {
    liquidityProviderFee,
    setLiquidityProviderFee,
    pairListAccount,
    setPairListAccount,
    getPairListAccountBalance,
  };

  return (
    <LiquidityContext.Provider value={contextValue}>
      {props.children}
    </LiquidityContext.Provider>
  );
};

export const LiquidityConsumer = LiquidityContext.Consumer;
