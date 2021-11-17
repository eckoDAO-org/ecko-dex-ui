import React, { useState, useContext } from 'react';
import styled from 'styled-components/macro';
import { Button } from 'semantic-ui-react';
import CustomButton from '../../../shared/CustomButton';
import { AccountContext } from '../../../contexts/AccountContext';
import { WalletContext } from '../../../contexts/WalletContext';
import { ModalContext } from '../../../contexts/ModalContext';
import GetZelcoreAccountModal from './GetZelcoreAccountModal';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { WALLET } from '../../../constants/wallet';

const Text = styled.span`
  font-size: 13px;
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular};
  text-align: ${({ gameEditionView }) => (gameEditionView ? 'left' : 'center')};
`;

const ActionContainer = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-around;
`;

const ConnectWalletZelcoreModal = ({ onClose, onBack }) => {
  const modalContext = useContext(ModalContext);
  const account = useContext(AccountContext);
  const wallet = useContext(WalletContext);
  const { gameEditionView, openModal } = useContext(GameEditionContext);
  const [accountId, setAccountId] = useState('');
  const [openGetZelcoreAccountModal, setOpenGetZelcoreAccountModal] =
    useState(false);

  const is_hexadecimal = (str) => {
    const regexp = /^[0-9a-fA-F]+$/;
    if (regexp.test(str)) return true;
    else return false;
  };

  const checkKey = (key) => {
    try {
      if (key.length !== 64) {
        return false;
      } else if (!is_hexadecimal(key)) {
        return false;
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const resetValues = () => {
    setAccountId('');
  };

  const handleModalClose = () => {
    resetValues();
    modalContext.closeModal();
  };

  const handleModalBack = () => {
    resetValues();
    modalContext.onBackModal();
  };

  const handleConnect = async () => {
    await account.setVerifiedAccount(accountId);
    await wallet.signingWallet();
    await wallet.setSelectedWallet(WALLET.ZELCORE);

    // if (response !== "success") {
    //   setError({ message: "Account does not exist!" });
    // } else {
    //   handleModalClose();
    // }

    handleModalClose();
  };

  return (
    <>
      <Text gameEditionView={gameEditionView}>
        Please make sure the KDA account provided is controlled by your Zelcore
        wallet
      </Text>
      <Text gameEditionView={gameEditionView}>
        When submitting a transaction, Zelcore will show you a preview within
        the wallet before signing
      </Text>
      {/* <Input
                    topLeftLabel={"Account"}
                    placeholder="Insert your Account ID"
                    value={accountId}
                    error={accountId !== "" ? !checkKey(accountId) : false}
                    onChange={async (e, { value }) => {
                      setAccountId(value);
                    }}
                  /> */}
      {/* {error && error.message ? <Text>{error.message}</Text> : null} */}
      <CustomButton
        buttonStyle={{
          border: '1px solid #424242',
        }}
        color='#fff'
        background='transparent'
        onClick={() => {
          if (gameEditionView) {
            openModal({
              title: 'get zelcore accounts',
              description: 'Select Accounts',
              content: (
                <GetZelcoreAccountModal
                  onClose={() => modalContext.closeModal()}
                />
              ),
            });
          } else {
            setOpenGetZelcoreAccountModal(true);
            modalContext.openModal({
              id: 'ZELCORE_ACCOUNT',
              title: 'get zelcore accounts',
              description: 'Select Accounts',
              open: openGetZelcoreAccountModal,
              content: (
                <GetZelcoreAccountModal
                  onClose={() => modalContext.closeModal()}
                />
              ),
            });
          }
        }}
      >
        Get Zelcore Accounts
      </CustomButton>
      <ActionContainer>
        <Button.Group fluid>
          {!gameEditionView ? (
            <CustomButton
              border='none'
              color='#fff'
              background='transparent'
              onClick={() => {
                handleModalBack();
              }}
            >
              Cancel
            </CustomButton>
          ) : null}

          <CustomButton
            disabled={!checkKey(accountId)}
            onClick={() => {
              handleConnect();
            }}
          >
            Connect
          </CustomButton>
        </Button.Group>
      </ActionContainer>
    </>
  );
};

export default ConnectWalletZelcoreModal;
