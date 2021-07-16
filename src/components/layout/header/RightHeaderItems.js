import React, { useContext } from "react";
import styled from "styled-components";
import HeaderItem from "../../../shared/HeaderItem";
import AccountInfo from "./AccountInfo";
import Button from "../../../shared/CustomButton";
import CustomPopup from "../../../shared/CustomPopup";
import { PowerIcon, CogIcon, HamburgerIcon } from "../../../assets";
import headerLinks from "../../headerLinks";
import PopupContentList from "./PopupContentList";
import { AccountContext } from "../../../contexts/AccountContext";
import reduceToken from "../../../utils/reduceToken";
import { reduceBalance } from "../../../utils/reduceBalance";
import SlippagePopupContent from "./SlippagePopupContent";
import { ModalContext } from "../../../contexts/ModalContext";
import ConnectWalletModal from "../../modals/kdaModals/ConnectWalletModal";

const RightContainerHeader = styled.div`
  display: flex;
  align-items: center;
  & > *:first-child {
    margin-right: 13px;
  }
  & > *:not(:first-child):not(:last-child) {
    margin-right: 14px;
  }
  @media (min-width: ${({ theme: { mediaQueries } }) =>
      mediaQueries.mobileBreakpoint}) {
    & > *:not(:first-child):not(:last-child) {
      margin-right: 16px;
    }
  }
`;

const Label = styled.span`
  font-size: 13px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  text-transform: capitalize;
  padding: 10px 16px;
  color: white;
  fontsize: 16;
`;
//  montare Context

const RightHeaderItems = () => {
  const { account, logout } = useContext(AccountContext);
  const modalContext = useContext(ModalContext);

  return (
    <RightContainerHeader>
      <HeaderItem className="mobile-none">
        <Label>live testnet chain 0</Label>
      </HeaderItem>
      {account?.account ? (
        <HeaderItem className="mobile-none">
          <AccountInfo
            onClick={() =>
              modalContext.openModal({
                title: account?.account ? "wallet connected" : "connect wallet",
                description: account?.account
                  ? `Account ID: ${reduceToken(account.account)}`
                  : "Connect a wallet using one of the methods below",
                content: <ConnectWalletModal />,
              })
            }
            account={
              account.account ? `${reduceToken(account.account)}` : "KDA"
            }
            balance={
              account.account ? `${reduceBalance(account.balance)} KDA` : ""
            }
          ></AccountInfo>
        </HeaderItem>
      ) : (
        <></>
      )}
      {!account.account && (
        <>
          <HeaderItem className="mobile-none">
            <Button
              hover={true}
              buttonStyle={{ padding: "10px 16px" }}
              fontSize={14}
              onClick={() =>
                modalContext.openModal({
                  title: account?.account
                    ? "wallet connected"
                    : "connect wallet",
                  description: account?.account
                    ? `Account ID: ${reduceToken(account.account)}`
                    : "Connect a wallet using one of the methods below",
                  content: <ConnectWalletModal />,
                })
              }
            >
              Connect Wallet
            </Button>
          </HeaderItem>
        </>
      )}
      {account.account && (
        <HeaderItem>
          <PowerIcon onClick={() => logout()} />
        </HeaderItem>
      )}
      <HeaderItem>
        <CustomPopup
          trigger={<CogIcon />}
          on="click"
          offset={[10, 10]}
          position="bottom right"
        >
          <SlippagePopupContent />
        </CustomPopup>
      </HeaderItem>
      <HeaderItem>
        <CustomPopup
          basic
          trigger={<HamburgerIcon />}
          on="click"
          offset={[0, 10]}
          position="bottom right"
        >
          <PopupContentList items={headerLinks} />
        </CustomPopup>
      </HeaderItem>
    </RightContainerHeader>
  );
};

export default RightHeaderItems;
