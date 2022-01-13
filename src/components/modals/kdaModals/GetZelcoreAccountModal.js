import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import CustomButton from '../../../components/shared/CustomButton';
import { Dropdown } from 'semantic-ui-react';
import reduceToken from '../../../utils/reduceToken';
import { AccountContext } from '../../../contexts/AccountContext';
import { ModalContext } from '../../../contexts/ModalContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { commonTheme, theme } from '../../../styles/theme';
import { getAccounts, openZelcore } from '../../../utils/zelcore';
import { WalletContext } from '../../../contexts/WalletContext';
import { WALLET } from '../../../constants/wallet';
import { LightModeContext } from '../../../contexts/LightModeContext';
import LogoLoader from '../../../components/shared/LogoLoader';
import Label from '../../shared/Label';
import { GeArrowIcon, GeCancelButtonIcon, GeConfirmButtonIcon, GeRetryButtonIcon } from '../../../assets';

const ActionContainer = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 100%;
  margin-top: ${({ gameEditionView }) => !gameEditionView && '16px'};
`;

const ZelcoreModalContent = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const DropdownContainer = styled.div`
  svg {
    transform: rotate(90deg);
    path {
      fill: #ffffff;
    }
  }
  .ui.selection.dropdown {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    border: 2px dashed ${({ theme: { colors } }) => colors.white};
    color: #ffffff;
    background-color: #000000e6;
  }

  .ui.selection.dropdown .menu {
    margin-top: 10px !important;
    background-color: #000000e6;
    border: 2px dashed ${({ theme: { colors } }) => colors.white};
    max-height: fit-content;
    @media (min-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel}px`}) {
      max-height: 8em;
    }
  }

  .ui.selection.visible.dropdown .menu {
    border: 2px dashed ${({ theme: { colors } }) => colors.white};
    max-height: 100px;
  }

  .ui.selection.dropdown .menu > .item {
    border: none;
    color: #ffffff;
    font-family: ${({ theme: { fontFamily } }) => fontFamily.pixeboy};
    font-size: 30px;
    padding: 10px !important;
  }

  .ui.selection.active.dropdown:hover {
    border: 2px dashed ${({ theme: { colors } }) => colors.white};
  }

  .ui.default.dropdown:not(.button) > .text,
  .ui.dropdown:not(.button) > .default.text {
    color: ${({ theme: { colors } }) => colors.white};
  }
`;

const GetZelcoreAccountModal = ({ show, onClose, onBack }) => {
  const modalContext = useContext(ModalContext);
  const { account, setVerifiedAccount } = useContext(AccountContext);
  const { gameEditionView, closeModal, onWireSelect } = useContext(GameEditionContext);
  const { themeMode } = useContext(LightModeContext);

  const wallet = useContext(WalletContext);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [approved, setApproved] = useState(false);

  const getAccountsFromWallet = async () => {
    setLoading(true);
    openZelcore();
    const getAccountsResponse = await getAccounts();
    console.log(getAccountsResponse);
    if (getAccountsResponse.status === 'success') {
      setApproved(true);
      setAccounts(getAccountsResponse.data);
    } else {
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

  const handleModalClose = async () => {
    if (onClose) {
      onClose();
    }
    if (account?.account) {
      await closeModal();
    }
    setApproved(false);
  };

  const handleConnect = async () => {
    await setVerifiedAccount(selectedAccount);
    await wallet.signingWallet();
    await wallet.setSelectedWallet(WALLET.ZELCORE);
    await handleModalClose();
  };

  const handleCancel = () => {
    setSelectedAccount(null);
    if (gameEditionView) {
      onWireSelect(null);
    } else {
      modalContext.onBackModal();
    }
  };

  return (
    <>
      {!approved ? (
        <>
          <Label fontSize={13} geFontSize={20} geColor="yellow" geLabelStyle={{ textAlign: 'center', padding: '0 14px' }}>
            Follow instructions in the wallet to share your zelcore accounts
          </Label>

          <ActionContainer gameEditionView={gameEditionView} style={{ justifyContent: 'center' }}>
            {loading ? (
              <LogoLoader />
            ) : (
              <CustomButton
                buttonStyle={{ width: gameEditionView && '100%' }}
                disableGameEditionPadding
                onClick={() => {
                  getAccountsFromWallet();
                }}
              >
                {gameEditionView ? <GeRetryButtonIcon /> : 'Retry'}
              </CustomButton>
            )}
          </ActionContainer>
        </>
      ) : (
        <ZelcoreModalContent>
          <Label
            fontSize={13}
            labelStyle={{ marginBottom: 16 }}
            geFontSize={20}
            geColor="yellow"
            geLabelStyle={{ textAlign: 'center', display: 'block', marginBottom: 16 }}
          >
            Choose Public Key you intend to use
          </Label>
          {gameEditionView ? (
            <DropdownContainer>
              <Dropdown
                placeholder="More"
                fluid
                selection
                closeOnChange
                style={{ fontFamily: commonTheme.fontFamily.pixeboy, fontSize: 30 }}
                icon={<GeArrowIcon />}
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
              placeholder="More"
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
            <CustomButton
              disableGameEditionPadding
              fluid={!gameEditionView}
              border="none"
              boxShadow="none"
              color={theme(themeMode).colors.white}
              background="transparent"
              onClick={() => handleCancel()}
            >
              {gameEditionView ? <GeCancelButtonIcon /> : 'Cancel'}
            </CustomButton>

            <CustomButton disableGameEditionPadding fluid={!gameEditionView} disabled={!selectedAccount} onClick={async () => await handleConnect()}>
              {gameEditionView ? <GeConfirmButtonIcon /> : 'Cancel'}
            </CustomButton>
          </ActionContainer>
        </ZelcoreModalContent>
      )}
    </>
  );
};

export default GetZelcoreAccountModal;
