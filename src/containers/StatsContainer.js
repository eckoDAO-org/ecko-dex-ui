import React, { useContext, useEffect } from "react";
import styled from "styled-components/macro";
import { Dimmer, Grid, Loader, Table } from "semantic-ui-react";
import { isMobile } from "react-device-detect";
import { PactContext } from "../contexts/PactContext";
import ModalContainer from "../shared/ModalContainer";
import { extractDecimal, reduceBalance } from "../utils/reduceBalance";
import tokenData from "../constants/cryptoCurrencies";
import theme from "../styles/theme";
import CustomLabel from "../shared/CustomLabel";

const Container = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  overflow: scroll;
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 21px;
  width: 80px;
  svg:first-child {
    z-index: 2;
  }
  div:last-child {
    margin-left: 5px;
  }
`;

const CustomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  gap: 4px 0px;
`;

const StatsContainer = () => {
  const pact = useContext(PactContext);

  useEffect(async () => {
    await pact.getPairList();
  }, []);

  return (
    //MOBILE
    <Container>
      {isMobile ? (
        <ModalContainer
          title="pool stats"
          containerStyle={{
            maxHeight: "80vh",
            maxWidth: 650,
          }}
        >
          {pact.pairList[0] ? (
            Object.values(pact.pairList).map((pair) =>
              pair && pair.reserves ? (
                <CustomGrid>
                  <CustomLabel bold>Name</CustomLabel>
                  <IconsContainer>
                    {tokenData[pair.token0].icon}
                    {tokenData[pair.token1].icon}
                    <div>{`${pair.token0}/${pair.token1}`}</div>
                  </IconsContainer>
                  <CustomLabel bold>token0</CustomLabel>
                  <CustomLabel>{reduceBalance(pair.reserves[0])}</CustomLabel>
                  <CustomLabel bold>token1</CustomLabel>
                  <CustomLabel>{reduceBalance(pair.reserves[1])}</CustomLabel>
                  <CustomLabel bold>Rate</CustomLabel>
                  <CustomLabel>{`${reduceBalance(
                    extractDecimal(pair.reserves[0]) /
                      extractDecimal(pair.reserves[1])
                  )} ${pair.token0}/${pair.token1}`}</CustomLabel>
                </CustomGrid>
              ) : (
                ""
              )
            )
          ) : (
            <Dimmer active inverted>
              <Loader>Loading</Loader>
            </Dimmer>
          )}
        </ModalContainer>
      ) : (
        //DESKTOP
        <ModalContainer
          title="pool stats"
          containerStyle={{
            maxHeight: "80vh",
            maxWidth: 650,
          }}
        >
          <Table celled basic="very" style={{ color: "#FFFFFF" }}>
            <Table.Header>
              <Table.Row style={{ fontFamily: theme.fontFamily.bold }}>
                <Table.HeaderCell
                  textAlign="center"
                  style={{ color: "#FFFFFF" }}
                >
                  Name
                </Table.HeaderCell>
                <Table.HeaderCell
                  textAlign="center"
                  style={{ color: "#FFFFFF" }}
                >
                  Total Reserve - <br /> token0
                </Table.HeaderCell>
                <Table.HeaderCell
                  textAlign="center"
                  style={{ color: "#FFFFFF" }}
                >
                  Total Reserve - <br /> token1
                </Table.HeaderCell>
                <Table.HeaderCell
                  textAlign="center"
                  style={{ color: "#FFFFFF" }}
                >
                  Rate
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            {pact.pairList[0] ? (
              Object.values(pact.pairList).map((pair) =>
                pair && pair.reserves ? (
                  <Table.Body>
                    <Table.Row key={pair.name}>
                      <Table.Cell>
                        <IconsContainer>
                          {tokenData[pair.token0].icon}
                          {tokenData[pair.token1].icon}
                          <div>{`${pair.token0}/${pair.token1}`}</div>
                        </IconsContainer>
                      </Table.Cell>
                      <Table.Cell>{reduceBalance(pair.reserves[0])}</Table.Cell>
                      <Table.Cell>{reduceBalance(pair.reserves[1])}</Table.Cell>
                      <Table.Cell>{`${reduceBalance(
                        extractDecimal(pair.reserves[0]) /
                          extractDecimal(pair.reserves[1])
                      )} ${pair.token0}/${pair.token1}`}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ) : (
                  ""
                )
              )
            ) : (
              <Dimmer active inverted>
                <Loader>Loading</Loader>
              </Dimmer>
            )}
          </Table>
        </ModalContainer>
      )}
    </Container>
  );
};

export default StatsContainer;
