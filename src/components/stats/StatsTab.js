import React, { useContext, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { Dimmer, Loader, Table } from "semantic-ui-react";
import styled from "styled-components";
import tokenData from "../../constants/cryptoCurrencies";
import { PactContext } from "../../contexts/PactContext";
import CustomLabel from "../../shared/CustomLabel";
import ModalContainer from "../../shared/ModalContainer";
import theme from "../../styles/theme";
import { extractDecimal, reduceBalance } from "../../utils/reduceBalance";
import { PartialScrollableScrollSection } from "../layout/Containers";

const CustomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  gap: 4px 0px;
`;
const IconsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  svg:first-child {
    z-index: 2;
  }
  div:last-child {
    margin-right: 5px;
  }
`;

const StatsTab = () => {
  const pact = useContext(PactContext);

  useEffect(async () => {
    await pact.getPairList();
  }, []);

  return isMobile ? (
    <ModalContainer
      title="pool stats"
      containerStyle={{
        maxHeight: "80vh",
        maxWidth: 650,
      }}
    >
      <PartialScrollableScrollSection>
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
      </PartialScrollableScrollSection>
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
            <Table.HeaderCell textAlign="center" style={{ color: "#FFFFFF" }}>
              Name
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center" style={{ color: "#FFFFFF" }}>
              Total Reserve - <br /> token0
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center" style={{ color: "#FFFFFF" }}>
              Total Reserve - <br /> token1
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center" style={{ color: "#FFFFFF" }}>
              Rate
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {pact.pairList[0] ? (
          Object.values(pact.pairList).map((pair) =>
            pair && pair.reserves ? (
              <Table.Body key={pair.name}>
                <Table.Row>
                  <Table.Cell
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {tokenData[pair.token0].icon}
                    {tokenData[pair.token1].icon}
                    <div>{`${pair.token0}/${pair.token1}`}</div>
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
  );
};

export default StatsTab;
