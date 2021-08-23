import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components/macro";
import CustomButton from "../../../shared/CustomButton";
import { Dropdown, Loader } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import getAccounts from "../../../utils/getZelcoreAccts";
import reduceToken from "../../../utils/reduceToken";
import { AccountContext } from "../../../contexts/AccountContext";
import { ModalContext } from "../../../contexts/ModalContext";

const Text = styled.span`
  font-size: 13px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.regular};
`;

const ActionContainer = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 32px;
`;

const GetZelcoreAccountModal = ({ show, onClose, onBack }) => {
  const modalContext = useContext(ModalContext);
  const account = useContext(AccountContext);
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
    await account.setVerifiedAccount(selectedAccount);
    handleModalClose();
  };

  const handleCancel = () => {
    setSelectedAccount(null);
    modalContext.onBackModal();
  };

  return (
    <>
      {!approved ? (
        <>
          <Text>Follow instructions in the wallet to share your accounts</Text>
          <ActionContainer>
            {loading ? (
              <Loader
                active
                inline="centered"
                style={{ color: "#FFFFFF" }}
              ></Loader>
            ) : (
              <CustomButton
                onClick={() => {
                  getAccountsFromWallet();
                }}
              >
                Retry
              </CustomButton>
            )}
          </ActionContainer>
        </>
      ) : (
        <>
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

          <ActionContainer>
            <Button.Group fluid>
              <CustomButton
                border="none"
                boxShadow="none"
                background="transparent"
                onClick={() => handleCancel()}
              >
                Cancel
              </CustomButton>
              <CustomButton
                disabled={!selectedAccount}
                onClick={() => handleConnect()}
              >
                Connect
              </CustomButton>
            </Button.Group>
          </ActionContainer>
        </>
      )}
    </>
  );
};

export default GetZelcoreAccountModal;
