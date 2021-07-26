import React, { useState, useContext } from "react";
import styled from "styled-components/macro";
import CustomButton from "../../../shared/CustomButton";
import Input from "../../../shared/Input";
import { Button } from "semantic-ui-react";
import { ModalContext } from "../../../contexts/ModalContext";
import { AccountContext } from "../../../contexts/AccountContext";
import { WalletContext } from "../../../contexts/WalletContext";

const Text = styled.span`
  font-size: 13px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.regular};
`;

const ActionContainer = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 0;
`;

const ConnectWalletChainweaverModal = ({ show, onClose, onBack }) => {
  const modalContext = useContext(ModalContext);
  const account = useContext(AccountContext);
  const wallet = useContext(WalletContext);
  const [accountId, setAccountId] = useState("");
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
    onClose();
  };

  const handleModalBack = () => {
    resetValues();
    onBack();
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
        Please make sure the KDA account provided is controlled by your
        Chainweaver wallet.
      </Text>
      <Text>
        When submitting a transaction, Chainweaver will show you a preview
        within the wallet before signing.
      </Text>
      <Input
        topLeftLabel={"Account"}
        placeholder="Insert your Account"
        value={accountId}
        error={accountId !== "" ? !checkKey(accountId) : false}
        onChange={async (e, { value }) => {
          setAccountId(value);
        }}
      />
      <ActionContainer>
        <Button.Group fluid>
          <CustomButton
            border="none"
            boxShadow="none"
            background="transparent"
            onClick={() => {
              resetValues();
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

export default ConnectWalletChainweaverModal;
