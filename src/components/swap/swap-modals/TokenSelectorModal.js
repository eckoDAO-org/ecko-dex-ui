import React, { useState, useContext } from "react";
import styled from "styled-components/macro";
import { Transition } from "react-spring/renderprops";
import Search from "../../../shared/Search";
import Backdrop from "../../../shared/Backdrop";
import ModalContainer from "../../../shared/ModalContainer";
import { SwapContext } from "../../../contexts/SwapContext";
import { extractDecimal, reduceBalance } from "../../../utils/reduceBalance";

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

const Label = styled.span`
  font-size: 13px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  text-transform: capitalize;
`;

const Divider = styled.div`
  /* border: ${({ theme: { colors } }) => `1px solid ${colors.border}`}; */
  border: 1px solid #ecebec;
  margin: 16px 0px;
  width: 100%;
`;

const TokensContainer = styled.div`
  display: flex;
  flex-flow: column;

  & > div:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const TokenItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  color: ${({ selected }) => (selected ? "white" : "")};
  svg {
    margin-right: 8px;
    width: 24px;
    height: 24px;
  }
`;

const TokenSelectorModal = ({
  show,
  selectedToken,
  onTokenClick,
  onClose,
  fromToken,
  toToken,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const swap = useContext(SwapContext);

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
                setSearchValue("");
                onClose();
              }}
            />
            <ModalContainer
              title="select a token"
              containerStyle={{
                //height: "100%",
                maxHeight: "80vh",
                maxWidth: "90vw",
              }}
              onClose={() => {
                setSearchValue("");
                onClose();
              }}
            >
              <Label style={{ marginBottom: 4 }}>search token</Label>
              <Search
                fluid
                containerStyle={{
                  marginBottom: 15,
                  borderRadius: "4px",
                  border: "1px solid #FFFFFF",
                  /* boxShadow: "0 0 5px #FFFFFF" */
                }}
                placeholder="Search"
                value={searchValue}
                onChange={(e, { value }) => setSearchValue(value)}
              />
              <Label>token</Label>
              <Divider />
              <TokensContainer>
                {Object.values(swap.tokenData)
                  .filter((c) => {
                    const code =
                      c.code !== "coin" ? c.code.split(".")[1] : c.code;
                    return (
                      code
                        .toLocaleLowerCase()
                        .includes(searchValue?.toLocaleLowerCase()) ||
                      c.name.toLowerCase().includes(searchValue?.toLowerCase())
                    );
                  })
                  .map((crypto) => {
                    return (
                      <TokenItem
                        key={crypto.name}
                        active={
                          selectedToken === crypto.name ||
                          fromToken === crypto.name ||
                          toToken === crypto.name
                        }
                        // active={selectedToken === crypto.name}
                        selected={selectedToken === crypto.name}
                        style={{
                          cursor:
                            selectedToken === crypto.name
                              ? "default"
                              : "pointer",
                        }}
                        onClick={() => {
                          if (
                            fromToken === crypto.name ||
                            toToken === crypto.name
                          )
                            return;
                          if (selectedToken !== crypto.name) {
                            onTokenClick({ crypto });
                            setSearchValue("");
                            onClose();
                          }
                        }}
                      >
                        {crypto.icon}
                        {crypto.name}
                        {selectedToken === crypto.name ? (
                          <Label style={{ marginLeft: 5 }}>(Selected)</Label>
                        ) : (
                          <></>
                        )}
                        <span
                          style={{
                            marginLeft: "auto",
                            marginRight: 1,
                            fontSize: 16,
                            fontWeight: "bold",
                          }}
                        >
                          {crypto.balance
                            ? `${reduceBalance(crypto.balance).toFixed(
                                crypto.precision
                              )} ${crypto.name}`
                            : ""}
                        </span>
                      </TokenItem>
                    );
                  })}
              </TokensContainer>
            </ModalContainer>
          </Container>
        ))
      }
    </Transition>
  );
};

export default TokenSelectorModal;
