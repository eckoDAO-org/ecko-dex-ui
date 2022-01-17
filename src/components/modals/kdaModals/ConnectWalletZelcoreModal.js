import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import CustomButton from '../../../components/shared/CustomButton';
import { ModalContext } from '../../../contexts/ModalContext';
import GetZelcoreAccountModal from './GetZelcoreAccountModal';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { theme } from '../../../styles/theme';
import { LightModeContext } from '../../../contexts/LightModeContext';
import Label from '../../shared/Label';
import pixeledPinkBox from '../../../assets/images/game-edition/pixeled-box-pink.svg';
import GameEditionLabel from '../../game-edition-v2/components/GameEditionLabel';

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
  const { themeMode } = useContext(LightModeContext);
  const { gameEditionView, openModal } = useContext(GameEditionContext);

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
    </>
  );
};

export default ConnectWalletZelcoreModal;
