import React, { useCallback } from 'react';
import CustomButton from '../../../components/shared/CustomButton';
import Label from '../../shared/Label';
import { useWalletConnect } from '../../../utils/walletConnect';
import { useAccountContext, useGameEditionContext, useModalContext } from '../../../contexts';

const ConnectWalletWalletConnectModal = ({ onConnectionSuccess }) => {
  const modalContext = useModalContext();
  const { gameEditionView, closeModal, onWireSelect } = useGameEditionContext();
  const { account, setVerifiedAccount } = useAccountContext();
  const { connectWallet } = useWalletConnect();

  const onWalletDismiss = useCallback(() => {
    if (gameEditionView) {
      if (!account.account) {
        onWireSelect(null);
      } else {
        closeModal();
      }
    } else {
      modalContext.onBackModal();
    }
  }, [gameEditionView, account, onWireSelect, closeModal, modalContext]);

  const onConnectWallet = useCallback(() => {
    connectWallet()
      .then(async (responseNullable) => {
          console.log('responseNullable', responseNullable)
        if (responseNullable && responseNullable.accounts.length > 0) {
          await setVerifiedAccount(responseNullable.accounts[0], onConnectionSuccess);
          modalContext.closeModal();
        } else {
          onWalletDismiss();
        }
      })
      .catch(onWalletDismiss);
  }, [onWalletDismiss, setVerifiedAccount, modalContext, onConnectionSuccess, connectWallet]);

  return (
    <>
      <Label fontSize={13} geFontSize={20} geColor="yellow" geLabelStyle={{ textAlign: 'center' }}>
        Please make sure the KDA account provided is controlled by your wallet which has support for WalletConnect
      </Label>
      <Label fontSize={13} geFontSize={16} geColor="blue" geLabelStyle={{ textAlign: 'center', marginBottom: 30 }}>
        When submitting a transaction, WalletConnect will show you a preview within the wallet before signing
      </Label>
      <CustomButton geType="pink" geLabel="CONNECT" onClick={onConnectWallet}>
        Connect
      </CustomButton>
    </>
  );
};

export default ConnectWalletWalletConnectModal;
