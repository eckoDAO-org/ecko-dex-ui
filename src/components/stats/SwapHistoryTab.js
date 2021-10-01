import React, { useContext } from "react";
import { Grid } from "semantic-ui-react";
import styled from "styled-components/macro";
import { NETWORK_TYPE } from "../../constants/contextConstants";
import tokenData from "../../constants/cryptoCurrencies";
import { PactContext } from "../../contexts/PactContext";
import ModalContainer from "../../shared/ModalContainer";
import theme from "../../styles/theme";
import { PartialScrollableScrollSection } from "../layout/Containers";

const IconColumn = styled(Grid.Column)`
  display: flex !important;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
`;

const SwapHistoryTab = () => {
  const pact = useContext(PactContext);

  const getIconCoin = (cryptoCode) => {
    const crypto = Object.values(tokenData).find(
      ({ code }) => code === cryptoCode
    );
    return crypto?.icon;
  };

  return (
    <ModalContainer
      title="Swap History"
      containerStyle={{
        maxHeight: "60vh",
        maxWidth: 650,
      }}
    >
      <Grid style={{ width: "100%", marginLeft: 0 }}>
        <Grid.Row columns="3">
          <Grid.Column
            style={{ fontFamily: theme.fontFamily.bold, fontSize: 18 }}
          >
            Tx Id
          </Grid.Column>
          <Grid.Column
            style={{ fontFamily: theme.fontFamily.bold, fontSize: 18 }}
          >
            Pair
          </Grid.Column>
          <Grid.Column
            style={{ fontFamily: theme.fontFamily.bold, fontSize: 18 }}
          >
            Amount
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <PartialScrollableScrollSection>
        <Grid style={{ width: "100%", minHeight: "40px", margin: "16px 0" }}>
          {pact.swapList === "NO_SWAP_FOUND" ? (
            <Grid.Row>
              <Grid.Column>No Swap found</Grid.Column>
            </Grid.Row>
          ) : (
            Object.values(pact.swapList)
              ?.filter((swapTx) => swapTx?.events[3]?.name === "SWAP")
              ?.sort((a, b) => a?.txId - b?.txId)
              ?.map((swap, index) => (
                <Grid.Row
                  columns="3"
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    window.open(
                      `https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${swap?.reqKey}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                >
                  <Grid.Column>{swap?.txId}</Grid.Column>
                  <IconColumn>
                    {getIconCoin(swap?.result?.data[0]?.token)}
                    {getIconCoin(swap?.result?.data[1]?.token)}
                  </IconColumn>
                  <Grid.Column>{`${swap?.result?.data[0]?.amount}`}</Grid.Column>
                </Grid.Row>
              ))
          )}
        </Grid>
      </PartialScrollableScrollSection>
    </ModalContainer>
  );
};

export default SwapHistoryTab;
