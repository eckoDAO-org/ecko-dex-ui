import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import CustomButton from '../../../components/shared/CustomButton';
import { Dropdown } from 'semantic-ui-react';
import reduceToken from '../../../utils/reduceToken';
import { commonTheme } from '../../../styles/theme';
import { getAccounts, openZelcore } from '../../../utils/zelcore';
import LogoLoader from '../../shared/Loader';
import Label from '../../shared/Label';
import { GeArrowIcon } from '../../../assets';
import { useAccountContext, useGameEditionContext, useModalContext } from '../../../contexts';

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
    border: 2px dashed #ffffff;
    color: #ffffff;
    background-color: #000000e6;
  }

  .ui.selection.dropdown .menu {
    margin-top: 10px !important;
    background-color: #000000e6;
    border: 2px dashed #ffffff;
    max-height: fit-content;
    @media (min-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel}px`}) {
      max-height: 8em;
    }
  }

  .ui.selection.visible.dropdown .menu {
    border: 2px dashed #ffffff;
    max-height: 120px;
  }

  .ui.selection.dropdown .menu > .item {
    border: none;
    color: #ffffff;
    font-family: ${({ theme: { fontFamily } }) => fontFamily.pixeboy};
    font-size: 20px;
    padding: 10px !important;
  }

  .ui.selection.active.dropdown:hover {
    border: 2px dashed #ffffff;
  }

  .ui.default.dropdown:not(.button) > .text,
  .ui.dropdown:not(.button) > .default.text {
    color: #ffffff;
  }
`;

const CustomDropdown = styled.div`
  .ui.selection.dropdown {
    padding-right: 1em !important;
  }

  .ui.selection.visible.dropdown .menu {
    position: unset;
    top: unset;
    border: none;
  }

  .ui.selection.dropdown .menu > .item {
    border: none;
    padding-left: 0 !important;
    padding-right: 0 !important;

    &:first-child {
      padding-top: 1.5rem !important;
    }
  }
`;

const GetZelcoreAccountModal = ({ onClose, onConnectionSuccess }) => {
  const modalContext = useModalContext();
  const { account, setVerifiedAccount } = useAccountContext();
  const { gameEditionView, closeModal, onWireSelect } = useGameEditionContext();

  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [approved, setApproved] = useState(false);

  const getAccountsFromWallet = async () => {
    setLoading(true);
    openZelcore();
    const getAccountsResponse = await getAccounts();
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

    setApproved(false);
  };

  const handleConnect = async () => {
    await setVerifiedAccount(selectedAccount, onConnectionSuccess);

    await handleModalClose();
  };

  const handleCancel = () => {
    setSelectedAccount(null);
    if (gameEditionView) {
      if (!account.account) {
        onWireSelect(null);
      } else {
        closeModal();
      }
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
                geType="retry"
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
                style={{ fontFamily: commonTheme.fontFamily.pixeboy, fontSize: 20, alignItems: 'center' }}
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
            <CustomDropdown>
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
            </CustomDropdown>
          )}
          <ActionContainer gameEditionView={gameEditionView}>
            <CustomButton type="basic" geType="cancel" fluid onClick={() => handleCancel()}>
              Cancel
            </CustomButton>

            <CustomButton fluid geType="confirm" disabled={!selectedAccount} onClick={async () => await handleConnect()}>
              Connect
            </CustomButton>
          </ActionContainer>
        </ZelcoreModalContent>
      )}
    </>
  );
};

export default GetZelcoreAccountModal;
