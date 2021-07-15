import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components/macro";
import { Transition } from "react-spring/renderprops";
import ModalContainer from "../../components/shared/ModalContainer";
import Backdrop from "../../components/shared/Backdrop";
import MyButton from "../../components/shared/Button";
import { PactContext } from "../../contexts/PactContext";
import getAccounts from "../../utils/getZelcoreAccts";
import walletError from "../../components/alerts/walletError";
import { Dropdown, Loader } from "semantic-ui-react";
import reduceToken from "../../utils/reduceToken";
import { Button } from "semantic-ui-react";

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  width: 100%;
  z-index: 5;
`;

const Text = styled.span`
  font-size: 13px;
  font-family: montserrat-regular;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 24px;
`;

const ActionContainer = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 32px;
`;

const GetZelcoreAccountModal = ({ show, onClose, onBack }) => {
  const pact = useContext(PactContext);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [approved, setApproved] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const getAccountsFromWallet = async () => {
    setLoading(true);
    const getAccountsResponse = await getAccounts();
    console.log(getAccountsResponse);
    if (getAccountsResponse.status === "success") {
      setApproved(true);
      setWalletConnected(true);
      setAccounts(getAccountsResponse.data);
    } else {
      setWalletConnected(false);
      /* walletError(); */
    }
    setLoading(false);
  };

  useEffect(() => {
    async function fetchData() {
      await getAccountsFromWallet();
    }
    fetchData();
  }, []);

  const handleDropdownChange = async (e, { value }) => {
    setSelectedAccount(value);
  };

  const handleModalClose = () => {
    onClose();
    setApproved(false);
  };

  const handleConnect = async () => {
    await pact.setVerifiedAccount(selectedAccount);
    onClose();
  };

  const handleCancel = () => {
    setSelectedAccount(null);
  };

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
            <Backdrop
              onClose={() => {
                onClose();
              }}
            />
            {!approved ? (
              <ModalContainer
                title="get zelcore accounts"
                description="Please Approve"
                containerStyle={{
                  height: "100%",
                  maxHeight: "80vh",
                  maxWidth: "90vw",
                }}
                onClose={() => handleModalClose()}
              >
                <ContentContainer>
                  <Text>
                    Follow instructions in the wallet to share your accounts
                  </Text>
                </ContentContainer>
                <ActionContainer>
                  {loading ? (
                    <Loader
                      active
                      inline="centered"
                      style={{ color: "#FFFFFF" }}
                    ></Loader>
                  ) : (
                    <MyButton
                      onClick={() => {
                        getAccountsFromWallet();
                      }}
                    >
                      Retry
                    </MyButton>
                  )}
                </ActionContainer>
              </ModalContainer>
            ) : (
              <ModalContainer
                title="get zelcore accounts"
                description="Select Accounts"
                containerStyle={{
                  height: "100%",
                  maxHeight: "80vh",
                  maxWidth: "90vw",
                }}
                onClose={() => handleModalClose()}
              >
                <ContentContainer>
                  <Text>Choose Public Key you intend to use</Text>

                  <Dropdown
                    placeholder="More"
                    fluid
                    selection
                    closeOnChange
                    options={
                      accounts &&
                      accounts.map((item, index) => ({
                        key: index,
                        text: reduceToken(item),
                        value: item,
                      }))
                    }
                    onChange={handleDropdownChange}
                    value={selectedAccount}
                  />
                </ContentContainer>
                <ActionContainer>
                  <Button.Group fluid>
                    <MyButton
                      border="none"
                      boxShadow="none"
                      background="transparent"
                      onClick={() => handleCancel()}
                    >
                      Cancel
                    </MyButton>
                    <MyButton
                      disabled={!selectedAccount}
                      onClick={() => {
                        handleConnect();
                      }}
                    >
                      Connect
                    </MyButton>
                  </Button.Group>
                </ActionContainer>
              </ModalContainer>
            )}
          </Container>
        ))
      }
    </Transition>
  );
};

export default GetZelcoreAccountModal;
