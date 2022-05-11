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
import { useAccountContext, useKaddexWalletContext, useNotificationContext, usePactContext, useModalContext } from '../contexts';
import { ROUTE_STAKE, ROUTE_UNSTAKE } from '../router/routes';
import { NETWORK } from '../constants/contextConstants';
import { theme } from '../styles/theme';
import { useInterval } from '../hooks/useInterval';
import { countDecimals, extractDecimal, reduceBalance } from '../utils/reduceBalance';

const StakeContainer = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { openModal, closeModal } = useModalContext();
  const { account } = useAccountContext();
  const { isConnected: isKaddexWalletConnected, requestSign: kaddexWalletRequestSign } = useKaddexWalletContext();
  const { showNotification, STATUSES, pollingNotif, showErrorNotification, transactionListen } = useNotificationContext();
  const pact = usePactContext();

  const [poolState, setPoolState] = useState(null);
  const [kdxAccountBalance, setKdxAccountBalance] = useState(0.0);
  const [estimateUnstakeData, setEstimateUnstakeData] = useState(null);
  const [daoAccountData, setDaoAccountData] = useState(null);
  const [inputAmount, setInputAmount] = useState('');

  const stakedTimeStart =
    (estimateUnstakeData &&
      estimateUnstakeData['stake-record'] &&
      estimateUnstakeData['stake-record']['effective-start'] &&
      estimateUnstakeData['stake-record']['effective-start']['timep']) ||
    false;

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
          setEstimateUnstakeData({ ...resEstimate, staked: extractDecimal(resEstimate.staked) });
        }
      });
      getAccountData(account?.account).then((daoAccountDataResponse) => setDaoAccountData(daoAccountDataResponse));
    }
  }, [account?.account]);

  useEffect(() => {
    updateAccountStakingData();
  }, [updateAccountStakingData]);

  useInterval(updateAccountStakingData, 10000);

  useEffect(() => {
    getPoolState().then((res) => {
      setPoolState(res);
    });
  }, []);

  const getAccountStakingPercentage = () => {
    if (estimateUnstakeData?.staked && poolState && poolState['staked-kdx']) {
      return parseFloat((100 * estimateUnstakeData?.staked) / reduceBalance(poolState['staked-kdx']));
    }
    return false;
  };

  const getAddStakeModalTitle = () => {
    if (estimateUnstakeData?.staked && estimateUnstakeData?.staked > 0) {
      return `ADDING MORE KDX TO YOUR STAKING AMOUNT?`;
    }
    return `Transaction details`;
  };

  const getUnstakeModalTitle = () => {
    if (estimateUnstakeData?.staked && estimateUnstakeData?.staked > 0) {
      const diffDays = moment().diff(stakedTimeStart, 'days');
      const isPenaltyActive = diffDays <= 60;
      return `CLOSING YOUR STAKING PLAN${isPenaltyActive && ' EARLY'}?`;
    }
    return `Transaction details`;
  };

  const signCommand = async (cmd) => {
    if (isKaddexWalletConnected) {
      const res = await kaddexWalletRequestSign(cmd);
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
    if (inputAmount > kdxAccountBalance) {
      errorMessage = "You dont't have enough KDX";
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
    const command = getAddStakeCommand(account, inputAmount);
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
            sendStakeCommand(signedCommand);
          }}
        />
      ),
    });
  };

  const sendStakeCommand = async (signedCommand) => {
    pact.setPolling(true);
    Pact.wallet
      .sendSigned(signedCommand, NETWORK)
      .then(async (stakingResponse) => {
        console.log(' stakingResponse', stakingResponse);
        pollingNotif(stakingResponse.requestKeys[0], 'Staking Transaction Pending');

        setInputAmount(0.0);
        await transactionListen(stakingResponse.requestKeys[0]);
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
      const claimAndUnstakeCommand = getRollupClaimAndUnstakeCommand(account, inputAmount);
      const claimAndUnstakeSignedCommand = await signCommand(claimAndUnstakeCommand);
      if (claimAndUnstakeSignedCommand) {
        sendRollupClaimAndUnstakeCommand(claimAndUnstakeSignedCommand);
      }
    } else {
      const command = getRollupAndUnstakeCommand(account, inputAmount);
      const signedCommand = await signCommand(command);
      if (signedCommand) {
        sendRollupAndUnstakeCommand(signedCommand);
      }
    }
    closeModal();
  };

  const onRollupAndUnstake = async () => {
    if (!estimateUnstakeData?.staked || inputAmount > estimateUnstakeData?.staked || !inputAmount) {
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
          toUnstakeAmount={inputAmount}
          estimateUnstakeData={estimateUnstakeData}
          stakedTimeStart={stakedTimeStart}
          isRewardsAvailable={estimateUnstakeData && estimateUnstakeData['reward-accrued'] && estimateUnstakeData && estimateUnstakeData['can-claim']}
          onConfirm={(state) => {
            onSendUnstake(state);
          }}
        />
      ),
    });
  };

  const sendRollupAndUnstakeCommand = async (signedCommand) => {
    pact.setPolling(true);
    Pact.wallet
      .sendSigned(signedCommand, NETWORK)
      .then(async (rollupAndUnstake) => {
        console.log(' rollupAndUnstake', rollupAndUnstake);
        pollingNotif(rollupAndUnstake.requestKeys[0], 'Rollup and Unstake Transaction Pending');

        await transactionListen(rollupAndUnstake.requestKeys[0]);
        pact.setPolling(false);
        setInputAmount(0.0);
      })
      .catch((error) => {
        console.log(`~ rollupAndUnstake error`, error);
        pact.setPolling(false);
        showErrorNotification(null, 'RollupAndUnstake error', (error.toString && error.toString()) || 'Generic rollupAndUnstake error');
      });
  };

  const sendRollupClaimAndUnstakeCommand = async (signedCommand) => {
    pact.setPolling(true);
    Pact.wallet
      .sendSigned(signedCommand, NETWORK)
      .then(async (rollupAndUnstake) => {
        console.log(' rollupClaimAndUnstake', rollupAndUnstake);
        pollingNotif(rollupAndUnstake.requestKeys[0], 'Rollup, Claim and Unstake Transaction Pending');

        await transactionListen(rollupAndUnstake.requestKeys[0]);
        pact.setPolling(false);
        setInputAmount(0);
      })
      .catch((error) => {
        console.log(`~ rollupClaimAndUnstake error`, error);
        pact.setPolling(false);
        showErrorNotification(null, 'rollupClaimAndUnstake error', (error.toString && error.toString()) || 'Generic rollupClaimAndUnstake error');
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
    const command = getRollupAndClaimCommand(account);
    const signedCommand = await signCommand(command);
    if (signedCommand) {
      openModal({
        title: 'WITHDRAW YOUR STAKED REWARDS?',
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
        console.log(' rollupAndClaim', rollupAndClaim);
        pollingNotif(rollupAndClaim.requestKeys[0], 'Rollup and Unstake Transaction Pending');

        await transactionListen(rollupAndClaim.requestKeys[0]);
        pact.setPolling(false);
        setInputAmount(0.0);
      })
      .catch((error) => {
        console.log(`~ rollupAndClaim error`, error);
        pact.setPolling(false);
        showErrorNotification(null, 'RollupAndClaim error', (error.toString && error.toString()) || 'Generic RollupAndClaim error');
      });
  };

  const getDecimalPlaces = (value) => {
    const count = countDecimals(value);
    if (count < 2) {
      return value?.toFixed(2);
    } else if (count > 7) {
      return value?.toFixed(7);
    } else {
      return value;
    }
  };

  const getPositionLabel = () => {
    if (pathname !== ROUTE_UNSTAKE) {
      return `Balance: ${getDecimalPlaces(extractDecimal(kdxAccountBalance)) || getDecimalPlaces(0.0)}`;
    } else {
      return `Staked: ${(estimateUnstakeData?.staked && getDecimalPlaces(extractDecimal(estimateUnstakeData?.staked))) || getDecimalPlaces(0.0)}`;
    }
  };

  return (
    <FlexContainer
      className="column w-100"
      style={{ paddingTop: 35, paddingBottom: 35 }}
      desktopStyle={{ paddingRight: theme().layout.desktopPadding, paddingLeft: theme().layout.desktopPadding }}
      tabletStyle={{ paddingRight: theme().layout.tabletPadding, paddingLeft: theme().layout.tabletPadding }}
      mobileStyle={{ paddingRight: theme().layout.mobilePadding, paddingLeft: theme().layout.mobilePadding }}
    >
      <FlexContainer className="w-100 justify-sb" style={{ marginBottom: 24 }} mobileStyle={{ marginTop: 24 }}>
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

      <FlexContainer gap={24} tabletClassName="column" mobileClassName="column">
        <Position
          amount={estimateUnstakeData?.staked || 0.0}
          topRightLabel={getPositionLabel()}
          inputAmount={inputAmount}
          buttonLabel={pathname === ROUTE_STAKE ? 'stake' : 'unstake'}
          pendingAmount={(estimateUnstakeData && estimateUnstakeData['stake-record'] && estimateUnstakeData['stake-record']['pending-add']) || false}
          onClickMax={() =>
            setInputAmount(pathname !== ROUTE_UNSTAKE ? kdxAccountBalance.toFixed(12) : estimateUnstakeData?.staked.toFixed(12) || 0.0)
          }
          setKdxAmount={(value) => setInputAmount(value)}
          onSubmitStake={() => (pathname !== ROUTE_UNSTAKE ? onStakeKDX() : onRollupAndUnstake())}
          stakedTimeStart={stakedTimeStart}
        />
        <Rewards
          disabled={!(estimateUnstakeData && estimateUnstakeData['reward-accrued']) || (estimateUnstakeData && !estimateUnstakeData['can-claim'])}
          rewardAccrued={(estimateUnstakeData && estimateUnstakeData['reward-accrued']) || 0}
          rewardsPenalty={estimateUnstakeData && estimateUnstakeData['reward-penalty']}
          onWithdrawClick={() => onWithdraw()}
          stakedTimeStart={stakedTimeStart}
        />
        <Analytics stakedShare={getAccountStakingPercentage()} totalStaked={poolState && poolState['staked-kdx']} />
      </FlexContainer>

      <VotingPower daoAccountData={daoAccountData} />
    </FlexContainer>
  );
};

export default StakeContainer;
