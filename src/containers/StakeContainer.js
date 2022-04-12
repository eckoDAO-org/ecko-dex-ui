import React, { useCallback, useEffect, useState } from 'react';
import Pact from 'pact-lang-api';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import { getPoolState, getAddStakeCommand, estimateUnstake, getRollupAndClaimCommand, getRollupAndUnstakeCommand } from '../api/kaddex.staking';
import { getAccountData } from '../api/dao';
import { getKDXAccountBalance, getKDXTotalSupply } from '../api/kaddex.kdx';
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
import { NETWORK, getCurrentDate, getCurrentTime } from '../constants/contextConstants';
import { theme } from '../styles/theme';

const StakeContainer = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { openModal, closeModal } = useModalContext();
  const { account, storeNotification } = useAccountContext();
  const { isConnected: isKaddexWalletConnected, requestSign: kaddexWalletRequestSign } = useKaddexWalletContext();
  const { showNotification, STATUSES } = useNotificationContext();
  const pact = usePactContext();

  const [kdxTotalSupply, setKdxTotalSupply] = useState(null);
  const [poolState, setPoolState] = useState(null);
  const [kdxAccountBalance, setKdxAccountBalance] = useState(0);
  const [estimateUnstakeData, setEstimateUnstakeData] = useState(null);
  const [daoAccountData, setDaoAccountData] = useState(null);
  const [inputAmount, setInputAmount] = useState(0);

  const stakedTimeStart =
    (estimateUnstakeData &&
      estimateUnstakeData['stake-record'] &&
      estimateUnstakeData['stake-record']['effective-start'] &&
      estimateUnstakeData['stake-record']['effective-start']['timep']) ||
    false;

  const updateAccountStakingData = useCallback(() => {
    if (account?.account) {
      getKDXAccountBalance(account.account).then((kdxBalance) => {
        setKdxAccountBalance(kdxBalance?.balance ?? 0);
      });
      estimateUnstake(account?.account).then((resEstimate) => {
        setEstimateUnstakeData(resEstimate);
      });
      getAccountData(account?.account).then((daoAccountDataResponse) => setDaoAccountData(daoAccountDataResponse));
    }
  }, [account?.account]);

  useEffect(() => {
    updateAccountStakingData();
  }, [updateAccountStakingData]);

  useEffect(() => {
    const updateAccountStakingDataInterval = setInterval(() => {
      updateAccountStakingData();
    }, 10000);
    return () => {
      clearInterval(updateAccountStakingDataInterval);
    };
  }, [updateAccountStakingData]);

  useEffect(() => {
    getPoolState().then((res) => {
      setPoolState(res);
    });
    getKDXTotalSupply().then((res) => {
      setKdxTotalSupply(res.decimal || res);
    });
  }, []);

  const getSupplyStakingPercentage = () => {
    if (poolState && poolState['staked-kdx'] && !Number.isNaN(poolState['staked-kdx'])) {
      return ((100 * poolState['staked-kdx']) / kdxTotalSupply).toFixed(6);
    }
    return '--';
  };

  const getAccountStakingPercentage = () => {
    if (estimateUnstakeData?.staked && poolState && poolState['staked-kdx']) {
      return parseFloat(((100 * estimateUnstakeData?.staked) / poolState['staked-kdx']).toFixed(6));
    }
    return '--';
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
        pact.pollingNotif(stakingResponse.requestKeys[0]);
        storeNotification({
          type: 'info',
          time: getCurrentTime(),
          date: getCurrentDate(),
          title: 'Staking Transaction Pending',
          description: stakingResponse.requestKeys[0],
          isRead: false,
          isCompleted: false,
        });
        setInputAmount(0);
        await pact.listen(stakingResponse.requestKeys[0]);
        pact.setPolling(false);
      })
      .catch((error) => {
        console.log(`~ error`, error);
        pact.setPolling(false);
        showNotification({
          title: 'Staking error',
          message: 'Generic add stake error',
          type: STATUSES.ERROR,
        });
      });
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
    const command = getRollupAndUnstakeCommand(account, inputAmount);
    const signedCommand = await signCommand(command);
    if (signedCommand) {
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
            onConfirm={() => {
              closeModal();
              sendRollupAndUnstakeCommand(signedCommand);
            }}
          />
        ),
      });
    }
  };

  const sendRollupAndUnstakeCommand = async (signedCommand) => {
    pact.setPolling(true);
    Pact.wallet
      .sendSigned(signedCommand, NETWORK)
      .then(async (rollupAndUnstake) => {
        console.log('rollupAndUnstake', rollupAndUnstake);
        pact.pollingNotif(rollupAndUnstake.requestKeys[0]);
        storeNotification({
          type: 'info',
          time: getCurrentTime(),
          date: getCurrentDate(),
          title: 'Rollup and Unstake Transaction Pending',
          description: rollupAndUnstake.requestKeys[0],
          isRead: false,
          isCompleted: false,
        });
        await pact.listen(rollupAndUnstake.requestKeys[0]);
        pact.setPolling(false);
        setInputAmount(0);
      })
      .catch((error) => {
        console.log(`~ rollupAndUnstake error`, error);
        pact.setPolling(false);
        showNotification({
          title: 'RollupAndUnstake error',
          message: (error.toString && error.toString()) || 'Generic rollupAndUnstake error',
          type: STATUSES.ERROR,
        });
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
        pact.pollingNotif(rollupAndClaim.requestKeys[0]);
        storeNotification({
          type: 'info',
          time: getCurrentTime(),
          date: getCurrentDate(),
          title: 'Rollup and Unstake Transaction Pending',
          description: rollupAndClaim.requestKeys[0],
          isRead: false,
          isCompleted: false,
        });
        await pact.listen(rollupAndClaim.requestKeys[0]);
        pact.setPolling(false);
        setInputAmount(0);
      })
      .catch((error) => {
        console.log(`~ rollupAndClaim error`, error);
        pact.setPolling(false);
        showNotification({
          title: 'RollupAndClaim error',
          message: (error.toString && error.toString()) || 'Generic rollupAndClaim error',
          type: STATUSES.ERROR,
        });
      });
  };

  const getPositionLabel = () => {
    if (pathname !== ROUTE_UNSTAKE) {
      return `Balance: ${kdxAccountBalance ?? 0}`;
    } else {
      return `Staked: ${estimateUnstakeData?.staked ?? 0}`;
    }
  };

  return (
    <FlexContainer
      className="column w-100 y-auto"
      desktopClassName="h-100"
      desktopStyle={{ padding: `50px ${theme().layout.desktopPadding}px` }}
      tabletStyle={{ paddingBottom: 40 }}
      mobileStyle={{ paddingBottom: 40 }}
    >
      <FlexContainer className="w-100 justify-sb" mobileClassName="column" style={{ marginBottom: 24 }} mobileStyle={{ marginTop: 24 }}>
        <FlexContainer gap={16} mobileStyle={{ marginBottom: 16 }}>
          <Label
            withShade={pathname !== ROUTE_STAKE}
            className="pointer"
            fontSize={24}
            fontFamily="syncopate"
            onClick={() => history.push(ROUTE_STAKE)}
          >
            STAKE
          </Label>
          <Label
            withShade={pathname !== ROUTE_UNSTAKE}
            className="pointer"
            fontSize={24}
            fontFamily="syncopate"
            onClick={() => history.push(ROUTE_UNSTAKE)}
          >
            UNSTAKE
          </Label>
        </FlexContainer>
        <InfoPopup title={pathname.substring(1)} type="modal" size="large">
          {pathname === ROUTE_STAKE ? <StakeInfo /> : <UnstakeInfo />}
        </InfoPopup>
      </FlexContainer>

      <FlexContainer gap={24} tabletClassName="column" mobileClassName="column">
        <Position
          amount={estimateUnstakeData?.staked || 0}
          topRightLabel={getPositionLabel()}
          inputAmount={inputAmount}
          buttonLabel={pathname === ROUTE_STAKE ? 'stake' : 'unstake'}
          pendingAmount={(estimateUnstakeData && estimateUnstakeData['stake-record'] && estimateUnstakeData['stake-record']['pending-add']) || false}
          onClickMax={() => setInputAmount(pathname !== ROUTE_UNSTAKE ? kdxAccountBalance : estimateUnstakeData?.staked || 0)}
          setKdxAmount={(value) => setInputAmount(value)}
          onSubmitStake={() => (pathname !== ROUTE_UNSTAKE ? onStakeKDX() : onRollupAndUnstake())}
        />
        <Rewards
          amount={(estimateUnstakeData && estimateUnstakeData['reward-accrued']) || 0}
          rewardsPenalty={estimateUnstakeData && estimateUnstakeData['stake-record'] && estimateUnstakeData['stake-record']['stake-penalty']}
          onWithdrawClick={() => onWithdraw()}
          stakedTimeStart={stakedTimeStart}
        />
        <Analytics apr={'-'} volume={'-'} stakedShare={getAccountStakingPercentage()} totalStaked={getSupplyStakingPercentage()} />
      </FlexContainer>

      <VotingPower daoAccountData={daoAccountData} />
    </FlexContainer>
  );
};

export default StakeContainer;
