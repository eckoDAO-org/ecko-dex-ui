import React, { useState } from "react";
import styled from "styled-components/macro";
import SwapButtonsForm from "../components/swap/SwapButtonsForm";
import SwapForm from "../components/swap/SwapForm";
import SwapResults from "../components/swap/SwapResults";
import theme from "../styles/theme";

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

  // ----------------------------------------------------------------------
  //                            ADD USEEFFECT
  // ----------------------------------------------------------------------

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
      />
      {/* {!isNaN(pact.ratio) &&
      fromValues.amount &&
      fromValues.coin &&
      toValues.amount &&
      toValues.coin ? ( RESULT CONTAINER) : <></> */}
      <SwapResults
        priceImpact={priceImpact}
        fromValues={fromValues}
        toValues={toValues}
      />
      <SwapButtonsForm
        setLoading={setLoading}
        fromValues={fromValues}
        setFromValues={setFromValues}
        toValues={toValues}
        setToValues={setToValues}
        fromNote={fromNote}
      />
    </Container>
  );
};

export default SwapContainer;
