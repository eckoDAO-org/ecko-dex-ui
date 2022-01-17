import React, { useState, useEffect, useContext } from 'react';
/* import "./App.css"; */
import TorusSdk from '@toruslabs/torus-direct-web-sdk';
import Pact from 'pact-lang-api';
import styled from 'styled-components/macro';
import { AccountContext } from '../../../contexts/AccountContext';
import { WalletContext } from '../../../contexts/WalletContext';
import CustomButton from '../../../components/shared/CustomButton';
import { ModalContext } from '../../../contexts/ModalContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { WALLET } from '../../../constants/wallet';
import { theme } from '../../../styles/theme';
import { LightModeContext } from '../../../contexts/LightModeContext';
import LogoLoader from '../../../components/shared/LogoLoader';
import GameEditionLabel from '../../game-edition-v2/components/GameEditionLabel';
import pixeledPinkBox from '../../../assets/images/game-edition/pixeled-box-pink.svg';
import Label from '../../shared/Label';

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

const ButtonContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 24px;
  margin-top: 30px;
`;

const GOOGLE = 'google';

const verifierMap = {
  [GOOGLE]: {
    name: 'Google',
    typeOfLogin: 'google',
    verifier: process.env.REACT_APP_TORUS_VERIFIER,
    clientId: process.env.REACT_APP_TORUS_GOOGLE_CLIENT_ID,
  },
};
/* const createAPIHost = (network, chainId) => `https://${network}.testnet.chainweb.com/chainweb/0.0/testnet02/chain/${chainId}/pact` */

function ConnectWalletTorusModal({ onClose, onConnectionSuccess }) {
  const modalContext = useContext(ModalContext);
  const account = useContext(AccountContext);
  const wallet = useContext(WalletContext);
  const { themeMode } = useContext(LightModeContext);

  const { gameEditionView, closeModal } = useContext(GameEditionContext);
  const [torusdirectsdk, setTorusdirectsdk] = useState(null);
  const [, setConsoleText] = useState('');
  const [, setPublicKey] = useState('');
  const [, setPrivateKey] = useState('');
  const [, setUserName] = useState('');
  const [, setDataRetrieved] = useState(false);
  const [, setLoginClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const torusdirectsdk = new TorusSdk({
          baseUrl: `${window.location.origin}/serviceworker`,
          enableLogging: true,
          redirectToOpener: true,
          network: process.env.REACT_APP_TORUS_NETWORK, // details for test net
        });

        await torusdirectsdk.init({ skipSw: true });

        setTorusdirectsdk(torusdirectsdk);
      } catch (error) {
        console.error(error, 'mounted caught');
      }
    };
    init();
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setLoginClicked(true);
    setLoading(true);
    /* const selectedVerifier = selectedVerifier;
    const { selectedVerifier, torusdirectsdk } = state; */

    try {
      const { typeOfLogin, clientId, verifier } = verifierMap[GOOGLE];
      const loginDetails = await torusdirectsdk.triggerLogin({
        typeOfLogin,
        verifier,
        clientId,
      });
      setConsoleText(typeof loginDetails === 'object' ? JSON.stringify(loginDetails) : loginDetails);

      setUserName(loginDetails?.userInfo?.name);

      const keyPair = Pact.crypto.restoreKeyPairFromSecretKey(loginDetails.privateKey);

      setPublicKey(keyPair.publicKey);
      setPrivateKey(keyPair.secretKey);

      await account.setVerifiedAccount(keyPair.publicKey, onConnectionSuccess);

      await wallet.storePrivKey(keyPair.secretKey);
      await wallet.setSelectedWallet(WALLET.TORUS);

      // const balance = await getBalance("coin", keyPair.publicKey);
      // setAccountBalance(balance[0]);
      setDataRetrieved(true);
      setLoading(false);
      onClose();
      closeModal();
    } catch (error) {
      console.error(error, 'login caught');
      setLoginClicked(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Label fontSize={13} geFontSize={20} geColor="yellow" geLabelStyle={{ textAlign: 'center' }}>
        Please press 'Connect with Torus' in order to access your wallet with Torus.
      </Label>
      <Label fontSize={13} geFontSize={16} geColor="blue" geLabelStyle={{ textAlign: 'center', marginBottom: 30, padding: '0 16px' }}>
        When submitting a transaction, you will sign it through Torus.
      </Label>
      {gameEditionView ? (
        <GEGetZelcoreAccount>
          <GameEditionLabel fontSize={40} onClick={login}>
            CONNECT WITH TORUS
          </GameEditionLabel>
        </GEGetZelcoreAccount>
      ) : (
        <ButtonContainer gameEditionView={gameEditionView}>
          <CustomButton disabled={loading} onClick={login}>
            Connect with Torus
          </CustomButton>
        </ButtonContainer>
      )}
      {!gameEditionView && (
        <ButtonContainer style={{ marginTop: '10px' }}>
          <CustomButton
            disabled={loading}
            border="none"
            color={theme(themeMode).colors.white}
            background="transparent"
            onClick={() => {
              modalContext.onBackModal();
            }}
          >
            Cancel
          </CustomButton>
        </ButtonContainer>
      )}
      {loading && <LogoLoader />}
    </>
  );
}

export default ConnectWalletTorusModal;
