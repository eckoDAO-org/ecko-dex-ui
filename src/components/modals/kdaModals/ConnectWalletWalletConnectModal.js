import React, { useCallback } from 'react';
import CustomButton from '../../../components/shared/CustomButton';
import Label from '../../shared/Label';
import { useWalletConnect } from '../../../utils/walletConnect';
import { useAccountContext, useGameEditionContext, useModalContext } from '../../../contexts';
import GetWalletConnectAccountModal from './GetWalletConnectAccountModal';

const ConnectWalletWalletConnectModal = ({ onConnectionSuccess }) => {
  const modalContext = useModalContext();
  const { gameEditionView, openModal, closeModal, onWireSelect } = useGameEditionContext();
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
        if (responseNullable && responseNullable.accounts.length > 0) {
          if (responseNullable.accounts.length === 1) {
            await setVerifiedAccount(responseNullable.accounts[0], onConnectionSuccess);
            modalContext.closeModal();
          } else {
            if (gameEditionView) {
              openModal({
                hideOnClose: true,
                title: 'SELECT ACCOUNT',
                content: (
                  <GetWalletConnectAccountModal
                    onClose={onWalletDismiss}
                    accounts={responseNullable.accounts}
                    onConnectionSuccess={onConnectionSuccess}
                  />
                ),
              });
            } else {
              modalContext.openModal({
                id: 'WALLETCONNECT_ACCOUNT',
                title: 'WalletConnect accounts',
                description: 'Select Account',
                onBack: () => modalContext.onBackModal(),
                content: (
                  <GetWalletConnectAccountModal accounts={responseNullable.accounts} onClose={modalContext.closeModal} onBack={onWalletDismiss} />
                ),
              });
            }
          }
        } else {
          onWalletDismiss();
        }
      })
      .catch(onWalletDismiss);
  }, [gameEditionView, onWalletDismiss, openModal, setVerifiedAccount, modalContext, onConnectionSuccess, connectWallet]);

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
