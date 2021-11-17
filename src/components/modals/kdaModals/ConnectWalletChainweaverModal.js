import React, { useState, useContext } from 'react';
import styled from 'styled-components/macro';
import CustomButton from '../../../shared/CustomButton';
import Input from '../../../shared/Input';
import { Button } from 'semantic-ui-react';
import { AccountContext } from '../../../contexts/AccountContext';
import { WalletContext } from '../../../contexts/WalletContext';
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
  margin-top: 0;
`;

const ConnectWalletChainweaverModal = ({ show, onClose, onBack }) => {
  const account = useContext(AccountContext);
  const wallet = useContext(WalletContext);
  const { gameEditionView } = useContext(GameEditionContext);
  const [accountId, setAccountId] = useState('');
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
    onClose();
  };

  const handleConnect = async () => {
    await account.setVerifiedAccount(accountId);
    await wallet.signingWallet();
    await wallet.setSelectedWallet(WALLET.CHAINWEAVER);

    handleModalClose();
  };

  return (
    <>
      <Text gameEditionView={gameEditionView}>
        Please make sure the KDA account provided is controlled by your
        Chainweaver wallet.
      </Text>
      <Text gameEditionView={gameEditionView}>
        When submitting a transaction, Chainweaver will show you a preview
        within the wallet before signing.
      </Text>
      <Input
        topLeftLabel={'Account'}
        placeholder='Insert your Account'
        value={accountId}
        error={accountId !== '' ? !checkKey(accountId) : false}
        onChange={async (e, { value }) => {
          setAccountId(value);
        }}
      />
      <ActionContainer>
        <Button.Group fluid>
          <CustomButton
            border='none'
            color='#fff'
            background='transparent'
            onClick={() => {
              resetValues();
            }}
          >
            Cancel
          </CustomButton>
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

export default ConnectWalletChainweaverModal;
