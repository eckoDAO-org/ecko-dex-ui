import React, { useCallback, useState } from 'react';
import CustomButton from '../../../components/shared/CustomButton';
import Label from '../../shared/Label';
import AppLoader from '../../shared/AppLoader';
import { NETWORKID } from '../../../constants/contextConstants';
import { useAccountContext, useGameEditionContext, useModalContext, useWalletConnectContext } from '../../../contexts';
import GetWalletConnectAccountModal from './GetWalletConnectAccountModal';

const ConnectWalletWalletConnectModal = ({ onConnectionSuccess }) => {
  const [isGettingAccounts, setIsGettingAccounts] = useState(false);
  const modalContext = useModalContext();
  const { gameEditionView, openModal, closeModal, onWireSelect } = useGameEditionContext();
  const { account, setVerifiedAccount } = useAccountContext();
  const { connectWallet, requestGetAccounts } = useWalletConnectContext();

  const onWalletDismiss = useCallback(
    (err) => {
      console.log(`onWalletDismiss err:`, err);
      setIsGettingAccounts(false);
      if (gameEditionView) {
        if (!account.account) {
          onWireSelect(null);
        } else {
          closeModal();
        }
      } else {
        modalContext.onBackModal();
      }
    },
    [gameEditionView, account, onWireSelect, closeModal, modalContext]
  );

  const onConnectWallet = useCallback(() => {
    connectWallet()
      .then(async (responseNullable) => {
        if (responseNullable && responseNullable.accounts.length > 0) {
          setIsGettingAccounts(true);
          const wcAccounts = await requestGetAccounts(
            NETWORKID,
            responseNullable.accounts.map((a) => ({ account: a })),
            responseNullable.topic
          );
          setIsGettingAccounts(false);
          // call getAccounts
          const resultAccounts = [];
          wcAccounts.accounts.forEach((wcAcc) => wcAcc.kadenaAccounts.forEach((kAcc) => resultAccounts.push(kAcc.name)));

          if (resultAccounts.length === 1) {
            await setVerifiedAccount(resultAccounts[0], onConnectionSuccess);
            modalContext.closeModal();
          } else {
            if (gameEditionView) {
              openModal({
                hideOnClose: true,
                title: 'SELECT ACCOUNT',
                content: (
                  <GetWalletConnectAccountModal onClose={onWalletDismiss} accounts={resultAccounts} onConnectionSuccess={onConnectionSuccess} />
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
                    accounts={resultAccounts}
                    onClose={modalContext.closeModal}
                    onConnectionSuccess={onConnectionSuccess}
                  />
                ),
              });
            }
          }
        } else {
          onWalletDismiss();
          setIsGettingAccounts(false);
        }
      })
      .catch(onWalletDismiss);
  }, [gameEditionView, onWalletDismiss, openModal, setVerifiedAccount, modalContext, onConnectionSuccess, connectWallet]);

  return (
    <>
      {isGettingAccounts ? (
        <AppLoader className="h-100 w-100 align-ce justify-ce" />
      ) : (
        <>
          <div>
            <Label className="flex column" fontSize={13} geFontSize={20} geColor="yellow" geLabelStyle={{ textAlign: 'center' }}>
              <span>
                Please carefully read the information on our{' '}
                <a href={`https://docs.ecko.finance/eckodao/getting-started/eckowallet/walletconnect`} target="_blank" rel="noopener noreferrer">
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
      )}
    </>
  );
};

export default ConnectWalletWalletConnectModal;
