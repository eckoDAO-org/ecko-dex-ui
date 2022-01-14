import React, { useState, useContext } from 'react';
import styled from 'styled-components/macro';
import CustomButton from '../../../components/shared/CustomButton';
import { AccountContext } from '../../../contexts/AccountContext';
import { WalletContext } from '../../../contexts/WalletContext';
import { ModalContext } from '../../../contexts/ModalContext';
import GetZelcoreAccountModal from './GetZelcoreAccountModal';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { WALLET } from '../../../constants/wallet';
import { theme } from '../../../styles/theme';
import { LightModeContext } from '../../../contexts/LightModeContext';
import Label from '../../shared/Label';
import pixeledPinkBox from '../../../assets/images/game-edition/pixeled-pink-box.svg';
import GameEditionLabel from '../../game-edition-v2/shared/GameEditionLabel';

const ActionContainer = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-around;
`;

const GEGetZelcoreAccount = styled.div`
  background-image: ${`url(${pixeledPinkBox})`};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ConnectWalletZelcoreModal = ({ onConnectionSuccess }) => {
  const modalContext = useContext(ModalContext);
  const account = useContext(AccountContext);
  const wallet = useContext(WalletContext);
  const { themeMode } = useContext(LightModeContext);
  const { gameEditionView, openModal } = useContext(GameEditionContext);
  const [accountId, setAccountId] = useState('');

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
      <Label fontSize={13} geFontSize={20} geColor="yellow" geLabelStyle={{ textAlign: 'center' }}>
        Please make sure the KDA account provided is controlled by your Zelcore wallet
      </Label>
      <Label fontSize={13} geFontSize={16} geColor="blue" geLabelStyle={{ textAlign: 'center', marginBottom: 30 }}>
        When submitting a transaction, Zelcore will show you a preview within the wallet before signing
      </Label>
      {gameEditionView ? (
        <GEGetZelcoreAccount
          onClick={() =>
            openModal({
              hideOnClose: true,
              title: 'SELECT ACCOUNTS',
              content: <GetZelcoreAccountModal onConnectionSuccess={onConnectionSuccess} />,
            })
          }
        >
          <GameEditionLabel fontSize={40}>GET ZELCORE ACCOUNT</GameEditionLabel>
        </GEGetZelcoreAccount>
      ) : (
        <CustomButton
          buttonStyle={{
            border: '1px solid #424242',
          }}
          color={theme(themeMode).colors.white}
          background="transparent"
          onClick={() => {
            modalContext.openModal({
              id: 'ZELCORE_ACCOUNT',
              title: 'get zelcore accounts',
              description: 'Select Accounts',

              onBack: () => modalContext.onBackModal(),
              content: <GetZelcoreAccountModal onClose={() => modalContext.closeModal()} onBack={() => modalContext.onBackModal()} />,
            });
          }}
        >
          Get Zelcore Accounts
        </CustomButton>
      )}
      <ActionContainer>
        {!gameEditionView && (
          <>
            <CustomButton
              fluid
              border="none"
              color={`${theme(themeMode).colors.white} `}
              background="transparent"
              onClick={() => {
                handleModalBack();
              }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              fluid
              disabled={!checkKey(accountId)}
              onClick={() => {
                handleConnect();
              }}
            >
              Connect
            </CustomButton>
          </>
        )}
      </ActionContainer>
    </>
  );
};

export default ConnectWalletZelcoreModal;
