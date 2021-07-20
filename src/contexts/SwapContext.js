import React, { useState, createContext, useContext } from "react";
import Pact from "pact-lang-api";
import tokenData from "../constants/cryptoCurrencies";
import pwPrompt from "../components/alerts/pwPrompt";
import { AccountContext } from "./AccountContext";
import { WalletContext } from "./WalletContext";
import { reduceBalance } from "../utils/reduceBalance";
import { PactContext } from "./PactContext";
import { decryptKey } from "../utils/keyUtils";

export const SwapContext = createContext();

const creationTime = () => Math.round(new Date().getTime() / 1000) - 10;
const NETWORKID = process.env.REACT_APP_KDA_NETWORK_ID || "testnet04";
const GAS_PRICE = 0.000000000001;
const chainId = process.env.REACT_APP_KDA_CHAIN_ID || "0";
const network =
  process.env.REACT_APP_KDA_NETWORK ||
  `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORKID}/chain/${chainId}/pact`;

export const SwapProvider = (props) => {
  const pact = useContext(PactContext);
  const account = useContext(AccountContext);
  const wallet = useContext(WalletContext);
  const [pairAccount, setPairAccount] = useState("");
  const [cmd, setCmd] = useState(null);
  const [localRes, setLocalRes] = useState(null);

  const getPairAccount = async (token0, token1) => {
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: `(at 'account (kswap.exchange.get-pair ${token0} ${token1}))`,
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
        setPairAccount(data.result.data);
        return data.result.data;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const swap = async (token0, token1, isSwapIn) => {
    try {
      let pair = await getPairAccount(token0.address, token1.address);

      const inPactCode = `(kswap.exchange.swap-exact-in
          (read-decimal 'token0Amount)
          (read-decimal 'token1AmountWithSlippage)
          [${token0.address} ${token1.address}]
          ${JSON.stringify(account.account)}
          ${JSON.stringify(account.account)}
          (read-keyset 'user-ks)
        )`;
      const outPactCode = `(kswap.exchange.swap-exact-out
          (read-decimal 'token1Amount)
          (read-decimal 'token0AmountWithSlippage)
          [${token0.address} ${token1.address}]
          ${JSON.stringify(account.account)}
          ${JSON.stringify(account.account)}
          (read-keyset 'user-ks)
        )`;
      const cmd = {
        pactCode: isSwapIn ? inPactCode : outPactCode,
        keyPairs: {
          publicKey: account.guard.keys[0],
          secretKey: wallet.privKey,
          clist: [
            {
              name: `${token0.address}.TRANSFER`,
              args: [
                account.account,
                pair,
                isSwapIn
                  ? reduceBalance(
                      token0.amount,
                      tokenData[token0.coin].precision
                    )
                  : reduceBalance(
                      token0.amount * (1 + parseFloat(pact.slippage)),
                      tokenData[token0.coin].precision
                    ),
              ],
            },
          ],
        },
        envData: {
          "user-ks": account.guard,
          token0Amount: reduceBalance(
            token0.amount,
            tokenData[token0.coin].precision
          ),
          token1Amount: reduceBalance(
            token1.amount,
            tokenData[token1.coin].precision
          ),
          token1AmountWithSlippage: reduceBalance(
            token1.amount * (1 - parseFloat(pact.slippage)),
            tokenData[token1.coin].precision
          ),
          token0AmountWithSlippage: reduceBalance(
            token0.amount * (1 + parseFloat(pact.slippage)),
            tokenData[token0.coin].precision
          ),
        },
        meta: Pact.lang.mkMeta("", "", 0, 0, 0, 0),
        networkId: NETWORKID,
        meta: Pact.lang.mkMeta(
          account.account,
          chainId,
          GAS_PRICE,
          3000,
          creationTime(),
          600
        ),
      };
      setCmd(cmd);
      let data = await Pact.fetch.send(cmd, network);
    } catch (e) {
      console.log(e);
    }
  };

  const swapLocal = async (token0, token1, isSwapIn) => {
    try {
      let privKey = wallet.signing.key;
      if (wallet.signing.method === "pk+pw") {
        const pw = await pwPrompt();
        privKey = await decryptKey(pw);
      }
      if (privKey.length !== 64) {
        return -1;
      }
      const ct = creationTime();
      let pair = await getPairAccount(token0.address, token1.address);
      const inPactCode = `(kswap.exchange.swap-exact-in
          (read-decimal 'token0Amount)
          (read-decimal 'token1AmountWithSlippage)
          [${token0.address} ${token1.address}]
          ${JSON.stringify(account.account)}
          ${JSON.stringify(account.account)}
          (read-keyset 'user-ks)
        )`;
      const outPactCode = `(kswap.exchange.swap-exact-out
          (read-decimal 'token1Amount)
          (read-decimal 'token0AmountWithSlippage)
          [${token0.address} ${token1.address}]
          ${JSON.stringify(account.account)}
          ${JSON.stringify(account.account)}
          (read-keyset 'user-ks)
        )`;
      const cmd = {
        pactCode: isSwapIn ? inPactCode : outPactCode,
        keyPairs: {
          publicKey: account.guard.keys[0],
          secretKey: privKey,
          clist: [
            {
              name: "kswap.gas-station.GAS_PAYER",
              args: ["free-gas", { int: 1 }, 1.0],
            },
            {
              name: `${token0.address}.TRANSFER`,
              args: [
                account.account,
                pair,
                isSwapIn
                  ? reduceBalance(
                      token0.amount,
                      tokenData[token0.coin].precision
                    )
                  : reduceBalance(
                      token0.amount * (1 + parseFloat(pact.slippage)),
                      tokenData[token0.coin].precision
                    ),
              ],
            },
          ],
        },
        envData: {
          "user-ks": account.guard,
          token0Amount: reduceBalance(
            token0.amount,
            tokenData[token0.coin].precision
          ),
          token1Amount: reduceBalance(
            token1.amount,
            tokenData[token1.coin].precision
          ),
          token1AmountWithSlippage: reduceBalance(
            token1.amount * (1 - parseFloat(pact.slippage)),
            tokenData[token1.coin].precision
          ),
          token0AmountWithSlippage: reduceBalance(
            token0.amount * (1 + parseFloat(pact.slippage)),
            tokenData[token0.coin].precision
          ),
        },
        networkId: NETWORKID,
        meta: Pact.lang.mkMeta(
          "kswap-free-gas",
          chainId,
          GAS_PRICE,
          3000,
          ct,
          600
        ),
      };
      setCmd(cmd);
      let data = await Pact.fetch.local(cmd, network);
      setLocalRes(data);
      return data;
    } catch (e) {
      console.log(e);
      setLocalRes({});
      return -1;
    }
  };
  return (
    <SwapContext.Provider value={{ swap, getPairAccount, swapLocal }}>
      {props.children}
    </SwapContext.Provider>
  );
};

export const SwapConsumer = SwapContext.Consumer;
