import React, { useState, useContext } from "react";
import styled from "styled-components/macro";
import { Button } from "semantic-ui-react";
import CustomButton from "../../../shared/CustomButton";
import { AccountContext } from "../../../contexts/AccountContext";
import { WalletContext } from "../../../contexts/WalletContext";
import { ModalContext } from "../../../contexts/ModalContext";
import GetZelcoreAccountModal from "./GetZelcoreAccountModal";

const Text = styled.span`
  font-size: 13px;
  font-family: montserrat-regular;
`;

const ActionContainer = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 32px;
`;

const ConnectWalletZelcoreModal = ({ onClose, onBack }) => {
  const modalContext = useContext(ModalContext);
  const account = useContext(AccountContext);
  const wallet = useContext(WalletContext);
  const [accountId, setAccountId] = useState("");
  const [openGetZelcoreAccountModal, setOpenGetZelcoreAccountModal] =
    useState(false);

  const is_hexadecimal = (str) => {
    const regexp = /^[0-9a-fA-F]+$/;
    if (regexp.test(str)) return true;
    else return false;
  };

  const checkKey = (key) => {
    try {
      if (key.length !== 64) {
        return false;
      } else if (!is_hexadecimal(key)) {
        return false;
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const resetValues = () => {
    setAccountId("");
  };

  const handleModalClose = () => {
    resetValues();
    modalContext.closeModal();
  };

  const handleModalBack = () => {
    resetValues();
    modalContext.onBackModal();
  };

  const handleConnect = async () => {
    await account.setVerifiedAccount(accountId);
    await wallet.signingWallet();

    // if (response !== "success") {
    //   setError({ message: "Account does not exist!" });
    // } else {
    //   handleModalClose();
    // }

    handleModalClose();
  };

  return (
    <>
      <Text>
        Please make sure the KDA account provided is controlled by your Zelcore
        wallet
      </Text>
      <Text>
        When submitting a transaction, Zelcore will show you a preview within
        the wallet before signing
      </Text>
      {/* <Input
                    topLeftLabel={"Account"}
                    placeholder="Insert your Account ID"
                    value={accountId}
                    error={accountId !== "" ? !checkKey(accountId) : false}
                    onChange={async (e, { value }) => {
                      setAccountId(value);
                    }}
                  /> */}
      {/* {error && error.message ? <Text>{error.message}</Text> : null} */}
      <CustomButton
        buttonStyle={{
          border: "1px solid #424242",
        }}
        background="transparent"
        onClick={() => {
          setOpenGetZelcoreAccountModal(true);
          modalContext.openModal({
            id: "ZELCORE_ACCOUNT",
            title: "get zelcore accounts",
            description: "Select Accounts",
            open: openGetZelcoreAccountModal,
            content: (
              <GetZelcoreAccountModal
                onClose={() => modalContext.closeModal()}
              />
            ),
          });
        }}
      >
        Get Zelcore Accounts
      </CustomButton>
      <ActionContainer>
        <Button.Group fluid>
          <CustomButton
            border="none"
            boxShadow="none"
            background="transparent"
            onClick={() => {
              handleModalBack();
            }}
          >
            Cancel
          </CustomButton>
          <CustomButton
            disabled={!checkKey(accountId)}
            onClick={() => {
              handleConnect();
            }}
          >
            Connect
          </CustomButton>
        </Button.Group>
      </ActionContainer>
    </>
  );
};

export default ConnectWalletZelcoreModal;
