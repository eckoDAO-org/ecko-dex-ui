import React, { useEffect, useState } from 'react';
import Pact from 'pact-lang-api';
import { useHistory, useLocation } from 'react-router-dom';
import { getPoolState } from '../api/kaddex.staking';
import { reduceBalance } from '../utils/reduceBalance';
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
import { useAccountContext, useWalletContext, usePactContext, useKaddexWalletContext } from '../contexts';
import { ROUTE_STAKE, ROUTE_UNSTAKE } from '../router/routes';
import {
  chainId,
  creationTime,
  GAS_PRICE,
  network,
  NETWORKID,
  ENABLE_GAS_STATION,
  getCurrentDate,
  getCurrentTime,
} from '../constants/contextConstants';
import { theme } from '../styles/theme';

const StakeContainer = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { account } = useAccountContext();
  const { isConnected: isKaddexWalletConnected, requestSign: kaddexWalletRequestSign } = useKaddexWalletContext();
  const pact = usePactContext();
  const wallet = useWalletContext();

  const [kdxAccountBalance, setKdxAccountBalance] = useState(0);
  const [amountToStake, setAmountToStake] = useState(0);

  useEffect(() => {
    if (account?.account) {
      getKDXAccountBalance(account.account).then((kdxBalance) => {
        setKdxAccountBalance(kdxBalance?.balance);
      });
    }
  }, [account?.account]);

  useEffect(() => {
    getPoolState().then((res) => {
      console.log('poolState', res);
    });
  }, []);

  const stakeKDX = async () => {
    try {
      const pactCode = `(kaddex.staking.stake "${account?.account}" 20.0)`;
      const signCmd = {
        pactCode,
        caps: [
          Pact.lang.mkCap('wrap capability', 'wrapping skdx', `kaddex.kdx.WRAP`, ['skdx', account.account, account.account, 20.0]),
          Pact.lang.mkCap('stake capability', 'staking', `kaddex.staking.STAKE`, [account.account, 20.0]),
          Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS'),
        ],
        sender: account.account,
        gasLimit: 3000,
        gasPrice: GAS_PRICE,
        chainId: chainId,
        ttl: 600,
        envData: {
          'user-ks': account.guard,
        },
        signingPubKey: account.guard.keys[0],
        networkId: NETWORKID,
      };
      //alert to sign tx
      /* walletLoading(); */
      wallet.setIsWaitingForWalletAuth(true);
      let command = null;
      if (isKaddexWalletConnected) {
        const res = await kaddexWalletRequestSign(signCmd);
        command = res.signedCmd;
      } else {
        console.log('🚀 !!! ~ signCmd', JSON.stringify(JSON.stringify(signCmd)));
        command = await Pact.wallet.sign(signCmd);
      }
      //close alert programmatically
      /* swal.close(); */
      wallet.setIsWaitingForWalletAuth(false);
      wallet.setWalletSuccess(true);
      //set signedtx
      let stakingResponse = await fetch(`${network}/api/v1/local`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(command),
      });
      console.log('🚀 !!! ~ stakingResponse', stakingResponse);
    } catch (e) {
      //wallet error alert
      /* setLocalRes({}); */
      if (e.message.includes('Failed to fetch'))
        wallet.setWalletError({
          error: true,
          title: 'No Wallet',
          content: 'Please make sure you open and login to your wallet.',
        });
      //walletError();
      else
        wallet.setWalletError({
          error: true,
          title: 'Wallet Signing Failure',
          content:
            'You cancelled the transaction or did not sign it correctly. Please make sure you sign with the keys of the account linked in Kaddex.',
        }); //walletSigError();
      console.log(e);
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
          amount={231.3213}
          kdxAccountBalance={kdxAccountBalance}
          amountToStake={amountToStake}
          onClickMax={() => setAmountToStake(200)}
          setKdxAmount={(value) => setAmountToStake(value)}
          buttonLabel={pathname === ROUTE_STAKE ? 'stake' : 'unstake'}
          onSubmitStake={() => {
            console.log('Staking ' + amountToStake + ' kdx...');
            stakeKDX();
          }}
        />
        <Rewards amount={231.3213} rewardsPenalty={2} stakedTime={32} disabled={pathname === ROUTE_UNSTAKE} />
        <Analytics apr={32} volume={321232.231321} stakedShare={5.16} totalStaked={35.16} />
      </FlexContainer>

      <VotingPower />
    </FlexContainer>
  );
};

export default StakeContainer;
