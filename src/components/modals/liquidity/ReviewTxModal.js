import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components/macro";
import { Transition } from "react-spring/renderprops";
import ModalContainer from "../../../shared/ModalContainer";
import { reduceBalance } from "../../../utils/reduceBalance";
import Backdrop from "../../../shared/Backdrop";
import { Loader } from "semantic-ui-react";
import CustomButton from "../../../shared/CustomButton";
import { SuccessfullIcon } from "../../../assets";
import { PactContext } from "../../../contexts/PactContext";

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  max-width: 385px;
  width: 100%;
  z-index: 5;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 15px;
`;

const Label = styled.span`
  font-family: montserrat-bold;
  font-size: 13px;
  color: #ffffff;
`;

const AmountLabel = styled.span`
  font-family: montserrat-bold;
  display: flex
  flex-direction: row;
  font-size: 13px;
  color: #FFFFFF;
  margin-bottom: 10px;
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0px;
`;

const Divider = styled.div`
  border: ${({ theme: { colors } }) => `1px solid ${colors.border}`};
  margin: 16px 0px;
  width: 100%;
`;

const Title = styled.div`
  font-family: montserrat-bold;
  font-size: 24px;
  color: color: #FFFFFF;;
`;

const TransactionsDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 0px;
  padding-top: 5px;
`;

const SpaceBetweenRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Value = styled.span`
  font-family: montserrat-regular;
  font-size: 13px;
  color: #ffffff;
`;

const SubTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SubTitle = styled.div`
  font-family: montserrat-bold;
  font-size: 16px;
  color: color: #FFFFFF;
  align-items: center;
  position: relative;
  justify-content: center;
`;

const ReviewTxModal = ({
  show,
  onClose,
  fromValues,
  toValues,
  loading,
  supply,
  liquidityView,
}) => {
  const pact = useContext(PactContext);

  return (
    <Transition
      items={show}
      from={{ opacity: 0 }}
      enter={{ opacity: 1 }}
      leave={{ opacity: 0 }}
    >
      {(show) =>
        show &&
        ((props) => (
          <Container style={props}>
            <Backdrop onClose={onClose} />
            <ModalContainer
              title="Preview Successful!"
              containerStyle={{
                height: "100%",
                maxHeight: "80vh",
                maxWidth: "90vw",
              }}
              onClose={onClose}
            >
              <Content>
                <SuccessfullIcon />
                <Title style={{ padding: "16px 0px" }}>
                  Transaction Details
                </Title>

                {liquidityView === "Add Liquidity" ? (
                  <TransactionsDetails>
                    <SubTitleContainer>
                      <SubTitle
                        style={{
                          marginBottom: "15px",
                          justifyContent: "center",
                        }}
                      >
                        Deposit Desired:
                      </SubTitle>
                    </SubTitleContainer>
                    <SpaceBetweenRow>
                      <Label>{fromValues.coin}</Label>
                      <Value>{fromValues.amount}</Value>
                    </SpaceBetweenRow>
                    <SpaceBetweenRow style={{ padding: "16px 0px" }}>
                      <Label>{toValues.coin}</Label>
                      <Value>{toValues.amount}</Value>
                    </SpaceBetweenRow>
                    <SubTitleContainer>
                      <SubTitle
                        style={{
                          marginBottom: "15px",
                          justifyContent: "center",
                        }}
                      >
                        Rates:
                      </SubTitle>
                    </SubTitleContainer>
                    <SpaceBetweenRow>
                      <Label>{`1 ${fromValues?.coin}`}</Label>
                      <Value>
                        {`${reduceBalance(1 / pact.ratio)} ${toValues?.coin}`}
                      </Value>
                    </SpaceBetweenRow>
                    <SpaceBetweenRow style={{ padding: "16px 0px" }}>
                      <Label>{`1 ${toValues?.coin} `}</Label>
                      <Value>
                        {`${reduceBalance(pact.ratio)} ${fromValues?.coin}`}
                      </Value>
                    </SpaceBetweenRow>
                    <SpaceBetweenRow>
                      <Label>Share of Pool:</Label>
                      <Value>
                        {reduceBalance(pact.share(fromValues?.amount) * 100)}%
                      </Value>
                    </SpaceBetweenRow>
                  </TransactionsDetails>
                ) : (
                  <TransactionsDetails>
                    <SpaceBetweenRow>
                      <Label>{`1 ${fromValues?.coin}`}</Label>
                      <Value>
                        {`${reduceBalance(
                          toValues.amount / fromValues.amount
                        )} ${toValues.coin}`}
                      </Value>
                    </SpaceBetweenRow>
                    <SpaceBetweenRow style={{ padding: "16px 0px" }}>
                      <Label>{`1 ${toValues?.coin} `}</Label>
                      <Value>
                        {`${reduceBalance(
                          fromValues.amount / toValues.amount
                        )} ${fromValues.coin}`}
                      </Value>
                    </SpaceBetweenRow>
                  </TransactionsDetails>
                )}
                <CustomButton
                  buttonStyle={{ width: "100%" }}
                  loading={loading}
                  onClick={supply}
                >
                  Confirm
                </CustomButton>
              </Content>
            </ModalContainer>
          </Container>
        ))
      }
    </Transition>
  );
};

export default ReviewTxModal;
