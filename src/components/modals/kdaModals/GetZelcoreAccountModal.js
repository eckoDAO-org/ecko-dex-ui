import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import CustomButton from '../../../shared/CustomButton';
import { Dropdown, Loader } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import reduceToken from '../../../utils/reduceToken';
import { AccountContext } from '../../../contexts/AccountContext';
import { ModalContext } from '../../../contexts/ModalContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import theme from '../../../styles/theme';
import { getAccounts, openZelcore } from "../../../utils/zelcore";
import { WalletContext } from "../../../contexts/WalletContext";
import { WALLET } from "../../../constants/wallet";

const TopText = styled.span`
  font-size: 13px;
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular};
  text-align: ${({ gameEditionView }) => (gameEditionView ? 'left' : 'center')};
  position: ${({ gameEditionView }) => (gameEditionView ? 'absolute' : 'none')};
  bottom: ${({ gameEditionView }) => (gameEditionView ? '292px' : '0')};
`;

const BottomText = styled.span`
  font-size: 13px;
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular};
  text-align: ${({ gameEditionView }) => (gameEditionView ? 'left' : 'center')};
  position: ${({ gameEditionView }) => (gameEditionView ? 'absolute' : 'none')};
  top: ${({ gameEditionView }) => (gameEditionView ? '-48px' : '0')};
`;

const ActionContainer = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 32px;
  width: ${({ gameEditionView }) => gameEditionView && '97%'};
  position: ${({ gameEditionView }) => (gameEditionView ? 'absolute' : 'none')};
  top: ${({ gameEditionView }) => (gameEditionView ? '188px' : '0')};
`;

const DropdownContainer = styled.div`
  .ui.selection.dropdown {
    background: transparent;
    border: 2px dashed ${theme.colors.black};
    position: absolute;
    width: 97%;
    top: -22px;
  }

  .ui.selection.dropdown .menu {
    margin-top: 10px !important;
    background: transparent;
    border: 2px dashed ${theme.colors.black};

    @media (min-width: ${({ theme: { mediaQueries } }) =>
        `${mediaQueries.mobilePixel + 1}px`}) {
      max-height: 13em;
    }

    @media (min-width: ${({ theme: { mediaQueries } }) =>
        `${mediaQueries.desktopPixel}px`}) {
      max-height: 11em;
    }
  }

  .ui.selection.visible.dropdown .menu {
    border: 2px dashed ${theme.colors.black};
  }

  .ui.selection.dropdown .menu > .item {
    border: none;
  }

  .ui.selection.active.dropdown:hover {
    border: 2px dashed ${theme.colors.black};
  }

  .ui.default.dropdown:not(.button) > .text,
  .ui.dropdown:not(.button) > .default.text {
    color: ${theme.colors.black};
  }
`;

const GetZelcoreAccountModal = ({ show, onClose, onBack }) => {
  const modalContext = useContext(ModalContext);
  const account = useContext(AccountContext);
  const { gameEditionView, closeModal } = useContext(GameEditionContext);

  const wallet = useContext(WalletContext);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [approved, setApproved] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const getAccountsFromWallet = async () => {
    setLoading(true);
    openZelcore();
    const getAccountsResponse = await getAccounts();
    console.log(getAccountsResponse);
    if (getAccountsResponse.status === 'success') {
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
    closeModal();
    setApproved(false);
  };

  const handleConnect = async () => {
    await account.setVerifiedAccount(selectedAccount);
    await wallet.signingWallet();
    await wallet.setSelectedWallet(WALLET.ZELCORE);
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
          <TopText gameEditionView={gameEditionView}>
            Follow instructions in the wallet to share your accounts
          </TopText>
          <ActionContainer gameEditionView={gameEditionView}>
            {loading ? (
              <Loader
                active
                inline='centered'
                style={{ color: '#FFFFFF' }}
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
          <BottomText gameEditionView={gameEditionView}>
            Choose Public Key you intend to use
          </BottomText>
          {gameEditionView ? (
            <DropdownContainer>
              <Dropdown
                placeholder='More'
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
            </DropdownContainer>
          ) : (
            <Dropdown
              placeholder='More'
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
          )}
          <ActionContainer gameEditionView={gameEditionView}>
            <Button.Group fluid>
              {!gameEditionView && (
                <CustomButton
                  border='none'
                  boxShadow='none'
                  background='transparent'
                  onClick={() => handleCancel()}
                >
                  Cancel
                </CustomButton>
              )}

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
