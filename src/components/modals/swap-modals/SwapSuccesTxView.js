import React, { useContext } from 'react';
import { AccountContext } from '../../../contexts/AccountContext';
import { PactContext } from '../../../contexts/PactContext';
import { extractDecimal, gasUnit, reduceBalance } from '../../../utils/reduceBalance';
import reduceToken from '../../../utils/reduceToken';
import { getTokenIcon, showTicker } from '../../../utils/token-utils';
import GameEditionLabel from '../../game-edition-v2/components/GameEditionLabel';
import { Row, SuccessViewContainerGE, SuccesViewContainer } from './common-result-components';
import { ChainIcon } from '../../../assets';
import { ENABLE_GAS_STATION, GAS_PRICE } from '../../../constants/contextConstants';
import { Divider, Icon, Label } from 'semantic-ui-react';
import PopupTxView from './PopupTxView';
import { theme } from '../../../styles/theme';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { LightModeContext } from '../../../contexts/LightModeContext';

export const SwapSuccessViewGE = ({ swap }) => {
  const { account } = useContext(AccountContext);

  const pact = useContext(PactContext);

  return (
    <SuccessViewContainerGE
      containerStyle={{ marginTop: 16 }}
      leftItem={
        <>
          <Row className="fs">
            {getTokenIcon(swap?.localRes?.result?.data[0]?.token)}
            <GameEditionLabel fontSize={32} color="black" fontFamily="bold">
              {extractDecimal(swap?.localRes?.result?.data[0]?.amount)}
            </GameEditionLabel>
          </Row>

          <GameEditionLabel color="blue">From</GameEditionLabel>
          <Row className="fs">
            <GameEditionLabel fontSize={22} color="blue-grey">
              {reduceToken(account.account)}
            </GameEditionLabel>
            <ChainIcon className="chain-icon" />
            <GameEditionLabel fontSize={22} color="blue-grey">
              {swap?.localRes?.metaData?.publicMeta?.chainId}
            </GameEditionLabel>
          </Row>
        </>
      }
      rightItem={
        <>
          <Row className="fs">
            {getTokenIcon(swap?.localRes?.result?.data[1]?.token)}
            <GameEditionLabel fontSize={32} color="black" fontFamily="bold">
              {extractDecimal(swap?.localRes?.result?.data[1]?.amount)}
            </GameEditionLabel>
          </Row>
          <GameEditionLabel color="blue">From</GameEditionLabel>
          <Row className="fs">
            <GameEditionLabel fontSize={22} color="blue-grey">
              {reduceToken(account.account)}
            </GameEditionLabel>
            <ChainIcon className="chain-icon" />
            <GameEditionLabel fontSize={22} color="blue-grey">
              {swap?.localRes?.metaData?.publicMeta?.chainId}
            </GameEditionLabel>
          </Row>
        </>
      }
      infoItems={[
        {
          label: `${showTicker(swap?.localRes?.result?.data[0]?.token)}/${showTicker(swap?.localRes?.result?.data[1]?.token)}`,
          value: `1 = ${reduceBalance(pact?.computeOut(1), 12)}`,
        },
        {
          label: 'gas cost KDA',
          value: ENABLE_GAS_STATION ? (
            <>
              <GameEditionLabel geColor="white">{gasUnit(GAS_PRICE * swap?.localRes?.gas)} KDA</GameEditionLabel>
              <GameEditionLabel geColor="white" labelStyle={{ marginLeft: 5 }}>
                FREE!
              </GameEditionLabel>
            </>
          ) : (
            <GameEditionLabel geColor="white">{gasUnit(GAS_PRICE * swap?.localRes?.gas)} KDA</GameEditionLabel>
          ),
        },
      ]}
    />
  );
};

export const SwapSuccessView = ({ swap, loading, sendTransaction }) => {
  const { account } = useContext(AccountContext);
  const pact = useContext(PactContext);
  const { gameEditionView } = useContext(GameEditionContext);
  const { themeMode } = useContext(LightModeContext);

  return (
    <SuccesViewContainer
      swap={swap}
      loading={loading}
      onClick={() => {
        sendTransaction();
      }}
    >
      <Row className="sb">
        <Label fontFamily="bold">From</Label>
        <Label fontSize={13}></Label>
      </Row>
      <Row className="sb">
        <Label fontSize={13}>Account</Label>
        <Label fontSize={13}>
          {`${reduceToken(account.account)}`}
          <PopupTxView isAccountPopup />
        </Label>
      </Row>
      <Row className="sb">
        <Label fontSize={13}>Chain ID</Label>
        <Label fontSize={13}>{swap?.localRes?.metaData?.publicMeta?.chainId}</Label>
      </Row>
      <Divider
        style={{
          width: '100%',
          marginTop: 0,
          borderTop: gameEditionView ? `2px dashed ${theme(themeMode).colors.black}` : `1px solid ${theme(themeMode).colors.white}`,
        }}
      />

      <Row className="sb">
        <Row className="fs">
          <Label fontFamily="bold"> {getTokenIcon(swap?.localRes?.result?.data[0]?.token)}</Label>
          <Label fontFamily="bold">{extractDecimal(swap?.localRes?.result?.data[0]?.amount)}</Label>
        </Row>
        <Label fontFamily="bold">{showTicker(swap?.localRes?.result?.data[0]?.token)}</Label>
      </Row>
      <Row className="sb">
        <Label fontFamily="bold">
          <Icon name="long arrow alternate down" style={{}} />
        </Label>
        <Label fontSize={13}>{`1 ${showTicker(swap?.localRes?.result?.data[0]?.token)} = ${reduceBalance(pact?.computeOut(1), 12)} ${showTicker(
          swap?.localRes?.result?.data[1]?.token
        )}`}</Label>
      </Row>
      <Row className="sb">
        <Row className="fs">
          <Label fontFamily="bold"> {getTokenIcon(swap?.localRes?.result?.data[1]?.token)}</Label>
          <Label fontFamily="bold">{`${extractDecimal(swap?.localRes?.result?.data[1]?.amount)} `}</Label>
        </Row>
        <Label fontFamily="bold">{` ${showTicker(swap?.localRes?.result?.data[1]?.token)}`}</Label>
      </Row>
    </SuccesViewContainer>
  );
};
