import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import Pact from 'pact-lang-api';
import { BoosterIcon } from '../../assets';
import tokenData from '../../constants/cryptoCurrencies';
import { extractDecimal, getDecimalPlaces } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import { commonColors } from '../../styles/theme';
import InfoPopup from '../shared/InfoPopup';
import { useAccountContext, useKaddexWalletContext, useModalContext, useNotificationContext, usePactContext } from '../../contexts';
import ClaimYourKDXRewards from '../modals/liquidity/ClaimYourKDXRewards';
import CustomDropdown from '../shared/CustomDropdown';
import { Divider } from 'semantic-ui-react';

import { getTokenByModuleV2 } from '../../utils/token-utils';
import reduceToken from '../../utils/reduceToken';
import { claimLiquidityRewardsCommandToSign, getAccountLiquidityRewards } from '../../api/liquidity-rewards';
import { NETWORK } from '../../constants/contextConstants';
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

const LiquidityRewards = () => {
  const modalContext = useModalContext();
  const { account } = useAccountContext();
  const pact = usePactContext();
  const { pollingNotif, showErrorNotification, transactionListen } = useNotificationContext();
  const { isConnected: isKaddexWalletConnected, requestSign: kaddexWalletRequestSign } = useKaddexWalletContext();
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
    } else {
      return await Pact.wallet.sign(cmd);
    }
  };

  const sendClaimRewardsCommand = async (signedCommand) => {
    pact.setPolling(true);
    Pact.wallet
      .sendSigned(signedCommand, NETWORK)
      .then(async (stakingResponse) => {
        console.log(' ClaimRewardsResponse', stakingResponse);
        pollingNotif(stakingResponse.requestKeys[0], 'Claim Rewards Transaction Pending');

        await transactionListen(stakingResponse.requestKeys[0]);
        pact.setPolling(false);
      })
      .catch((error) => {
        console.log(`~ error`, error);
        pact.setPolling(false);
        showErrorNotification(null, 'Claim Rewards error', 'Generic claim rewards error');
      });
  };

  const onClaimRewards = async (item) => {
    const command = claimLiquidityRewardsCommandToSign(item?.['request-id'], account);
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
    ) : rewardsFiltered.length === 0 ? (
      <Label className="justify-ce align-ce" labelStyle={{ textAlign: 'center' }}>
        Participate in the liquidity mining program to activate boosted rewards.
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
                  KDX during the 5-day waiting period after liquidity removal.
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
                  Withdrawing your rewards in the form of KDX implies a 5-day waiting period from the time you remove liquidity. Such waiting window
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
        <CommonTable
          items={rewardsFiltered}
          columns={renderColumns()}
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
      </>
    )
  ) : (
    <AppLoader containerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} />
  );
};

export default LiquidityRewards;

const renderColumns = () => {
  return [
    {
      name: '',
      width: 160,
      render: ({ item }) => (
        <FlexContainer className="align-ce">
          <CryptoContainer style={{ zIndex: 2 }}>{tokenData[getTokenByModuleV2(item.tokenA)].icon} </CryptoContainer>
          <CryptoContainer style={{ marginLeft: -12, zIndex: 1 }}> {tokenData[getTokenByModuleV2(item.tokenB)].icon}</CryptoContainer>
          {getTokenByModuleV2(item.tokenA)}/{getTokenByModuleV2(item.tokenB)}
        </FlexContainer>
      ),
    },

    {
      name: 'Amount',
      width: 160,
      render: ({ item }) => `${getDecimalPlaces(extractDecimal(item?.['estimated-kdx']))} KDX`,
    },

    {
      name: '~ KDX Multiplier',
      width: 160,
      render: ({ item }) => `${getDecimalPlaces(extractDecimal(item?.['multiplier']))} x`,
    },

    {
      name: 'Transaction ID',
      width: 160,
      render: ({ item }) => {
        return reduceToken(item?.['request-id']);
      },
    },
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
      width: 160,
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
