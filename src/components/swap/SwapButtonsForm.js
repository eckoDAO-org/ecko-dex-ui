import React from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";
import pwError from "../alerts/pwError";
import CustomButton from "../../shared/CustomButton";

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  width: 100%;
`;

const SwapButtonsForm = ({
  setLoading,
  fromValues,
  setFromValues,
  toValues,
  setToValues,
  fromNote,
}) => {
  const getButtonLabel = () => {
    // if (!pact.account.account)
    return "Connect wallet";
    // //if (!pact.hasWallet()) return "Set signing method in wallet";
    // if (!fromValues.coin || !toValues.coin) return "Select tokens";
    // if (fetchingPair) return "Fetching Pair...";
    // if (isNaN(pact.ratio)) return "Pair does not exist!";
    // if (!fromValues.amount || !toValues.amount) return "Enter an amount";
    // if (fromValues.amount > fromValues.balance)
    //   return `Insufficient ${fromValues.coin} balance`;
    // return "SWAP";
  };
  return (
    <ButtonContainer>
      <Button.Group>
        <CustomButton
          /* background="none" */
          disabled={
            ""
            // pact.account.account &&
            // (getButtonLabel() !== "SWAP" ||
            //   isNaN(fromValues.amount) ||
            //   isNaN(toValues.amount))
          }
          loading={
            ""
            //   loading
          }
          onClick={async () => {
            // if (!pact.account.account) {
            //   wallet.setOpenConnectModal(true);
            //   return;
            // }
            setLoading(true);
            // if (
            //   pact.signing.method !== "sign" &&
            //   pact.signing.method !== "none"
            // ) {
            //   const res = await pact.swapLocal(
            //     {
            //       amount: fromValues.amount,
            //       address: fromValues.address,
            //       coin: fromValues.coin,
            //     },
            //     {
            //       amount: toValues.amount,
            //       address: toValues.address,
            //       coin: toValues.coin,
            //     },
            //     fromNote === "(estimated)" ? false : true
            //   );

            //   if (res === -1) {
            //     setLoading(false);
            //     //error alert
            //     if (pact.localRes) pwError();
            //     return;
            //   } else {
            //     //setShowTxModal(true);
            //     if (res?.result?.status === "success") {
            //       setFromValues({
            //         amount: "",
            //         balance: "",
            //         coin: "",
            //         address: "",
            //         precision: 0,
            //       });
            //       setToValues({
            //         amount: "",
            //         balance: "",
            //         coin: "",
            //         address: "",
            //         precision: 0,
            //       });
            //     }
            //     setLoading(false);
            //   }
            // } else {
            //   const res = await pact.swapWallet(
            //     {
            //       amount: fromValues.amount,
            //       address: fromValues.address,
            //       coin: fromValues.coin,
            //     },
            //     {
            //       amount: toValues.amount,
            //       address: toValues.address,
            //       coin: toValues.coin,
            //     },
            //     fromNote === "(estimated)" ? false : true
            //   );

            //   if (!res) {
            //     pact.setIsWaitingForWalletAuth(true);
            //   } else {
            //     pact.setWalletError(null);
            //     //setShowTxModal(true);
            //   }
            //   if (res?.result?.status === "success") {
            //     setFromValues({
            //       amount: "",
            //       balance: "",
            //       coin: "",
            //       address: "",
            //       precision: 0,
            //     });
            //     setToValues({
            //       amount: "",
            //       balance: "",
            //       coin: "",
            //       address: "",
            //       precision: 0,
            //     });
            //   }
            //   setLoading(false);
            // }
          }}
        >
          {getButtonLabel()}
        </CustomButton>
      </Button.Group>
    </ButtonContainer>
  );
};

export default SwapButtonsForm;
