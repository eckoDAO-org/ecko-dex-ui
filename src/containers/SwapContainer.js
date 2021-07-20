import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { throttle, debounce } from "throttle-debounce";
import TokenSelector from "../components/swap/swap-modals/TokenSelector";
import SwapButtonsForm from "../components/swap/SwapButtonsForm";
import SwapForm from "../components/swap/SwapForm";
import SwapResults from "../components/swap/SwapResults";
import { AccountContext } from "../contexts/AccountContext";
import { ModalContext } from "../contexts/ModalContext";
import { PactContext } from "../contexts/PactContext";
import { SwapContext } from "../contexts/SwapContext";
import theme from "../styles/theme";
import { getCorrectBalance, reduceBalance } from "../utils/reduceBalance";

const Container = styled.div`
  width: 100%;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  width: 100%;
`;

const Title = styled.span`
  font: normal normal bold 32px/57px Montserrat;
  letter-spacing: 0px;
  color: #ffffff;
  text-transform: capitalize;
`;

const SwapContainer = () => {
  const pact = useContext(PactContext);
  const swap = useContext(SwapContext);
  const account = useContext(AccountContext);

  const [tokenSelectorType, setTokenSelectorType] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [fromValues, setFromValues] = useState({
    amount: "",
    balance: "",
    coin: "",
    address: "",
    precision: 0,
  });

  const [toValues, setToValues] = useState({
    amount: "",
    balance: "",
    coin: "",
    address: "",
    precision: 0,
  });
  const [inputSide, setInputSide] = useState("");
  const [fromNote, setFromNote] = useState("");
  const [toNote, setToNote] = useState("");
  const [showTxModal, setShowTxModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingPair, setFetchingPair] = useState(false);
  const [priceImpact, setPriceImpact] = useState("");

  useEffect(() => {
    if (!isNaN(fromValues.amount)) {
      if (inputSide === "from" && fromValues.amount !== "") {
        setToNote("(estimated)");
        setFromNote("");
        setInputSide(null);
        if (
          fromValues.coin !== "" &&
          toValues.coin !== "" &&
          !isNaN(pact.ratio)
        ) {
          if (fromValues.amount.length < 5) {
            throttle(
              500,
              setToValues({
                ...toValues,
                amount: reduceBalance(
                  pact.computeOut(fromValues.amount),
                  toValues.precision
                ),
              })
            );
          } else {
            debounce(
              500,
              setToValues({
                ...toValues,
                amount: reduceBalance(
                  pact.computeOut(fromValues.amount),
                  toValues.precision
                ),
              })
            );
          }
        }
      }
      if (isNaN(pact.ratio) || fromValues.amount === "") {
        setToValues((prev) => ({ ...prev, amount: "" }));
      }
    }
  }, [fromValues.amount]);

  useEffect(() => {
    if (!isNaN(toValues.amount)) {
      if (inputSide === "to" && toValues.amount !== "") {
        setFromNote("(estimated)");
        setToNote("");
        setInputSide(null);
        if (
          fromValues.coin !== "" &&
          toValues.coin !== "" &&
          !isNaN(pact.ratio)
        ) {
          if (toValues.amount.length < 5) {
            throttle(
              500,
              setFromValues({
                ...fromValues,
                amount: reduceBalance(
                  pact.computeIn(toValues.amount),
                  fromValues.precision
                ),
              })
            );
          } else {
            debounce(
              500,
              setFromValues({
                ...fromValues,
                amount: reduceBalance(
                  pact.computeIn(toValues.amount),
                  fromValues.precision
                ),
              })
            );
          }
        }
      }
      if (isNaN(pact.ratio) || toValues.amount === "") {
        setFromValues((prev) => ({ ...prev, amount: "" }));
      }
    }
  }, [toValues.amount]);

  useEffect(() => {
    if (!isNaN(pact.ratio)) {
      if (fromValues.amount !== "" && toValues.amount === "") {
        setToValues({
          ...toValues,
          amount: reduceBalance(
            pact.computeOut(fromValues.amount),
            toValues.precision
          ),
        });
      }
      if (fromValues.amount === "" && toValues.amount !== "") {
        setFromValues({
          ...fromValues,
          amount: reduceBalance(
            pact.computeIn(toValues.amount),
            fromValues.precision
          ),
        });
      }
      if (fromValues.amount !== "" && toValues.amount !== "") {
        setToValues({
          ...toValues,
          amount: reduceBalance(
            pact.computeOut(fromValues.amount),
            toValues.precision
          ),
        });
      }
    }
  }, [pact.ratio]);

  useEffect(() => {
    if (!isNaN(pact.ratio)) {
      setPriceImpact(
        pact.computePriceImpact(
          Number(fromValues.amount),
          Number(toValues.amount)
        )
      );
    } else {
      setPriceImpact("");
    }
  }, [
    fromValues.coin,
    toValues.coin,
    fromValues.amount,
    toValues.amount,
    pact.ratio,
  ]);

  useEffect(() => {
    if (tokenSelectorType === "from") return setSelectedToken(fromValues.coin);
    if (tokenSelectorType === "to") return setSelectedToken(toValues.coin);
    return setSelectedToken(null);
  }, [tokenSelectorType]);

  useEffect(() => {
    const getReserves = async () => {
      if (toValues.coin !== "" && fromValues.coin !== "") {
        setFetchingPair(true);
        await pact.getPair(fromValues.address, toValues.address);
        await pact.getReserves(fromValues.address, toValues.address);
        setFetchingPair(false);
      }
    };
    getReserves();
  }, [fromValues.coin, toValues.coin]);

  useEffect(() => {
    if (swap.walletSuccess) {
      setLoading(false);
      setFromValues({ amount: "", balance: "", coin: "", address: "" });
      setToValues({ amount: "", balance: "", coin: "", address: "" });
      pact.setWalletSuccess(false);
    }
  }, [swap.walletSuccess]);

  const swapValues = () => {
    const from = { ...fromValues };
    const to = { ...toValues };
    setFromValues({ ...to });
    setToValues({ ...from });
    if (toNote === "(estimated)") {
      setFromNote("(estimated)");
      setToNote("");
    }
    if (fromNote === "(estimated)") {
      setToNote("(estimated)");
      setFromNote("");
    }
  };

  const onTokenClick = async ({ crypto }) => {
    let balance;
    if (crypto.code === "coin") {
      if (account.account) {
        balance = account.account.balance;
      }
    } else {
      let acct = await account.getTokenAccount(
        crypto.code,
        account.account.account,
        tokenSelectorType === "from"
      );
      if (acct) {
        balance = getCorrectBalance(acct.balance);
      }
    }
    if (tokenSelectorType === "from")
      setFromValues((prev) => ({
        ...prev,
        balance: balance,
        coin: crypto.name,
        address: crypto.code,
        precision: crypto.precision,
      }));
    if (tokenSelectorType === "to")
      setToValues((prev) => ({
        ...prev,
        balance: balance,
        coin: crypto.name,
        address: crypto.code,
        precision: crypto.precision,
      }));
  };

  const onWalletRequestViewModalClose = () => {
    swap.setIsWaitingForWalletAuth(false);
    swap.setWalletError(null);
  };

  // ADD TXVIEW AND WALLETREQUESTVIEW MODALS

  // useEffect(() => {
  //   if (tokenSelectorType !== "")
  //     modalContext.openModal({
  //       id: "TOKEN_SELECTOR",
  //       title: "select a token",
  //       content: (
  //         <TokenSelector
  //           selectedToken={selectedToken}
  //           onTokenClick={onTokenClick}
  //           fromToken={fromValues.coin}
  //           toToken={toValues.coin}
  //           onClose={modalContext.closeModal()}
  //         />
  //       ),
  //     });
  // }, [tokenSelectorType]);

  //  modalContext.openModal({
  //    id: "ZELCORE",
  //    title: "connect wallet",
  //    description: "Zelcore Signing (Safest)",
  //    onBack: () => modalContext.onBackModal(),
  //    content: (
  //      <ConnectWalletZelcoreModal
  //        onClose={modalContext.closeModal()}
  //        onBack={() => modalContext.onBackModal()}
  //      />
  //    ),
  //  });

  return (
    <Container>
      <TitleContainer>
        <Title style={{ fontFamily: theme.fontFamily.bold }}>Swap</Title>
      </TitleContainer>
      <SwapForm
        fromValues={fromValues}
        setFromValues={setFromValues}
        toValues={toValues}
        setToValues={setToValues}
        fromNote={fromNote}
        toNote={toNote}
        setTokenSelectorType={setTokenSelectorType}
        setInputSide={setInputSide}
        swapValues={swapValues}
        selectedToken={selectedToken}
        onTokenClick={onTokenClick}
      />
      {!isNaN(pact.ratio) &&
      fromValues.amount &&
      fromValues.coin &&
      toValues.amount &&
      toValues.coin ? (
        <SwapResults
          priceImpact={priceImpact}
          fromValues={fromValues}
          toValues={toValues}
        />
      ) : (
        <></>
      )}

      <SwapButtonsForm
        setLoading={setLoading}
        fetchingPair={fetchingPair}
        fromValues={fromValues}
        setFromValues={setFromValues}
        toValues={toValues}
        setToValues={setToValues}
        fromNote={fromNote}
        ratio={pact.ratio}
      />
    </Container>
  );
};

export default SwapContainer;
