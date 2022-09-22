/* eslint-disable react-hooks/exhaustive-deps */
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
import Label from '../shared/Label';
import CommonWrapper from '../stake/CommonWrapper';
import CreatePairModal from '../modals/liquidity/CreatePairModal';
import { mkReq, parseRes } from '../../api/utils';
import CreatePairTokenSelectorModal from '../modals/liquidity/CreatePairTokenSelectorModal';
import { ArrowBack, ArrowDown, UnknownLogo } from '../../assets';
import { ROUTE_LIQUIDITY_TOKENS } from '../../router/routes';
import { useHistory } from 'react-router-dom';
import CreatePairInfo from './CreatePairInfo';
import InfoPopup from '../shared/InfoPopup';

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
    if (!signedCommand) {
      return;
    }
    let data = await fetch(`${NETWORK}/api/v1/local`, mkReq(signedCommand));
    data = await parseRes(data);
    if (data.result?.status !== 'success') {
      if (data.result?.error?.message.includes('row found for key')) {
        showNotification({
          title: 'Create Pair Error',
          message: 'This pair already exists',
          type: STATUSES.ERROR,
          autoClose: 5000,
          hideProgressBar: false,
        });
      } else {
        showNotification({
          title: 'Create Pair Error',
          message: data.result?.error?.message,
          type: STATUSES.ERROR,
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
      return;
    } else {
      openModal({
        title: 'Create pair',
        description: '',
        onClose: () => {
          closeModal();
        },
        content: (
          <CreatePairModal
            data={data}
            token0Name={token0Name}
            token1Name={token1Name}
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

  const getButtonStatus = () => {
    if (token0 === '' || token1 === '') return { message: 'Insert pair', disabled: true };
    else if (token0 === token1) return { message: 'Insert different tokens', disabled: true };
    else if (!createPairAvailable) return { message: 'No balance', disabled: true };
    return { message: 'Create Pair', disabled: false };
  };
  return (
    <FlexContainer
      className="column align-fs w-100 h-100 main"
      style={{ maxWidth: 550, marginLeft: 'auto', marginRight: 'auto' }}
      desktopStyle={{ paddingRight: theme().layout.desktopPadding, paddingLeft: theme().layout.desktopPadding }}
      tabletStyle={{ paddingRight: theme().layout.tabletPadding, paddingLeft: theme().layout.tabletPadding }}
      mobileStyle={{ paddingRight: theme().layout.mobilePadding, paddingLeft: theme().layout.mobilePadding }}
    >
      <FlexContainer className="justify-sb w-100">
        <div className="flex">
          <ArrowBack
            className="arrow-back svg-app-color"
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
        </div>
        <InfoPopup type="modal" title="Create Pair" containerStyle={{ marginLeft: 0 }}>
          <CreatePairInfo />
        </InfoPopup>
      </FlexContainer>
      <CommonWrapper cardStyle={{ padding: 24 }} gap={16}>
        <FlexContainer className="justify-ce column" gap={16}>
          <Label>Select pair</Label>
          <FlexContainer className="justify-ce column" gap={16}>
            <FlexContainer className="column">
              <CustomButton
                type="primary"
                geBasic
                fontFamily="basier"
                buttonStyle={{
                  justifyContent: 'space-between',
                  border: `1px solid ${theme(themeMode).colors.white}99`,
                  borderRadius: '10px',
                  padding: '10px',
                  marginRight: 0,
                  height: '40px',
                }}
              >
                <div className="align-ce flex">
                  {pact.allTokens[token0Name]?.icon}
                  <Label fontSize={13}>{token0Name}</Label>
                </div>
                <ArrowDown className="svg-app-color" style={{ marginRight: 0, marginLeft: 8 }} />
              </CustomButton>
            </FlexContainer>
            <FlexContainer className="column">
              <CustomButton
                type="primary"
                geBasic
                fontFamily="basier"
                onClick={handleTokenSelector}
                buttonStyle={{
                  justifyContent: 'space-between',
                  border: `1px solid ${theme(themeMode).colors.white}99`,
                  borderRadius: '10px',
                  padding: '10px',
                  marginRight: 0,
                  height: '40px',
                }}
              >
                <div className="align-ce flex">
                  {token1Name && <UnknownLogo style={{ marginRight: 8, width: 20, height: 20 }} />}
                  <Label fontSize={13}>{token1Name !== '' ? token1Name : 'select'}</Label>
                </div>
                <ArrowDown className="svg-app-color" style={{ marginRight: 0, marginLeft: 8 }} />
              </CustomButton>
            </FlexContainer>
          </FlexContainer>
          <div className="flex justify-sb">
            <Label>Token A</Label>
            <Label>{token0}</Label>
          </div>
          <div className="flex justify-sb">
            <Label>Token B</Label>
            <Label>{token1 ? token1 : '-'}</Label>
          </div>
        </FlexContainer>

        <div className="justify-ce align-ce flex">
          <CustomButton
            disabled={getButtonStatus().disabled}
            buttonStyle={{ maxWidth: '444px' }}
            fluid
            type="gradient"
            onClick={async () => {
              await onCreatePair();
            }}
          >
            {getButtonStatus().message}
          </CustomButton>
        </div>
      </CommonWrapper>
    </FlexContainer>
  );
};

export default CreatePairContainer;
