import React, { useState, useEffect, useContext } from 'react';
/* import "./App.css"; */
import TorusSdk from '@toruslabs/torus-direct-web-sdk';
import Pact from 'pact-lang-api';
import { AccountContext } from '../../../contexts/AccountContext';
import { WalletContext } from '../../../contexts/WalletContext';
import CustomButton from '../../../components/shared/CustomButton';
import { ModalContext } from '../../../contexts/ModalContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { WALLET } from '../../../constants/wallet';
import LogoLoader from '../../shared/Loader';
import Label from '../../shared/Label';
import browserDetection from '../../../utils/browserDetection';
import { Loader } from 'semantic-ui-react';
import { theme } from '../../../styles/theme';
import { useApplicationContext } from '../../../contexts';

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
  const { themeMode } = useApplicationContext();
  const modalContext = useContext(ModalContext);
  const account = useContext(AccountContext);
  const wallet = useContext(WalletContext);

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

      <CustomButton geType="pink" geLabel="CONNECT WITH TORUS" disabled={loading} onClick={login}>
        Connect with Torus
      </CustomButton>

      {!gameEditionView && (
        <CustomButton
          disabled={loading}
          type="basic"
          onClick={() => {
            modalContext.onBackModal();
          }}
        >
          Cancel
        </CustomButton>
      )}
      {loading && (
        <>
          {browserDetection() === 'SAFARI' ? (
            <Loader
              active
              inline="centered"
              style={{
                color: theme(themeMode).colors.white,
                fontFamily: gameEditionView ? theme(themeMode).fontFamily.pixeboy : theme(themeMode).fontFamily.regular,
              }}
            />
          ) : (
            <LogoLoader />
          )}
        </>
      )}
    </>
  );
}

export default ConnectWalletTorusModal;
