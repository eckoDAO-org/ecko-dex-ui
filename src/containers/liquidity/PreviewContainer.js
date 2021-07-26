import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components/macro";
import { ReactComponent as PlusIcon } from "../../assets/images/shared/plus.svg";
import ModalContainer from "../../components/shared/ModalContainer";
import FormContainer from "../../components/shared/FormContainer";
import Input from "../../components/shared/Input";
import InputToken from "../../components/shared/InputToken";
import ButtonDivider from "../../components/shared/ButtonDivider";
import Button from "../../components/shared/Button";
import TokenSelector from "../../components/shared/TokenSelector";
import { throttle, debounce } from "throttle-debounce";
import { PactContext } from "../../contexts/PactContext";
import { ReactComponent as LeftIcon } from "../../assets/images/shared/left-arrow.svg";
import { reduceBalance, limitDecimalPlaces } from "../../utils/reduceBalance";
import TxView from "../../components/shared/TxView";
import ReviewTx from "./ReviewTx";
import { ReactComponent as ArrowBack } from "../../assets/images/shared/arrow-back.svg";
import { ReactComponent as SwapArrowsIcon } from "../../assets/images/shared/swap-arrow.svg";
import { Grid } from "semantic-ui-react";
import theme from "../../styles/theme";

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

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0px;
  flex-flow: row;
  width: 100%;
`;

const RowContainer2 = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: column;
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

const PreviewContainer = (props) => {
  const pact = useContext(PactContext);
  const {
    fromValues,
    toValues,
    buttonStatus,
    liquidityView,
    loading,
    supply,
    open,
    setOpen,
  } = props;

  return (
    <Container>
      <TokenSelector
      /* show={tokenSelectorType !== null}
          selectedToken={selectedToken}
          onTokenClick={onTokenClick}
          fromToken={fromValues.coin}
          toToken={toValues.coin}
          onClose={() => setTokenSelectorType(null)} */
      />
      <TitleContainer>
        <Title style={{ fontFamily: theme.fontFamily.regular }}>
          <ArrowBack
            style={{
              cursor: "pointer",
              color: "#FFFFFF",
              marginRight: "15px",
              justifyContent: "center",
            }}
            onClick={() => props.closeLiquidity()}
          />
          Preview Successful!
        </Title>
      </TitleContainer>

      <FormContainer title="Transaction Details">
        <Input
          topLeftLabel="Deposit Desired"
          /* inputRightComponent={
            fromValues.coin ? (
              <InputToken
                icon={pact.tokenData[fromValues.coin].icon}
                code={pact.tokenData[fromValues.coin].name}
                onClick={() => setTokenSelectorType('from')}
              />
            ) : null
          } */

          numberOnly
        />
        <Input
          topLeftLabel="Deposit Desired"
          /* inputRightComponent={
            toValues.coin ? (
              <InputToken
                icon={pact.tokenData[toValues.coin].icon}
                code={pact.tokenData[toValues.coin].name}
                onClick={() => setTokenSelectorType('to')}
              />
            ) : null
          } */

          numberOnly
        />
      </FormContainer>

      {
        liquidityView === "Add Liquidity" ? (
          <ResultContainer>
            <RowContainer2>
              <Label>{`1 ${fromValues?.coin}`}</Label>
              <Value>{`${reduceBalance(1 / pact.ratio)} ${
                toValues?.coin
              }`}</Value>
            </RowContainer2>
            <RowContainer2>
              <Label>{`1 ${toValues?.coin} `}</Label>
              <Value>
                {`${reduceBalance(pact.ratio)} ${fromValues?.coin}`}
              </Value>
            </RowContainer2>
            <RowContainer2>
              <Label>Share of Pool</Label>
              <Value>
                {reduceBalance(pact.share(fromValues?.amount) * 100)}%
              </Value>
            </RowContainer2>
          </ResultContainer>
        ) : (
          ""
        )
        /* <ResultContainer>
            <RowContainer2>
              <Label>{`1 ${fromValues?.coin}`}</Label>
              <Value>{`${reduceBalance(toValues.amount/fromValues.amount)} ${toValues?.coin}`}</Value>
            </RowContainer2>
            <RowContainer2>
              <Label>{`1 ${toValues?.coin} `}</Label>
              <Value>
                  {`${reduceBalance(fromValues.amount/toValues.amount)} ${fromValues?.coin}`}
              </Value>
            </RowContainer2>
            
          </ResultContainer> */
      }

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

export default PreviewContainer;
