/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import Pact from 'pact-lang-api';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import {
  getPoolState,
  getAddStakeCommand,
  estimateUnstake,
  getRollupAndClaimCommand,
  getRollupAndUnstakeCommand,
  getRollupClaimAndUnstakeCommand,
} from '../api/kaddex.staking';
import { getAccountData } from '../api/dao';
import { getKDXAccountBalance } from '../api/kaddex.kdx';
import { FlexContainer } from '../components/shared/FlexContainer';
import InfoPopup from '../components/shared/InfoPopup';
import Label from '../components/shared/Label';
import Analytics from '../components/stake/Analytics';
import Position from '../components/stake/Position';
import Rewards from '../components/stake/Rewards';
import StakeInfo from '../components/stake/StakeInfo';
import UnstakeInfo from '../components/stake/UnstakeInfo';
import VotingPower from '../components/stake/VotingPower';
import { AddStakeModal } from '../components/modals/stake/AddStakeModal';
import { UnstakeModal } from '../components/modals/stake/UnstakeModal';
import { ClaimModal } from '../components/modals/stake/ClaimModal';
import {
  useAccountContext,
  useKaddexWalletContext,
  useNotificationContext,
  usePactContext,
  useModalContext,
  useWalletConnectContext,
} from '../contexts';
import { ROUTE_STAKE, ROUTE_UNSTAKE } from '../router/routes';
import { CHAIN_ID, NETWORK, NETWORKID } from '../constants/contextConstants';
import { theme } from '../styles/theme';
// import { useInterval } from '../hooks/useInterval';
import { extractDecimal, getDecimalPlaces, reduceBalance } from '../utils/reduceBalance';
import { STAKING_CONSTANTS } from '../constants/stakingConstants';
import { getTimeByBlockchain } from '../utils/string-utils';
import useWindowSize from '../hooks/useWindowSize';
import { getAnalyticsData } from '../api/kaddex-analytics';
import { Helmet } from 'react-helmet';

const StakeContainer = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { openModal, closeModal } = useModalContext();
  const { account } = useAccountContext();
  const { isConnected: isKaddexWalletConnected, requestSign: kaddexWalletRequestSign } = useKaddexWalletContext();
  const {
    pairingTopic: isWalletConnectConnected,
    requestSignTransaction: walletConnectRequestSign,
    sendTransactionUpdateEvent: walletConnectSendTransactionUpdateEvent,
  } = useWalletConnectContext();
  const { showNotification, STATUSES, pollingNotif, showErrorNotification, transactionListen } = useNotificationContext();
  const pact = usePactContext();

  const [poolState, setPoolState] = useState(null);
  const [kdxSupply, setKdxSupply] = useState(null);
  const [kdxAccountBalance, setKdxAccountBalance] = useState(0.0);
  const [estimateUnstakeData, setEstimateUnstakeData] = useState(null);
  const [daoAccountData, setDaoAccountData] = useState(null);
  const [inputAmount, setInputAmount] = useState('');
  const [width] = useWindowSize();

  const stakedTimeStart =
    (estimateUnstakeData && estimateUnstakeData['stake-record'] && getTimeByBlockchain(estimateUnstakeData['stake-record']['effective-start'])) ||
    false;

  const lastStakedTime =
    (estimateUnstakeData && estimateUnstakeData['stake-record'] && getTimeByBlockchain(estimateUnstakeData['stake-record']['last-stake'])) || false;

  const updateAccountStakingData = useCallback(() => {
    if (account?.account) {
      getKDXAccountBalance(account.account).then((kdxBalance) => {
        if (!kdxBalance.errorMessage) {
          setKdxAccountBalance(extractDecimal(kdxBalance?.balance) ?? 0.0);
        } else {
          setKdxAccountBalance(0.0);
        }
      });
      estimateUnstake(account?.account).then((resEstimate) => {
        if (!resEstimate.errorMessage) {
          setEstimateUnstakeData({ ...resEstimate, staked: extractDecimal(resEstimate?.['staked-unlocked']) });
        } else {
          setEstimateUnstakeData(null);
        }
      });
      getAccountData(account?.account).then((daoAccountDataResponse) => setDaoAccountData(daoAccountDataResponse));
    }
  }, [account?.account]);

  useEffect(() => {
    updateAccountStakingData();
  }, [updateAccountStakingData]);

  // useInterval(updateAccountStakingData, 10000);

  useEffect(() => {
    getPoolState().then((res) => {
      setPoolState(res);
    });
    getAnalyticsData(moment().subtract(1, 'day').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')).then((res) => {
      if(res){
        setKdxSupply(res[res.length - 1].circulatingSupply.totalSupply);
      }
    });
  }, []);

  const getAccountStakingPercentage = () => {
    if (estimateUnstakeData?.['stake-record']?.['amount'] && poolState && poolState['staked-kdx']) {
      return parseFloat((100 * extractDecimal(estimateUnstakeData?.['stake-record']?.amount)) / reduceBalance(poolState['staked-kdx']));
    }
    return false;
  };

  const getAddStakeModalTitle = () => {
    if (estimateUnstakeData?.staked && estimateUnstakeData?.staked > 0) {
      return `ADDING MORE KDX TO YOUR STAKING AMOUNT`;
    }
    return `Transaction details`;
  };

  const getUnstakeModalTitle = () => {
    if (estimateUnstakeData?.staked && estimateUnstakeData?.staked > 0) {
      const diffDays = moment().diff(lastStakedTime, 'hours');
      const isPenaltyActive = diffDays <= STAKING_CONSTANTS.rewardsPenaltyHoursToWait;
      return `CLOSING YOUR STAKING PLAN${isPenaltyActive ? ' EARLY' : ''}`;
    }
    return `Transaction details`;
  };

  const signCommand = async (cmd) => {
    if (isKaddexWalletConnected) {
      const res = await kaddexWalletRequestSign(cmd);
      return res.signedCmd;
    } else if (isWalletConnectConnected) {
      const res = await walletConnectRequestSign(account.account, NETWORKID, cmd);
      return res.signedCmd;
    } else {
      return await Pact.wallet.sign(cmd);
    }
  };

  const onStakeKDX = async () => {
    let errorMessage = null;
    if (!inputAmount) {
      errorMessage = 'The amount to stake is not valid';
    }
    if (!(inputAmount > 0)) {
      errorMessage = 'Amount must be positive';
    }
    if (inputAmount > kdxAccountBalance) {
      errorMessage = "You don't have enough KDX";
    }
    if (errorMessage) {
      showNotification({
        title: 'Staking error',
        message: errorMessage,
        type: STATUSES.WARNING,
        autoClose: 5000,
        hideProgressBar: false,
      });
      return;
    }
    const command = await getAddStakeCommand(
      account,
      inputAmount,
      pact.enableGasStation,
      pact.gasConfiguration.gasLimit,
      pact.gasConfiguration.gasPrice
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
    openModal({
      title: getAddStakeModalTitle(),
      description: '',
      onClose: () => {
        closeModal();
      },
      content: (
        <AddStakeModal
          toStakeAmount={inputAmount}
          alreadyStakedAmount={estimateUnstakeData?.staked}
          onConfirm={() => {
            closeModal();
            sendStakeCommand(signedCommand, inputAmount);
          }}
        />
      ),
    });
  };

  const sendStakeCommand = async (signedCommand, amountFrom = 0) => {
    pact.setPolling(true);
    Pact.wallet
      .sendSigned(signedCommand, NETWORK)
      .then(async (stakingResponse) => {
        pollingNotif(stakingResponse.requestKeys[0], 'Staking Transaction Pending');

        setInputAmount('');
        const txRes = await transactionListen(stakingResponse.requestKeys[0]);
        const eventData = {
          ...txRes,
          amountFrom,
          type: 'ROLL-UP & STAKE',
        };
        if (isWalletConnectConnected) {
          await walletConnectSendTransactionUpdateEvent(NETWORKID, eventData);
        }
        pact.setPolling(false);
      })
      .catch((error) => {
        console.log(`~ error`, error);
        pact.setPolling(false);
        showErrorNotification(null, 'Staking error', 'Generic add stake error');
      });
  };

  const onSendUnstake = async (withdraw) => {
    if (withdraw) {
      const claimAndUnstakeCommand = await getRollupClaimAndUnstakeCommand(
        account,
        inputAmount,
        pact.enableGasStation,
        pact.gasConfiguration.gasLimit,
        pact.gasConfiguration.gasPrice
      );
      if (!claimAndUnstakeCommand) {
        showNotification({
          title: 'Invalid Action',
          message: `Make sure you have KDX account on chain ${CHAIN_ID}`,
          type: STATUSES.WARNING,
          autoClose: 5000,
          hideProgressBar: false,
        });
        return;
      }
      const claimAndUnstakeSignedCommand = await signCommand(claimAndUnstakeCommand);
      if (claimAndUnstakeSignedCommand) {
        sendRollupClaimAndUnstakeCommand(claimAndUnstakeSignedCommand, inputAmount);
      }
    } else {
      const command = await getRollupAndUnstakeCommand(
        account,
        inputAmount,
        pact.enableGasStation,
        pact.gasConfiguration.gasLimit,
        pact.gasConfiguration.gasPrice
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
      if (signedCommand) {
        sendRollupAndUnstakeCommand(signedCommand, inputAmount);
      }
    }
    closeModal();
  };

  const onRollupAndUnstake = async () => {
    if (!estimateUnstakeData?.staked || inputAmount > estimateUnstakeData?.staked || !inputAmount || !(inputAmount > 0)) {
      showNotification({
        title: 'Unstake error',
        message: 'The amount to unstake is not valid',
        type: STATUSES.WARNING,
        autoClose: 5000,
        hideProgressBar: false,
      });
      return;
    }
    openModal({
      title: getUnstakeModalTitle(),
      description: '',
      onClose: () => {
        closeModal();
      },
      content: (
        <UnstakeModal
          toUnstakeAmount={extractDecimal(inputAmount)}
          estimateUnstakeData={estimateUnstakeData}
          stakedTimeStart={lastStakedTime}
          isRewardsAvailable={estimateUnstakeData && estimateUnstakeData['reward-accrued'] && estimateUnstakeData && estimateUnstakeData['can-claim']}
          onConfirm={(state) => {
            onSendUnstake(state);
          }}
        />
      ),
    });
  };

  const sendRollupAndUnstakeCommand = async (signedCommand, amountFrom = 0) => {
    pact.setPolling(true);
    Pact.wallet
      .sendSigned(signedCommand, NETWORK)
      .then(async (rollupAndUnstake) => {
        pollingNotif(rollupAndUnstake.requestKeys[0], 'Unstake Transaction Pending');

        const txRes = await transactionListen(rollupAndUnstake.requestKeys[0]);
        const eventData = {
          ...txRes,
          amountFrom,
          type: 'ROLL-UP & UNSTAKE',
        };
        if (isWalletConnectConnected) {
          await walletConnectSendTransactionUpdateEvent(NETWORKID, eventData);
        }
        pact.setPolling(false);
        setInputAmount('');
      })
      .catch((error) => {
        console.log(`~ rollupAndUnstake error`, error);
        pact.setPolling(false);
        showErrorNotification(null, 'RollupAndUnstake error', (error.toString && error.toString()) || 'Generic rollupAndUnstake error');
      });
  };

  const sendRollupClaimAndUnstakeCommand = async (signedCommand, amountFrom = 0) => {
    pact.setPolling(true);
    Pact.wallet
      .sendSigned(signedCommand, NETWORK)
      .then(async (rollupAndUnstake) => {
        pollingNotif(rollupAndUnstake.requestKeys[0], 'Claim and Unstake Transaction Pending');

        const txRes = await transactionListen(rollupAndUnstake.requestKeys[0]);
        const eventData = {
          ...txRes,
          amountFrom,
          type: 'ROLL-UP & CLAIM & UNSTAKE',
        };
        if (isWalletConnectConnected) {
          await walletConnectSendTransactionUpdateEvent(NETWORKID, eventData);
        }
        pact.setPolling(false);
        setInputAmount('');
      })
      .catch((error) => {
        console.log(`~ rollupClaimAndUnstake error`, error);
        pact.setPolling(false);
        showErrorNotification(null, 'Claim and Unstake error', (error.toString && error.toString()) || 'Generic Claim and Unstake error');
      });
  };

  const onWithdraw = async () => {
    let errorMessage = null;
    if (!(estimateUnstakeData && estimateUnstakeData['reward-accrued'])) {
      errorMessage = 'No accrued rewards';
    }
    if (estimateUnstakeData && !estimateUnstakeData['can-claim']) {
      errorMessage = 'You cannot withdraw rewards yet';
    }
    if (errorMessage) {
      showNotification({
        title: 'Withdraw error',
        message: errorMessage,
        type: STATUSES.WARNING,
        autoClose: 5000,
        hideProgressBar: false,
      });
      return;
    }
    const command = await getRollupAndClaimCommand(account, pact.enableGasStation, pact.gasConfiguration.gasLimit, pact.gasConfiguration.gasPrice);
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
    if (signedCommand) {
      openModal({
        title: 'WITHDRAW YOUR STAKING REWARDS',
        description: '',
        onClose: () => {
          closeModal();
        },
        content: (
          <ClaimModal
            estimateUnstakeData={estimateUnstakeData}
            onConfirm={() => {
              closeModal();
              sendRollupAndClaimCommand(signedCommand);
            }}
          />
        ),
      });
    }
  };

  const sendRollupAndClaimCommand = async (signedCommand) => {
    pact.setPolling(true);
    Pact.wallet
      .sendSigned(signedCommand, NETWORK)
      .then(async (rollupAndClaim) => {
        pollingNotif(rollupAndClaim.requestKeys[0], 'Rollup and Unstake Transaction Pending');

        const txRes = await transactionListen(rollupAndClaim.requestKeys[0]);
        const eventData = {
          ...txRes,
          type: 'ROLL-UP & CLAIM',
        };
        if (isWalletConnectConnected) {
          await walletConnectSendTransactionUpdateEvent(NETWORKID, eventData);
        }
        pact.setPolling(false);
        setInputAmount('');
      })
      .catch((error) => {
        console.log(`~ rollupAndClaim error`, error);
        pact.setPolling(false);
        showErrorNotification(null, 'RollupAndClaim error', (error.toString && error.toString()) || 'Generic RollupAndClaim error');
      });
  };

  const getPositionLabel = () => {
    if (pathname !== ROUTE_UNSTAKE) {
      return `Balance: ${getDecimalPlaces(extractDecimal(kdxAccountBalance)) || getDecimalPlaces(0.0)}`;
    } else {
      return `Available: ${(estimateUnstakeData?.staked && getDecimalPlaces(extractDecimal(estimateUnstakeData?.staked))) || getDecimalPlaces(0.0)}`;
    }
  };

  return (
    <FlexContainer
      className="column w-100 main"
      desktopStyle={{ paddingRight: theme().layout.desktopPadding, paddingLeft: theme().layout.desktopPadding }}
      tabletStyle={{ paddingRight: theme().layout.tabletPadding, paddingLeft: theme().layout.tabletPadding }}
      mobileStyle={{ paddingRight: theme().layout.mobilePadding, paddingLeft: theme().layout.mobilePadding }}
    >
      <Helmet>
        <meta
          name="description"
          content="Stake $KDX for voting power and DAO participation. Secure rewards while supporting project growth. Join the community now."
        />
        <title>eckoDEX | Stake</title>
      </Helmet>
      <FlexContainer className="w-100 justify-sb" style={{ marginBottom: 24 }}>
        <FlexContainer gap={16} mobileStyle={{ marginBottom: 16 }}>
          <Label
            withShade={pathname !== ROUTE_STAKE}
            className="pointer"
            fontSize={24}
            fontFamily="syncopate"
            onClick={() => {
              history.push(ROUTE_STAKE);
              setInputAmount('');
            }}
          >
            STAKE
          </Label>
          <Label
            withShade={pathname !== ROUTE_UNSTAKE}
            className="pointer"
            fontSize={24}
            fontFamily="syncopate"
            onClick={() => {
              history.push(ROUTE_UNSTAKE);
              setInputAmount('');
            }}
          >
            UNSTAKE
          </Label>
        </FlexContainer>
        <InfoPopup title={pathname.substring(1)} type="modal">
          {pathname === ROUTE_STAKE ? <StakeInfo /> : <UnstakeInfo />}
        </InfoPopup>
      </FlexContainer>

      <FlexContainer
        gap={24}
        style={{
          flexDirection: width < theme().mediaQueries.desktopPixel + 110 && 'column',
          rowGap: width < theme().mediaQueries.desktopPixel + 110 && 24,
        }}
        tabletClassName="column"
        mobileClassName="column"
      >
        <Position
          stakeData={estimateUnstakeData}
          amount={estimateUnstakeData?.['stake-record']?.['amount'] || 0.0}
          topRightLabel={getPositionLabel()}
          inputAmount={inputAmount}
          buttonLabel={pathname === ROUTE_STAKE ? 'stake' : 'unstake'}
          pendingAmount={(estimateUnstakeData && estimateUnstakeData['stake-record'] && estimateUnstakeData['stake-record']['pending-add']) || false}
          onClickMax={() =>
            setInputAmount(pathname !== ROUTE_UNSTAKE ? reduceBalance(kdxAccountBalance, 12) : reduceBalance(estimateUnstakeData?.staked, 12) || 0.0)
          }
          kdxAccountBalance={kdxAccountBalance}
          setKdxAmount={(value) => setInputAmount(value)}
          onSubmitStake={() => (pathname !== ROUTE_UNSTAKE ? onStakeKDX() : onRollupAndUnstake())}
          stakedTimeStart={lastStakedTime}
        />
        <Rewards
          stakedAmount={estimateUnstakeData?.staked || 0.0}
          disabled={!(estimateUnstakeData && estimateUnstakeData['reward-accrued']) || (estimateUnstakeData && !estimateUnstakeData['can-claim'])}
          rewardAccrued={(estimateUnstakeData && estimateUnstakeData['reward-accrued']) || 0}
          rewardsPenalty={estimateUnstakeData && estimateUnstakeData['reward-penalty']}
          lastRewardsClaim={estimateUnstakeData && estimateUnstakeData['stake-record']['last-claim']}
          onWithdrawClick={() => onWithdraw()}
          stakedTimeStart={stakedTimeStart}
        />
        <Analytics
          kdxSupply={kdxSupply}
          staked={estimateUnstakeData?.['stake-record']?.amount}
          stakedShare={getAccountStakingPercentage()}
          totalStaked={poolState && poolState['staked-kdx']}
          totalBurnt={poolState && poolState['burnt-kdx']}
        />
      </FlexContainer>

      <VotingPower daoAccountData={daoAccountData} />
    </FlexContainer>
  );
};

export default StakeContainer;
