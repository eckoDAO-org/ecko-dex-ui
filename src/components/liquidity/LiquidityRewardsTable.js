/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import Pact from 'pact-lang-api';
import { BoosterIcon } from '../../assets';
import { extractDecimal, getDecimalPlaces } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import { commonColors } from '../../styles/theme';
import InfoPopup from '../shared/InfoPopup';
import {
  useAccountContext,
  useKaddexWalletContext,
  useModalContext,
  useNotificationContext,
  usePactContext,
  useWalletConnectContext,
} from '../../contexts';
import ClaimYourKDXRewards from '../modals/liquidity/ClaimYourKDXRewards';
import CustomDropdown from '../shared/CustomDropdown';
import { Divider } from 'semantic-ui-react';

import { getTokenByModuleV2 } from '../../utils/token-utils';
import { claimLiquidityRewardsCommandToSign, getAccountLiquidityRewards } from '../../api/liquidity-rewards';
import { NETWORK, NETWORKID } from '../../constants/contextConstants';
import { timeRender } from '../../utils/time-utils';

const ClaimButton = styled.div`
  display: flex;
  align-items: center;
  border-radius: 100px;

  padding: 8px;
  border: 1px solid ${({ color, disabled, theme: { colors } }) => (color ? (disabled ? `${color}99` : color) : colors.white)};
  svg {
    margin-right: 8px;
    path {
      fill: ${({ color, disabled, theme: { colors } }) => (color ? color : disabled ? `${color || colors.white}99` : colors.white)} !important;
    }
  }
`;

const filterOptions = [
  { key: 0, text: `All`, value: 'all' },
  { key: 1, text: `Available`, value: 'available' },
  { key: 2, text: `Pending`, value: 'pending' },
];

const LiquidityRewardsTable = () => {
  const modalContext = useModalContext();
  const { account } = useAccountContext();
  const pact = usePactContext();
  const { pollingNotif, showErrorNotification, transactionListen } = useNotificationContext();
  const { isConnected: isKaddexWalletConnected, requestSign: kaddexWalletRequestSign } = useKaddexWalletContext();
  const {
    pairingTopic: isWalletConnectConnected,
    requestSignTransaction: walletConnectRequestSign,
    sendTransactionUpdateEvent: walletConnectSendTransactionUpdateEvent,
  } = useWalletConnectContext();
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);
  const [rewardsFiltered, setRewardsFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    if (account.account) {
      const result = await getAccountLiquidityRewards(account.account);
      if (!result.errorMessage) {
        setRewardsFiltered(result);
        setRewards(result);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [account?.account, pact.polling]);

  useEffect(() => {
    filterBy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filterBy = () => {
    const pendingRewards = rewards.filter((r) => r?.['remaining-time'] > 0);
    const availableRewards = rewards.filter((r) => r?.['remaining-time'] === 0);
    let results = [];
    if (statusFilter === 'all') {
      results = [...availableRewards, ...pendingRewards];
    } else if (statusFilter === 'pending') {
      results = [...pendingRewards];
    } else {
      results = [...availableRewards];
    }
    setRewardsFiltered(results);
  };

  const signCommand = async (cmd) => {
    if (isKaddexWalletConnected) {
      const res = await kaddexWalletRequestSign(cmd);
      return res.signedCmd;
    } else if (isWalletConnectConnected) {
      const res = await walletConnectRequestSign(account.account, NETWORKID, {
        code: cmd.pactCode,
        data: cmd.envData,
        ...cmd,
      });
      return res.body;
    } else {
      return await Pact.wallet.sign(cmd);
    }
  };

  const sendClaimRewardsCommand = async (signedCommand) => {
    pact.setPolling(true);
    Pact.wallet
      .sendSigned(signedCommand, NETWORK)
      .then(async (stakingResponse) => {
        pollingNotif(stakingResponse.requestKeys[0], 'Claim Rewards Transaction Pending');

        const txRes = await transactionListen(stakingResponse.requestKeys[0]);
        const eventData = {
          ...txRes,
          type: 'CLAIM REWARDS',
        };
        if (isWalletConnectConnected) {
          await walletConnectSendTransactionUpdateEvent(NETWORKID, eventData);
        }
        pact.setPolling(false);
      })
      .catch((error) => {
        console.log(`~ error`, error);
        pact.setPolling(false);
        showErrorNotification(null, 'Claim Rewards error', 'Generic claim rewards error');
      });
  };

  const onClaimRewards = async (item) => {
    const command = claimLiquidityRewardsCommandToSign(
      item?.['request-id'],
      account,
      pact.enableGasStation,
      pact.gasConfiguration.gasLimit,
      pact.gasConfiguration.gasPrice
    );
    const signedCommand = await signCommand(command);
    if (signedCommand) {
      modalContext.openModal({
        title: 'CLAIM YOUR KDX REWARDS',
        description: '',
        onClose: () => {
          modalContext.closeModal();
        },
        content: (
          <ClaimYourKDXRewards
            hasObservedPrice={item?.['has-observed-price']}
            tokenA={item?.tokenA}
            tokenB={item?.tokenB}
            tokenAObservedPrice={item?.['tokenA-observed-price']}
            tokenBObservedPrice={item?.['tokenB-observed-price']}
            multiplier={item?.multiplier}
            amount={item?.['estimated-kdx']}
            onClick={() => {
              modalContext.closeModal();
              sendClaimRewardsCommand(signedCommand);
            }}
          />
        ),
      });
    }
  };

  return !loading ? (
    !account.account ? (
      <Label className="justify-ce">Please connect your wallet to see your rewards. </Label>
    ) : rewards.length === 0 ? (
      <Label className="justify-ce align-ce" labelStyle={{ textAlign: 'center' }}>
        To participate in the liquidity mining program and activate the multiplier, users are required to first remove liquidity and claim rewards.
      </Label>
    ) : (
      <>
        <div className="flex justify-sb" style={{ marginBottom: 16 }}>
          <div className="flex align-ce">
            <Label fontSize={16} fontFamily="syncopate">
              REWARDS
            </Label>
            <InfoPopup size={18} type="modal" title="Rewards">
              <FlexContainer className="column" gap={16}>
                <Label fontSize={16}>Amount</Label>
                <Label>
                  It's an estimate of the amount of KDX you will receive at claiming time. The actual sum is calculated based on the average price of
                  KDX during the 8-day waiting period after liquidity removal.
                </Label>
                <Divider />
                <Label fontSize={16}>KDX Multiplier</Label>
                <Label>
                  It represents the number by which your standard 0.25% rewards are multiplied. The shown final number is a simple average of the
                  multiplier values over the period in which you provided liquidity.
                </Label>
                <Divider />
                <Label fontSize={16}>Remaining Time</Label>
                <Label>
                  Withdrawing your rewards in the form of KDX implies a 8-day waiting period from the time you remove liquidity. Such waiting window
                  is needed to calculate the average price of KDX to be used in determining the amount of your boosted rewards.
                </Label>
              </FlexContainer>
            </InfoPopup>
          </div>
          <CustomDropdown
            containerStyle={{ minWidth: 125 }}
            title="filter by:"
            options={filterOptions}
            onChange={(e, { value }) => {
              setStatusFilter(value);
            }}
            value={statusFilter}
          />
        </div>
        {rewardsFiltered.length > 0 ? (
          <CommonTable
            items={rewardsFiltered.length > 0 && rewardsFiltered}
            columns={renderColumns(pact.allTokens)}
            actions={[
              {
                icon: (item) => (
                  <ClaimButton disabled={item?.['remaining-time'] > 0} color={item?.['remaining-time'] > 0 ? commonColors.info : null}>
                    <BoosterIcon />{' '}
                    <Label
                      labelStyle={{ lineHeight: 1 }}
                      withShade={item?.['remaining-time'] > 0}
                      color={item?.['remaining-time'] > 0 ? commonColors.info : null}
                      fontFamily="syncopate"
                    >
                      CLAIM
                    </Label>
                  </ClaimButton>
                ),
                disabled: (item) => item?.['remaining-time'] > 0,
                onClick: (item) => {
                  const disabled = item?.['remaining-time'] > 0;
                  if (!disabled) {
                    onClaimRewards(item);
                  }
                },
              },
            ]}
          />
        ) : (
          <div className="flex justify-ce">
            <Label>No {statusFilter} rewards</Label>
          </div>
        )}
      </>
    )
  ) : (
    <AppLoader containerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} />
  );
};

export default LiquidityRewardsTable;

const renderColumns = (allTokens) => {
  return [
    {
      name: '',
      width: 160,
      render: ({ item }) => (
        <FlexContainer className="align-ce">
          <CryptoContainer style={{ zIndex: 2 }}>{allTokens[getTokenByModuleV2(item.tokenA, allTokens)]?.icon ?? ""} </CryptoContainer>
          <CryptoContainer style={{ marginLeft: -12, zIndex: 1 }}> {allTokens[getTokenByModuleV2(item.tokenB, allTokens)]?.icon ?? ""}</CryptoContainer>
          {getTokenByModuleV2(item.tokenA, allTokens)}/{getTokenByModuleV2(item.tokenB, allTokens)}
        </FlexContainer>
      ),
    },

    {
      name: 'Estimated Amount',
      width: 160,
      sortBy: 'estimated-kdx',
      render: ({ item }) => `${getDecimalPlaces(extractDecimal(item?.['estimated-kdx']))} KDX`,
    },

    {
      name: '~ KDX Multiplier',
      width: 160,
      sortBy: 'multiplier',
      render: ({ item }) => `${getDecimalPlaces(extractDecimal(item?.['multiplier']))} x`,
    },

    /*   {
      name: 'Request ID',
      width: 160,
      render: ({ item }) => {
        return <CopyPopup title={reduceToken(item?.['request-id'])} textToCopy={item?.['request-id']} position="bottom center" />;
      },
    }, */
    {
      name: 'Remaining Time',
      width: 160,
      render: ({ item }) => {
        return (
          <Label color={item?.['remaining-time'] === 0 ? commonColors.green : commonColors.info}>
            {item?.['remaining-time'] === 0 ? '0 Days' : timeRender(item?.['remaining-time'])}
          </Label>
        );
      },
    },
    {
      name: 'Status',
      width: 80,
      render: ({ item }) => {
        let color = '';
        item?.['remaining-time'] > 0 ? (color = commonColors.info) : (color = commonColors.green);
        return (
          <Label className={'capitalize'} color={color}>
            {item?.['remaining-time'] === 0 ? 'Available' : 'Pending'}
          </Label>
        );
      },
    },
  ];
};
