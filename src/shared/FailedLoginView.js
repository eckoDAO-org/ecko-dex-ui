import React from "react";
import styled from "styled-components/macro";
import { Transition } from "react-spring/renderprops";
import { ErrorIcon } from "../assets";
import { Message } from "semantic-ui-react";
import CustomButton from "./CustomButton";
import Backdrop from "./Backdrop";
import ModalContainer from "./ModalContainer";

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 385px;
  width: 100%;
  z-index: 5;
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Title = styled.div`
 font-family: ${({ theme: { fontFamily } }) =>
   fontFamily.bold};  font-size: 24px;
  padding: 16px;
  color: color: #FFFFFF;
`;

const SubTitle = styled.div`
 font-family: ${({ theme: { fontFamily } }) =>
   fontFamily.bold};  font-size: 16px;
  color: color: #FFFFFF;
`;

const TransactionsDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 0px;
`;

const FailedLoginView = ({ onClose, show, accountName }) => {
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
              title="transaction details"
              containerStyle={{
                maxHeight: "80vh",
                maxWidth: "90vw",
              }}
              onClose={onClose}
            >
              <Content>
                <ErrorIcon />
                <Title>No Account</Title>
                <SubTitle>
                  `Please make sure the account ${accountName} exist on kadena
                  blockchain`
                </SubTitle>
                <CustomButton
                  onClick={() => {
                    onClose();
                  }}
                >
                  Retry
                </CustomButton>
              </Content>
            </ModalContainer>
          </Container>
        ))
      }
    </Transition>
  );
};

export default FailedLoginView;
