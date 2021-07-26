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
import {
  reduceBalance,
  extractDecimal,
  limitDecimalPlaces,
} from "../../utils/reduceBalance";
import TxView from "../../components/shared/TxView";
import ReviewTx from "./ReviewTx";
import { ReactComponent as ArrowBack } from "../../assets/images/shared/arrow-back.svg";
import { ReactComponent as SwapArrowsIcon } from "../../assets/images/shared/swap-arrow.svg";
import { Button } from "semantic-ui-react";
import WalletRequestView from "../../components/shared/WalletRequestView";
import theme from "../../styles/theme";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  width: 100%;
`;

const SubContainer = styled.div`
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

const MyButtonDivider = styled.div`
  width: 2%;
  height: auto;
  display: inline-block;
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
    margin-bottom: 5px;
    flex-flow: row;
  }
`;

const Label = styled.span`
  font: normal normal normal 14px/15px ${theme.fontFamily.regular};
  color: #ffffff;
  text-transform: capitalize;
`;

const Value = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
`;

const RemoveLiqContainer = (props) => {
  const pact = useContext(PactContext);
  const liquidityView = props.selectedView;
  const { name, token0, token1, balance, supply, pooledAmount } = props.pair;

  const [amount, setAmount] = useState(100);
  const [showTxModal, setShowTxModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pooled, setPooled] = useState(balance);
  const [pooledToken0, setPooledToken0] = useState(
    reduceBalance(pooledAmount[0], 12)
  );
  const [pooledToken1, setPooledToken1] = useState(
    reduceBalance(pooledAmount[1], 12)
  );

  useEffect(() => {
    if (!isNaN(amount)) {
      setPooled(
        reduceBalance((extractDecimal(balance) * amount) / 100, pact.PRECISION)
      );
      setPooledToken0(
        reduceBalance(
          (extractDecimal(pooledAmount[0]) * amount) / 100,
          pact.PRECISION
        )
      );
      setPooledToken1(
        reduceBalance(
          (extractDecimal(pooledAmount[1]) * amount) / 100,
          pact.PRECISION
        )
      );
    }
  }, [amount]);

  useEffect(() => {
    if (pact.walletSuccess) {
      setLoading(false);
      pact.setWalletSuccess(false);
    }
  }, [pact.walletSuccess]);

  const onWalletRequestViewModalClose = () => {
    pact.setIsWaitingForWalletAuth(false);
    pact.setWalletError(null);
  };

  return (
    <Container>
      <TxView
        view="Remove Liquidity"
        show={showTxModal}
        token0={token0}
        token1={token1}
        onClose={() => setShowTxModal(false)}
      />
      <WalletRequestView
        show={pact.isWaitingForWalletAuth}
        error={pact.walletError}
        onClose={() => onWalletRequestViewModalClose()}
      />
      <TitleContainer>
        <Title style={{ fontFamily: theme.fontFamily.bold }}>
          <ArrowBack
            style={{
              cursor: "pointer",
              color: "#FFFFFF",
              marginRight: "15px",
              justifyContent: "center",
            }}
            onClick={() => props.closeLiquidity()}
          />
          Remove Liquidity
        </Title>
      </TitleContainer>

      <FormContainer>
        <SubContainer>
          <Input
            value={amount}
            error={isNaN(amount)}
            topLeftLabel="Pool Tokens to Remove "
            placeholder=" Enter Amount"
            label={{ basic: true, content: "%" }}
            onChange={(e) => {
              if (
                Number(e.target.value) <= 100 &&
                Number(e.target.value) >= 0
              ) {
                setAmount(limitDecimalPlaces(e.target.value, 2));
              }
            }}
            numberOnly
            /* inputRightComponent={
            '%'
              
            fromValues.coin ? (
              <InputToken
                icon={pact.tokenData[fromValues.coin].icon}
                code={pact.tokenData[fromValues.coin].name}
                onClick={() => setTokenSelectorType('from')}
              />
            ) : null 
          }
          */
          />
          <ButtonContainer>
            <Button.Group fluid>
              <MyButton
                buttonStyle={{
                  border: "1px solid #424242",
                  width: "20%",
                }}
                background="transparent"
                onClick={() => setAmount(25)}
              >
                25%
              </MyButton>
              <MyButtonDivider />
              <MyButton
                buttonStyle={{
                  border: "1px solid #424242",
                  width: "20%",
                }}
                background="transparent"
                onClick={() => setAmount(50)}
              >
                50%
              </MyButton>
              <MyButtonDivider />
              <MyButton
                buttonStyle={{
                  border: "1px solid #424242",
                  width: "20%",
                }}
                background="transparent"
                onClick={() => setAmount(75)}
              >
                75%
              </MyButton>
              <MyButtonDivider />
              <MyButton
                buttonStyle={{
                  border: "1px solid #424242",
                  width: "20%",
                }}
                background="transparent"
                onClick={() => setAmount(100)}
              >
                100%
              </MyButton>
            </Button.Group>
          </ButtonContainer>
        </SubContainer>
      </FormContainer>

      <ResultContainer>
        <InnerRowContainer>
          <Label>
            {token0} per {token1}
          </Label>
          <Value>{pooled}</Value>
        </InnerRowContainer>
        <InnerRowContainer>
          <Label>Pooled {token0}</Label>
          <Value>{pooledToken0}</Value>
        </InnerRowContainer>
        <InnerRowContainer>
          <Label>Pooled {token1}</Label>
          <Value>{pooledToken1}</Value>
        </InnerRowContainer>
      </ResultContainer>

      <MyButton
        loading={loading}
        disabled={isNaN(amount) || reduceBalance(amount) === 0}
        onClick={async () => {
          if (
            pact.signing.method !== "sign" &&
            pact.signing.method !== "none"
          ) {
            const res = await pact.removeLiquidityLocal(
              pact.tokenData[token0].code,
              pact.tokenData[token1].code,
              reduceBalance(pooled, pact.PRECISION)
            );
            if (res === -1) {
              setLoading(false);
              alert(
                "Incorrect password. If forgotten, you can reset it with your private key"
              );
              return;
            } else {
              setShowTxModal(true);
              setLoading(false);
            }
          } else {
            setLoading(true);
            const res = await pact.removeLiquidityWallet(
              pact.tokenData[token0].code,
              pact.tokenData[token1].code,
              reduceBalance(pooled, pact.PRECISION)
            );
            if (!res) {
              pact.setIsWaitingForWalletAuth(true);
              setLoading(false);
              /* pact.setWalletError(true); */
              /* walletError(); */
            } else {
              pact.setWalletError(null);
              setShowTxModal(true);
              setLoading(false);
            }
          }
        }}
      >
        Remove Liquidity
      </MyButton>
      {/* <ButtonContainer>
        <TxView
          view={selectedView}
          show={showTxModal}
          token0={fromValues.coin}
          token1={toValues.coin}
          createTokenPair={() => pact.createTokenPairLocal(pact.tokenData[fromValues.coin].name, pact.tokenData[toValues.coin].name, fromValues.amount, toValues.amount)}
          onClose={() => setShowTxModal(false)}
        />
        <ReviewTx
          fromValues={fromValues}
          toValues={toValues}
          buttonStatus={buttonStatus}
          liquidityView={selectedView}
          supply={supply}
          loading={loading}
          open={showReview}
          setOpen={setShowReview}
        />
    </ButtonContainer> */}
    </Container>
  );
};

export default RemoveLiqContainer;
