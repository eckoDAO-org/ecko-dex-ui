import React, { useContext } from "react";
import { Grid } from "semantic-ui-react";
import { NETWORKID } from "../../constants/contextConstants";
import tokenData from "../../constants/cryptoCurrencies";
import { PactContext } from "../../contexts/PactContext";
import ModalContainer from "../../shared/ModalContainer";
import { PartialScrollableScrollSection } from "../layout/Containers";

const SwapHistoryTab = () => {
  const pact = useContext(PactContext);
  console.log(
    "🚀 ~ file: SwapHistoryTab.js ~ line 52 ~ SwapHistoryTab ~ tokenData",
    tokenData
  );

  return (
    <ModalContainer
      title="Swap History"
      containerStyle={{
        maxHeight: "80vh",
        maxWidth: 650,
      }}
    >
      <Grid style={{ width: "100%", marginLeft: 0 }}>
        <Grid.Row columns="3">
          <Grid.Column className="textBold">Tx Id</Grid.Column>
          <Grid.Column className="textBold">Pair</Grid.Column>
          <Grid.Column className="textBold">Amount</Grid.Column>
        </Grid.Row>
      </Grid>
      <PartialScrollableScrollSection>
        <Grid style={{ width: "100%", minHeight: "50px", margin: "16px 0" }}>
          {pact.txList === "NO_SWAP_FOUND" ? (
            <Grid.Row>
              <Grid.Column>No Swap found</Grid.Column>
            </Grid.Row>
          ) : (
            Object.values(pact.swapList).map((swap, index) => (
              <Grid.Row
                columns="3"
                key={index}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open(
                    `https://explorer.chainweb.com/${NETWORKID}/tx/${swap?.reqKey}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                <Grid.Column>{swap?.txId}</Grid.Column>
                <Grid.Column>{`${
                  tokenData[swap?.events[3]?.params[3].refName]?.icon
                }/${
                  tokenData[swap?.events[3]?.params[5].refName]?.icon
                }`}</Grid.Column>
                <Grid.Column>{`${swap?.events[3]?.params[4]}`}</Grid.Column>
              </Grid.Row>
            ))
          )}
        </Grid>
      </PartialScrollableScrollSection>
    </ModalContainer>
  );
};

export default SwapHistoryTab;
