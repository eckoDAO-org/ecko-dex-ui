import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components/macro";
import { ReactComponent as PlusIcon } from "../../assets/images/shared/plus.svg";
import ModalContainer from "../../components/shared/ModalContainer";
import FormContainer from "../../components/shared/FormContainer";
import Input from "../../components/shared/Input";
import InputToken from "../../components/shared/InputToken";
import ButtonDivider from "../../components/shared/ButtonDivider";
import MyButton from "../../components/shared/Button";
import TokenSelector from "../../components/shared/TokenSelector";
import { throttle, debounce } from "throttle-debounce";
import { PactContext } from "../../contexts/PactContext";
import { ReactComponent as LeftIcon } from "../../assets/images/shared/left-arrow.svg";
import { reduceBalance, limitDecimalPlaces } from "../../utils/reduceBalance";
import TxView from "../../components/shared/TxView";
import ReviewTx from "./ReviewTx";
import { ReactComponent as ArrowBack } from "../../assets/images/shared/arrow-back.svg";
import { ReactComponent as SwapArrowsIcon } from "../../assets/images/shared/swap-token-arrow.svg";
import { Grid } from "semantic-ui-react";
import WalletRequestView from "../../components/shared/WalletRequestView";
import walletError from "../../components/alerts/walletError";
import ReviewTxModal from "../../components/shared/ReviewTxModal";
import { Button } from "semantic-ui-react";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  width: 100%;
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;

  & > span:first-child {
    font-size: 14px;
    margin-bottom: 3px;
  }

  & > span:last-child {
    font-size: 12px;
    color: #b5b5b5;
  }
`;

const InfoContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: row;
  padding: 20px 20px;
  width: 100%;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
`;

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0px;
  flex-flow: row;
  width: 100%;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
`;

const InnerRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: column;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: row;
  }
`;

const Label = styled.span`
  font: normal normal normal 14px/15px montserrat-regular;
  color: #ffffff;
  text-transform: capitalize;
`;

const Value = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
`;

const LiquidityContainer = (props) => {
  const pact = useContext(PactContext);
  const { selectedView, setSelectedView } = props;
  const [tokenSelectorType, setTokenSelectorType] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [inputSide, setInputSide] = useState("");
  const [fromValues, setFromValues] = useState({
    coin: "",
    account: null,
    guard: null,
    balance: null,
    amount: "",
    precision: 0,
  });
  const [toValues, setToValues] = useState({
    coin: "",
    account: null,
    guard: null,
    balance: null,
    amount: "",
    precision: 0,
  });
  const [pairExist, setPairExist] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showTxModal === false) {
      setFromValues({
        coin: "",
        account: null,
        guard: null,
        balance: null,
        amount: "",
      });
      setToValues({
        coin: "",
        account: null,
        guard: null,
        balance: null,
        amount: "",
      });
    }
  }, [showTxModal]);

  useEffect(async () => {
    if (tokenSelectorType === "from") setSelectedToken(fromValues.coin);
    if (tokenSelectorType === "to") setSelectedToken(toValues.coin);
    else setSelectedToken(null);
  }, [tokenSelectorType]);

  useEffect(async () => {
    if (fromValues.coin !== "") {
      await pact.getTokenAccount(
        pact.tokenData[fromValues.coin].code,
        pact.account.account,
        true
      );
    }
    if (toValues.coin !== "") {
      await pact.getTokenAccount(
        pact.tokenData[toValues.coin].code,
        pact.account.account,
        false
      );
    }
    if (fromValues.coin !== "" && toValues.coin !== "") {
      await pact.getPair(
        pact.tokenData[fromValues.coin].code,
        pact.tokenData[toValues.coin].code
      );
      await pact.getReserves(
        pact.tokenData[fromValues.coin].code,
        pact.tokenData[toValues.coin].code
      );
      if (pact.pair) {
        setPairExist(true);
      }
    }
  }, [fromValues, toValues, pairExist, pact.account.account]);

  const onTokenClick = async ({ crypto }) => {
    let balance;
    if (crypto.code === "coin") {
      if (pact.account) {
        balance = pact.account.balance;
      }
    } else {
      let acct = await pact.getTokenAccount(
        crypto.code,
        pact.account.account,
        tokenSelectorType === "from"
      );
      if (acct) {
        balance = pact.getCorrectBalance(acct.balance);
      }
    }
    if (tokenSelectorType === "from")
      setFromValues((prev) => ({
        ...prev,
        balance: balance,
        coin: crypto.name,
        precision: crypto.precision,
      }));
    if (tokenSelectorType === "to")
      setToValues((prev) => ({
        ...prev,
        balance: balance,
        coin: crypto.name,
        precision: crypto.precision,
      }));
  };

  const onWalletRequestViewModalClose = () => {
    pact.setIsWaitingForWalletAuth(false);
    pact.setWalletError(null);
  };

  useEffect(() => {
    if (inputSide === "from" && fromValues.amount !== "") {
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
                fromValues.amount / pact.ratio,
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
                fromValues.amount / pact.ratio,
                fromValues.precision
              ),
            })
          );
        }
      }
    }
    if (isNaN(pact.ratio) || fromValues.amount === "") {
      if (selectedView === "Add Liquidity") {
        setToValues((prev) => ({ ...prev, amount: "" }));
      }
    }
  }, [fromValues.amount]);

  useEffect(() => {
    if (inputSide === "to" && toValues.amount !== "") {
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
                toValues.amount * pact.ratio,
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
                toValues.amount * pact.ratio,
                toValues.precision
              ),
            })
          );
        }
      }
    }
    if (isNaN(pact.ratio) || toValues.amount === "") {
      if (selectedView === "Add Liquidity") {
        setFromValues((prev) => ({ ...prev, amount: "" }));
      }
    }
  }, [toValues.amount]);

  useEffect(() => {
    if (pact.walletSuccess) {
      setLoading(false);
      setFromValues({
        coin: "",
        account: null,
        guard: null,
        balance: null,
        amount: "",
        precision: 0,
      });
      setToValues({
        coin: "",
        account: null,
        guard: null,
        balance: null,
        amount: "",
        precision: 0,
      });
      pact.setWalletSuccess(false);
    }
  }, [pact.walletSuccess]);

  const buttonStatus = () => {
    let status = {
      0: { msg: "Connect your KDA wallet", status: false },
      1: { msg: "Enter An Amount", status: false },
      2: { msg: "Supply", status: true },
      3: { msg: (token) => `Insufficient ${token} Balance`, status: false },
      4: { msg: "Pair does not exist yet", status: false },
      5: { msg: "Pair Already Exists", status: false },
      6: { msg: "Select different tokens", status: false },
    };
    if (!pact.account.account) return status[0];
    if (selectedView === "Create A Pair") {
      if (pairExist) {
        setSelectedView("Add Liquidity");
      } else return status[4];
      // if (fromValues.coin!=="" && toValues.coin!=="" && fromValues.amount && toValues.amount){
      //   return status[4];
      // }
      // else if (!fromValues.amount || !toValues.amount) return status[1];
      // else if (Number(fromValues.amount) > Number(fromValues.balance)) return {...status[3], msg: status[3].msg(fromValues.coin)};
      // else if (Number(toValues.amount) > Number(toValues.balance)) return {...status[3], msg: status[3].msg(toValues.coin)};
      // else if (fromValues.coin === toValues.coin) return status[6];
      // else return status[4]
    } else if (isNaN(pact.ratio)) {
      return status[4];
      // return {...status[2], status: false};
    } else if (!fromValues.amount || !toValues.amount) return status[1];
    else if (Number(fromValues.amount) > Number(fromValues.balance))
      return { ...status[3], msg: status[3].msg(fromValues.coin) };
    else if (Number(toValues.amount) > Number(toValues.balance))
      return { ...status[3], msg: status[3].msg(toValues.coin) };
    else if (fromValues.coin === toValues.coin) return status[6];
    else {
      if (isNaN(pact.ratio)) {
        return status[4];
        // return {...status[2], status: false};
      } else return status[2];
    }
  };

  const supply = async () => {
    if (selectedView === "Create A Pair") {
      if (pact.signing.method !== "sign") {
        setLoading(true);
        const res = await pact.createTokenPairLocal(
          pact.tokenData[fromValues.coin],
          pact.tokenData[toValues.coin],
          fromValues.amount,
          toValues.amount
        );
        if (res === -1) {
          setLoading(false);
          alert(
            "Incorrect password. If forgotten, you can reset it with your private key"
          );
          return;
        } else {
          setShowReview(false);
          setShowTxModal(true);
          setLoading(false);
        }
      } else {
        console.log("not signed");
      }
    } else {
      if (pact.signing.method !== "sign" && pact.signing.method !== "none") {
        setLoading(true);
        const res = await pact.addLiquidityLocal(
          pact.tokenData[fromValues.coin],
          pact.tokenData[toValues.coin],
          fromValues.amount,
          toValues.amount
        );
        if (res === -1) {
          setLoading(false);
          alert(
            "Incorrect password. If forgotten, you can reset it with your private key"
          );
          return;
        } else {
          setShowReview(false);
          setShowTxModal(true);
          setLoading(false);
        }
      } else {
        setLoading(true);
        setShowReview(false);
        console.log(
          "param,",
          pact.tokenData[fromValues.coin],
          pact.tokenData[toValues.coin],
          fromValues.amount,
          toValues.amount
        );
        const res = await pact.addLiquidityWallet(
          pact.tokenData[fromValues.coin],
          pact.tokenData[toValues.coin],
          fromValues.amount,
          toValues.amount
        );
        if (!res) {
          pact.setIsWaitingForWalletAuth(true);
          /* pact.setWalletError(true); */
          /* walletError(); */
        } else {
          pact.setWalletError(null);
          setSelectedView("Add Liquidity");
          setShowTxModal(true);
        }
        /* setShowTxModal(true) */
        setLoading(false);
        setFromValues({
          account: null,
          guard: null,
          balance: null,
          amount: "",
          coin: "",
        });
        setToValues({
          account: null,
          guard: null,
          balance: null,
          amount: "",
          coin: "",
        });
      }
    }
  };

  const swapValues = () => {
    const from = { ...fromValues };
    const to = { ...toValues };
    setFromValues({ ...to });
    setToValues({ ...from });
  };

  return (
    <Container>
      <TokenSelector
        show={tokenSelectorType !== null}
        selectedToken={selectedToken}
        onTokenClick={onTokenClick}
        fromToken={fromValues.coin}
        toToken={toValues.coin}
        onClose={() => setTokenSelectorType(null)}
      />
      <TxView
        view={selectedView}
        show={showTxModal}
        token0={fromValues.coin}
        token1={toValues.coin}
        fromToken={fromValues.coin}
        toToken={toValues.coin}
        createTokenPair={() =>
          pact.createTokenPairLocal(
            pact.tokenData[fromValues.coin].name,
            pact.tokenData[toValues.coin].name,
            fromValues.amount,
            toValues.amount
          )
        }
        onClose={() => setShowTxModal(false)}
      />
      <WalletRequestView
        show={pact.isWaitingForWalletAuth}
        error={pact.walletError}
        onClose={() => onWalletRequestViewModalClose()}
      />
      <ReviewTxModal
        onClose={() => setShowReview(false)}
        fromValues={fromValues}
        toValues={toValues}
        supply={supply}
        loading={loading}
        show={showReview}
        liquidityView={selectedView}
      />

      <TitleContainer>
        <Title style={{ fontFamily: "montserrat-bold" }}>
          <ArrowBack
            style={{
              cursor: "pointer",
              color: "#FFFFFF",
              marginRight: "15px",
              justifyContent: "center",
            }}
            onClick={() => props.closeLiquidity()}
          />
          Add Liquidity
        </Title>
      </TitleContainer>

      <FormContainer>
        <Input
          topLeftLabel="input"
          bottomLeftLabel={`balance: ${
            reduceBalance(fromValues.balance) ?? "-"
          }`}
          placeholder="enter amount"
          inputRightComponent={
            fromValues.coin ? (
              <InputToken
                icon={pact.tokenData[fromValues.coin].icon}
                code={pact.tokenData[fromValues.coin].name}
                onClick={() => setTokenSelectorType("from")}
              />
            ) : null
          }
          withSelectButton
          numberOnly
          value={fromValues.amount}
          onSelectButtonClick={() => setTokenSelectorType("from")}
          onChange={async (e, { value }) => {
            setInputSide("from");
            setFromValues((prev) => ({
              ...prev,
              amount: limitDecimalPlaces(value, fromValues.precision),
            }));
          }}
          error={isNaN(fromValues.amount)}
        />
        <ButtonDivider icon={<SwapArrowsIcon />} onClick={swapValues} />
        <Input
          topLeftLabel="input"
          bottomLeftLabel={`balance: ${reduceBalance(toValues.balance) ?? "-"}`}
          placeholder="enter amount"
          inputRightComponent={
            toValues.coin ? (
              <InputToken
                icon={pact.tokenData[toValues.coin].icon}
                code={pact.tokenData[toValues.coin].name}
                onClick={() => setTokenSelectorType("to")}
              />
            ) : null
          }
          withSelectButton
          numberOnly
          value={toValues.amount}
          onSelectButtonClick={() => setTokenSelectorType("to")}
          onChange={async (e, { value }) => {
            setInputSide("to");
            setToValues((prev) => ({
              ...prev,
              amount: limitDecimalPlaces(value, toValues.precision),
            }));
          }}
          error={isNaN(toValues.amount)}
        />
      </FormContainer>

      {fromValues.coin && toValues.coin && (
        <>
          <ResultContainer>
            <InnerRowContainer>
              <Label>{`${toValues.coin} per ${fromValues.coin}`}</Label>
              <Value>
                {reduceBalance(pact.getRatio(toValues.coin, fromValues.coin)) ??
                  "-"}
              </Value>
            </InnerRowContainer>
            <InnerRowContainer>
              <Label>{`${fromValues.coin} per ${toValues.coin}`}</Label>
              <Value>
                {reduceBalance(
                  pact.getRatio1(toValues.coin, fromValues.coin)
                ) ?? "-"}
              </Value>
            </InnerRowContainer>
            <InnerRowContainer>
              <Label>Share of Pool</Label>
              <Value>
                {!pact.share(fromValues.amount)
                  ? 0
                  : reduceBalance(pact.share(fromValues.amount) * 100)}
                %
              </Value>
            </InnerRowContainer>
          </ResultContainer>
        </>
      )}
      <ButtonContainer>
        <Button.Group>
          <MyButton
            disabled={!buttonStatus().status}
            onClick={() => setShowReview(true)}
          >
            {buttonStatus().msg}
          </MyButton>
        </Button.Group>
        {/* <ReviewTx
          fromValues={fromValues}
          toValues={toValues}
          buttonStatus={buttonStatus}
          liquidityView={selectedView}
          supply={supply}
          loading={loading}
          open={showReview}
          setOpen={setShowReview}
        /> */}
      </ButtonContainer>
    </Container>
  );
};

export default LiquidityContainer;
