import React, { useEffect, useState } from 'react';
import Pact from 'pact-lang-api';
import { createPairCommand, getPairModuleDetails } from '../../api/pairs';
import { CHAIN_ID, NETWORK } from '../../constants/contextConstants';
import {
  useAccountContext,
  useApplicationContext,
  useKaddexWalletContext,
  useModalContext,
  useNotificationContext,
  usePactContext,
} from '../../contexts';
import { theme } from '../../styles/theme';
import CustomButton from '../shared/CustomButton';
import { FlexContainer } from '../shared/FlexContainer';
import Input from '../shared/Input';
import Label from '../shared/Label';
import CommonWrapper from '../stake/CommonWrapper';
import CreatePoolModal from '../modals/liquidity/CreatePairModal';
import { mkReq, parseRes } from '../../api/utils';
import CreatePairTokenSelectorModal from '../modals/liquidity/CreatePairTokenSelectorModal';
import { ArrowBack, ArrowDown } from '../../assets';
import { ROUTE_LIQUIDITY_TOKENS } from '../../router/routes';
import { useHistory } from 'react-router-dom';

const CreatePairContainer = () => {
  const history = useHistory();
  const [token0, setToken0] = useState('coin');
  const [token1, setToken1] = useState('');
  const [token0Name, setToken0Name] = useState('KDA');
  const [token1Name, setToken1Name] = useState('');
  const [createPairAvailable, setCreatePairAvailable] = useState(false);
  const { account } = useAccountContext();
  const { openModal, closeModal } = useModalContext();
  const pact = usePactContext();
  const { isConnected: isKaddexWalletConnected, requestSign: kaddexWalletRequestSign } = useKaddexWalletContext();
  const { showNotification, STATUSES, pollingNotif, showErrorNotification, transactionListen } = useNotificationContext();
  const { themeMode } = useApplicationContext();

  const signCommand = async (cmd) => {
    if (isKaddexWalletConnected) {
      const res = await kaddexWalletRequestSign(cmd);
      return res.signedCmd;
    } else {
      return await Pact.wallet.sign(cmd);
    }
  };

  useEffect(() => {
    if (token1 !== '') {
      fetchData();
    }
  }, [token1]);

  const fetchData = async () => {
    const result = await getPairModuleDetails(token1, account.account);
    console.log('🚀 log --> result', result);
    if (!result.errorMessage) {
      setCreatePairAvailable(true);
    }
  };

  const onCreatePair = async () => {
    const command = await createPairCommand(
      token0,
      token1,
      '',
      pact.enableGasStation,
      pact.gasConfiguration.gasLimit,
      pact.gasConfiguration.gasPrice,
      account
    );
    console.log('🚀 log --> command', command);
    if (!command) {
      showNotification({
        title: 'Invalid Action',
        message: `Make sure you have KDX account on chain ${CHAIN_ID}`,
        type: STATUSES.WARNING,
        autoClose: 5000,
        hideProgressBar: false,
      });
      return;
    }
    const signedCommand = await signCommand(command);
    console.log('🚀 log --> signedCommand', signedCommand);
    if (!signedCommand) {
      return;
    }
    let data = await fetch(`${NETWORK}/api/v1/local`, mkReq(signedCommand));
    data = await parseRes(data);
    console.log('🚀 log --> data', data);
    if (data.message?.status !== 'success') {
      showNotification({
        title: 'Staking error',
        message: 'Error while creating the pair',
        type: STATUSES.ERROR,
        autoClose: 5000,
        hideProgressBar: false,
      });
      return;
    } else {
      openModal({
        title: 'Create pair',
        description: '',
        onClose: () => {
          closeModal();
        },
        content: (
          <CreatePoolModal
            data={data}
            token0={token0}
            token1={token1}
            onConfirm={() => {
              closeModal();
              sendCreatePairCommand(signedCommand);
            }}
          />
        ),
      });
    }
  };

  const sendCreatePairCommand = async (signedCommand) => {
    pact.setPolling(true);
    Pact.wallet
      .sendSigned(signedCommand, NETWORK)
      .then(async (createPairResponse) => {
        pollingNotif(createPairResponse.requestKeys[0], 'Staking Transaction Pending');

        await transactionListen(createPairResponse.requestKeys[0]);
        pact.setPolling(false);
      })
      .catch((error) => {
        console.log(`~ error`, error);
        pact.setPolling(false);
        showErrorNotification(null, 'Staking error', 'Generic add stake error');
      });
  };

  const onSelectedToken = async (token, tokenName) => {
    await setToken1(token);
    await setToken1Name(tokenName);
  };

  const handleTokenSelector = () => {
    openModal({
      title: 'Add Token',
      description: '',
      onClose: () => {
        setToken1('');
        closeModal();
      },
      content: (
        <CreatePairTokenSelectorModal
          onSelectedToken={onSelectedToken}
          onClose={() => {
            closeModal();
          }}
        />
      ),
    });
  };

  const getButtonLabel = () => {
    if (token0 === '' || token1 === '') return 'Insert pair';
    else if (!createPairAvailable) return 'No balance';
    return 'Create pair';
  };
  return (
    <FlexContainer
      className="column align-ce w-100 h-100 main"
      desktopStyle={{ paddingRight: theme().layout.desktopPadding, paddingLeft: theme().layout.desktopPadding }}
      tabletStyle={{ paddingRight: theme().layout.tabletPadding, paddingLeft: theme().layout.tabletPadding }}
      mobileStyle={{ paddingRight: theme().layout.mobilePadding, paddingLeft: theme().layout.mobilePadding }}
    >
      <FlexContainer>
        <ArrowBack
          className="arrow-back"
          style={{
            cursor: 'pointer',
            marginRight: '15px',
            justifyContent: 'center',
          }}
          onClick={() => {
            history.push(ROUTE_LIQUIDITY_TOKENS);
          }}
        />
        <Label fontSize={24} fontFamily="syncopate">
          CREATE PAIR
        </Label>
      </FlexContainer>
      <CommonWrapper containerStyle={{ maxWidth: 550 }}>
        <FlexContainer className="justify-ce column" gap={16} style={{ padding: '0px 36px 36px' }}>
          <Label>Select pair</Label>
          <FlexContainer className="justify-ce" gap={24}>
            <FlexContainer className="column" gap={16}>
              <CustomButton
                type="basic"
                geBasic
                fontFamily="basier"
                buttonStyle={{
                  justifyContent: 'space-between',
                  background: `${theme(themeMode).colors.white}33`,
                  borderRadius: '20px',
                  padding: '10px 30px',
                  marginRight: 0,
                  height: '40px',
                }}
              >
                <Label fontSize={13}>{token0Name}</Label>

                <ArrowDown style={{ marginRight: 0, marginLeft: 8 }} />
              </CustomButton>
              <Label labelStyle={{ alignSelf: 'center' }}>{token0}</Label>
            </FlexContainer>
            <FlexContainer className="column" gap={16}>
              <CustomButton
                type="basic"
                geBasic
                fontFamily="basier"
                onClick={handleTokenSelector}
                buttonStyle={{
                  justifyContent: 'space-between',
                  background: `${theme(themeMode).colors.white}33`,
                  borderRadius: '20px',
                  padding: '10px 30px',
                  marginRight: 0,
                  height: '40px',
                }}
              >
                <Label fontSize={13}>{token1Name !== '' ? token1Name : 'select'}</Label>

                <ArrowDown style={{ marginRight: 0, marginLeft: 8 }} />
              </CustomButton>
              <Label labelStyle={{ alignSelf: 'center' }}>{token1}</Label>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>

        <div className="justify-ce align-ce flex">
          <CustomButton
            disabled={token0 === '' || token1 === '' || !createPairAvailable}
            buttonStyle={{ maxWidth: '444px' }}
            fluid
            type="gradient"
            onClick={async () => {
              await onCreatePair();
            }}
          >
            {getButtonLabel()}
          </CustomButton>
        </div>
      </CommonWrapper>
    </FlexContainer>
  );
};

export default CreatePairContainer;
