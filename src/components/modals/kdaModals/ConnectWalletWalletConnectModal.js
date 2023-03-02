import React, { useCallback } from 'react';
import CustomButton from '../../../components/shared/CustomButton';
import Label from '../../shared/Label';
import { useAccountContext, useGameEditionContext, useModalContext, useWalletConnectContext } from '../../../contexts';
import GetWalletConnectAccountModal from './GetWalletConnectAccountModal';

const ConnectWalletWalletConnectModal = ({ onConnectionSuccess }) => {
  const modalContext = useModalContext();
  const { gameEditionView, openModal, closeModal, onWireSelect } = useGameEditionContext();
  const { account, setVerifiedAccount } = useAccountContext();
  const { connectWallet } = useWalletConnectContext();

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
                  <GetWalletConnectAccountModal
                    accounts={responseNullable.accounts}
                    onClose={modalContext.closeModal}
                    onConnectionSuccess={onConnectionSuccess}
                  />
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
      <div>
        <Label className="flex column" fontSize={13} geFontSize={20} geColor="yellow" geLabelStyle={{ textAlign: 'center' }}>
          <span>
            Please carefully read the information on our{' '}
            <a href={`https://docs.ecko.finance/eckodex/getting-started/eckowallet/walletconnect`} target="_blank" rel="noopener noreferrer">
              documentation
            </a>{' '}
            when connecting your iOS or Android mobile device to the eckoDEX, either using a Connection Code, or a QR Code.
          </span>
        </Label>
      </div>
      <Label fontSize={13} geFontSize={16} geColor="blue" geLabelStyle={{ textAlign: 'center', marginBottom: 30 }}>
        Important:
        <br />
        Please make the KDA account provided is controlled by your eckoWALLET mobile App which has support for WalletConnect. When submitting a
        transaction, WalletConnect will show you a preview within your eckoWALLET mobile App before signing.
      </Label>
      <CustomButton geType="pink" geLabel="CONNECT" onClick={onConnectWallet}>
        Connect
      </CustomButton>
    </>
  );
};

export default ConnectWalletWalletConnectModal;
