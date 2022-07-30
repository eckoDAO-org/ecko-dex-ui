import React from 'react';
import CustomButton from '../../../components/shared/CustomButton';
import GetZelcoreAccountModal from './GetZelcoreAccountModal';
import Label from '../../shared/Label';
import { useGameEditionContext, useModalContext } from '../../../contexts';

const ConnectWalletZelcoreModal = ({ onConnectionSuccess }) => {
  const modalContext = useModalContext();
  const { gameEditionView, openModal } = useGameEditionContext();

  return (
    <>
      <Label fontSize={13} geFontSize={20} geColor="yellow" geLabelStyle={{ textAlign: 'center' }}>
        Please make sure the KDA account provided is controlled by your Zelcore wallet
      </Label>
      <Label fontSize={13} geFontSize={16} geColor="blue" geLabelStyle={{ textAlign: 'center', marginBottom: 30 }}>
        When submitting a transaction, Zelcore will show you a preview within the wallet before signing
      </Label>

      <CustomButton
        geType="pink"
        geLabel="SELECT ACCOUNTS"
        onClick={() => {
          if (gameEditionView) {
            openModal({
              hideOnClose: true,
              title: 'SELECT ACCOUNTS',
              content: <GetZelcoreAccountModal onConnectionSuccess={onConnectionSuccess} />,
            });
          } else {
            modalContext.openModal({
              id: 'ZELCORE_ACCOUNT',
              title: 'get zelcore accounts',
              description: 'Select Accounts',

              onBack: () => modalContext.onBackModal(),
              content: <GetZelcoreAccountModal onClose={() => modalContext.closeModal()} onBack={() => modalContext.onBackModal()} />,
            });
          }
        }}
      >
        Get Zelcore Accounts
      </CustomButton>
    </>
  );
};

export default ConnectWalletZelcoreModal;
