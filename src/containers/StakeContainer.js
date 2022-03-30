import React, { useEffect, useState } from 'react';
import Pact from 'pact-lang-api';
import { useHistory, useLocation } from 'react-router-dom';
import { mkReq } from '../api/pact';
import { getPoolState, getAddStakeCommand, geUnstakeCommand, estimateUnstake, getRollupRewardsCommand } from '../api/kaddex.staking';
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
import { useAccountContext, useKaddexWalletContext, useNotificationContext, usePactContext } from '../contexts';
import { ROUTE_STAKE, ROUTE_UNSTAKE } from '../router/routes';
import { network, getCurrentDate, getCurrentTime } from '../constants/contextConstants';
import { theme } from '../styles/theme';

const StakeContainer = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { account, storeNotification } = useAccountContext();
  const { isConnected: isKaddexWalletConnected, requestSign: kaddexWalletRequestSign } = useKaddexWalletContext();
  const { showNotification, STATUSES } = useNotificationContext();
  const pact = usePactContext();

  const toastId = React.useRef(null);

  const [kdxAccountBalance, setKdxAccountBalance] = useState(0);
  const [estimateUnstakeData, setEstimateUnstakeData] = useState(null);
  const [amountToStake, setAmountToStake] = useState(0);

  useEffect(() => {
    if (account?.account) {
      getKDXAccountBalance(account.account).then((kdxBalance) => {
        setKdxAccountBalance(kdxBalance?.balance ?? 0);
      });
      estimateUnstake(account?.account).then((resEstimate) => {
        console.log(`resEstimate`, resEstimate);
        setEstimateUnstakeData(resEstimate);
      });
    }
  }, [account?.account]);

  useEffect(() => {
    getPoolState().then((res) => {
      console.log('poolState', res);
    });
  }, []);

  const signCommand = async (cmd) => {
    if (isKaddexWalletConnected) {
      const res = await kaddexWalletRequestSign(cmd);
      return res.signedCmd;
    } else {
      return await Pact.wallet.sign(cmd);
    }
  };

  const stakeKDX = async () => {
    if (!amountToStake) {
      return;
    }
    const command = getAddStakeCommand(account, amountToStake);
    const signedCommand = await signCommand(command);
    if (!signedCommand) {
      return;
    }
    pact.setPolling(true);
    Pact.wallet
      .sendSigned(signedCommand, network)
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
        await pact.listen(stakingResponse.requestKeys[0]);
        pact.setPolling(false);
        setAmountToStake(0);
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

  const unstakeKDX = async () => {
    const command = geUnstakeCommand(account);
    const signedCommand = await signCommand(command);

    pact.setPolling(true);
    Pact.wallet
      .sendSigned(signedCommand, network)
      .then(async (unstakingResponse) => {
        console.log(' unstakingResponse', unstakingResponse);
        pact.pollingNotif(unstakingResponse.requestKeys[0]);
        storeNotification({
          type: 'info',
          time: getCurrentTime(),
          date: getCurrentDate(),
          title: 'Unstaking Transaction Pending',
          description: unstakingResponse.requestKeys[0],
          isRead: false,
          isCompleted: false,
        });
        await pact.listen(unstakingResponse.requestKeys[0]);
        pact.setPolling(false);
      })
      .catch((error) => {
        console.log(`~ error`, error);
        pact.setPolling(false);
        showNotification({
          title: 'Staking error',
          message: 'Generic unstake error',
          type: STATUSES.ERROR,
        });
      });
  };

  const rollupKDX = async () => {
    const command = getRollupRewardsCommand(account);
    const signedCommand = await signCommand(command);

    fetch(`${network}/api/v1/local`, mkReq(signedCommand))
      .then((response) => response.json())
      .then((unstakingResponse) => {
        console.log(' unstakingResponse', unstakingResponse);
        if (unstakingResponse.result?.status === 'success') {
          showNotification({
            title: 'Unstaking success',
            message: 'Unstaking success!',
            type: STATUSES.SUCCESS,
          });
        } else {
          showNotification({
            title: 'Staking error',
            message: unstakingResponse.result?.error?.message ?? 'Unstake command error',
            type: STATUSES.ERROR,
          });
        }
        setAmountToStake(0);
      })
      .catch((error) => {
        console.log(`~ unstaking error`, error);
        showNotification({
          title: 'Staking error',
          message: 'Generic add stake error',
          type: STATUSES.ERROR,
        });
      });
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
          kdxAccountBalance={kdxAccountBalance}
          amountToStake={amountToStake}
          onClickMax={() => setAmountToStake(200)}
          setKdxAmount={(value) => setAmountToStake(value)}
          buttonLabel={pathname === ROUTE_STAKE ? 'stake' : 'unstake'}
          onSubmitStake={() => stakeKDX()}
        />
        <Rewards
          amount={(estimateUnstakeData && estimateUnstakeData['reward-accrued']) || 0}
          rewardsPenalty={2}
          stakedTime={32}
          disabled={pathname === ROUTE_UNSTAKE}
        />
        <Analytics apr={32} volume={321232.231321} stakedShare={5.16} totalStaked={35.16} />
      </FlexContainer>

      <VotingPower />
    </FlexContainer>
  );
};

export default StakeContainer;
