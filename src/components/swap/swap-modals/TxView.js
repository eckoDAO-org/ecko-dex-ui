import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import { Icon, Divider } from 'semantic-ui-react';
import { LightModeContext } from '../../../contexts/LightModeContext';
import { useGameEditionContext } from '../../../contexts';
import { AccountContext } from '../../../contexts/AccountContext';
import { ErrorIcon, SuccessfullIcon } from '../../../assets';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { SwapContext } from '../../../contexts/SwapContext';
import { extractDecimal, gasUnit, reduceBalance } from '../../../utils/reduceBalance';
import CustomButton from '../../../components/shared/CustomButton';
import reduceToken from '../../../utils/reduceToken';
import { PactContext } from '../../../contexts/PactContext';
import tokenData from '../../../constants/cryptoCurrencies';
import PopupTxView from './PopupTxView';
import { commonColors, theme } from '../../../styles/theme';
import Label from '../../shared/Label';
import { ENABLE_GAS_STATION, GAS_PRICE } from '../../../constants/contextConstants';

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  svg {
    path {
      fill: ${({ theme: { colors }, gameEditionView }) => !gameEditionView && colors.white};
    }
  }
  justify-content: space-between;
  width: 100%;
  height: ${({ gameEditionView }) => gameEditionView && '100%'};
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobileSmallPixel}px`}) {
    svg {
      width: 40px;
      height: 40px;
    }
  }
`;

const TransactionsDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const SpaceBetweenRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
`;

const FlexStartRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const TxView = ({ view, onClose, token0, token1, createTokenPair }) => {
  const swap = useContext(SwapContext);
  const { gameEditionView } = useContext(GameEditionContext);
  const { account } = useContext(AccountContext);
  const { themeMode } = useContext(LightModeContext);
  const pact = useContext(PactContext);

  const [loading, setLoading] = useState(false);

  const showTicker = (ticker) => {
    if (ticker === 'coin') return 'KDA';
    else if (ticker === 'runonflux.flux') return 'FLUX';
    else return ticker.toUpperCase();
  };

  const getTokenIcon = (token) => {
    return tokenData[showTicker(token)]?.icon;
  };

  const successView = () => {
    return (
      <Content gameEditionView={gameEditionView}>
        <Label geCenter geColor="yellow" labelStyle={{ marginTop: 16 }}>
          Preview Successful!
        </Label>
        {!gameEditionView && <SuccessfullIcon style={{ marginTop: 16, marginBottom: 16 }} />}

        <TransactionsDetails>
          <SpaceBetweenRow>
            <Label fontFamily="bold">From</Label>
            <Label fontSize={13}></Label>
          </SpaceBetweenRow>
          <SpaceBetweenRow>
            <Label fontSize={13}>Account</Label>
            <Label fontSize={13}>
              {`${reduceToken(account.account)}`}
              <PopupTxView isAccountPopup />
            </Label>
          </SpaceBetweenRow>
          <SpaceBetweenRow>
            <Label fontSize={13}>Chain ID</Label>
            <Label fontSize={13}>{swap.localRes.metaData.publicMeta.chainId}</Label>
          </SpaceBetweenRow>
          <Divider
            style={{
              width: '100%',
              marginTop: 0,
              borderTop: gameEditionView ? `2px dashed ${theme(themeMode).colors.black}` : `1px solid ${theme(themeMode).colors.white}`,
            }}
          />

          <SpaceBetweenRow>
            <FlexStartRow>
              <Label fontFamily="bold"> {getTokenIcon(swap.localRes.result.data[0].token)}</Label>
              <Label fontFamily="bold">{`${extractDecimal(swap.localRes.result.data[0].amount)} `}</Label>
            </FlexStartRow>
            <Label fontFamily="bold">{` ${showTicker(swap.localRes.result.data[0].token)}`}</Label>
          </SpaceBetweenRow>
          <SpaceBetweenRow>
            <Label fontFamily="bold">
              <Icon name="long arrow alternate down" style={{}} />
            </Label>
            <Label fontSize={13}>{`1 ${showTicker(swap.localRes.result.data[0].token)} = ${reduceBalance(pact.computeOut(1), 12)} ${showTicker(
              swap.localRes.result.data[1].token
            )}`}</Label>
          </SpaceBetweenRow>
          <SpaceBetweenRow>
            <FlexStartRow>
              <Label fontFamily="bold"> {getTokenIcon(swap.localRes.result.data[1].token)}</Label>
              <Label fontFamily="bold">{`${extractDecimal(swap.localRes.result.data[1].amount)} `}</Label>
            </FlexStartRow>
            <Label fontFamily="bold">{` ${showTicker(swap.localRes.result.data[1].token)}`}</Label>
          </SpaceBetweenRow>
          <SpaceBetweenRow>
            <Label fontSize={13}>Gas Cost</Label>
            <div style={{ display: 'flex' }}>
              {ENABLE_GAS_STATION ? (
                <>
                  <Label fontSize={13} color={commonColors.green} geColor="green">{`${gasUnit(GAS_PRICE * swap.localRes.gas)} KDA`}</Label>
                  <Label fontSize={13} color={commonColors.green} geColor="green" labelStyle={{ marginLeft: 5 }}>
                    FREE!
                  </Label>
                </>
              ) : (
                <Label color={commonColors.green} geColor="green">{`${gasUnit(GAS_PRICE * swap.localRes.gas)} KDA`}</Label>
              )}
              {ENABLE_GAS_STATION && <PopupTxView popupStyle={{ maxWidth: '400px' }} />}
            </div>
          </SpaceBetweenRow>
        </TransactionsDetails>
        <CustomButton
          type="secondary"
          buttonStyle={{
            width: '100%',
            marginTop: !gameEditionView && '16px',
            marginBottom: gameEditionView && '16px',
          }}
          onClick={async () => {
            setLoading(true);
            swap.swapSend();
            onClose();
            setLoading(false);
          }}
          loading={loading}
        >
          Send Transaction
        </CustomButton>
      </Content>
    );
  };

  const successRemoveView = () => {
    return (
      <Content gameEditionView={gameEditionView} style={{ bottom: gameEditionView && '132px' }}>
        <Label geCenter geColor="yellow" labelStyle={{ marginTop: 16 }}>
          Preview Successful!
        </Label>

        {!gameEditionView && <SuccessfullIcon style={{ marginTop: 16, marginBottom: 16 }} />}
        <TransactionsDetails>
          <FlexStartRow style={{ marginBottom: 16 }}>
            <Label fontFamily="bold">Remove</Label>
          </FlexStartRow>
          <SpaceBetweenRow>
            <FlexStartRow>
              {getTokenIcon(token0)}

              <Label fontFamily="bold">{`${extractDecimal(swap?.localRes?.result?.data?.amount0)} `}</Label>
            </FlexStartRow>
            <Label fontFamily="bold">{` ${showTicker(token0)}`}</Label>
          </SpaceBetweenRow>
          <FlexStartRow style={{ marginBottom: 16 }}>
            <Label fontFamily="bold">Remove</Label>
          </FlexStartRow>
          <SpaceBetweenRow>
            <FlexStartRow>
              {getTokenIcon(token1)}

              <Label fontFamily="bold">{`${extractDecimal(swap?.localRes?.result?.data?.amount1)} `}</Label>
            </FlexStartRow>
            <Label fontFamily="bold">{` ${showTicker(token1)}`}</Label>
          </SpaceBetweenRow>

          <SpaceBetweenRow>
            <Label fontSize={13}>Gas Cost</Label>
            <div style={{ display: 'flex' }}>
              {ENABLE_GAS_STATION ? (
                <>
                  <Label fontSize={13} color={commonColors.green} geColor="green">{`${gasUnit(GAS_PRICE * swap.localRes.gas)} KDA`}</Label>
                  <Label fontSize={13} color={commonColors.green} geColor="green" labelStyle={{ marginLeft: 5 }}>
                    FREE!
                  </Label>
                </>
              ) : (
                <Label color={commonColors.green} geColor="green">{`${gasUnit(GAS_PRICE * swap.localRes.gas)} KDA`}</Label>
              )}
              {ENABLE_GAS_STATION && <PopupTxView popupStyle={{ maxWidth: '400px' }} />}
            </div>
          </SpaceBetweenRow>
        </TransactionsDetails>
        <CustomButton
          type="secondary"
          buttonStyle={{
            width: '100%',
            marginTop: !gameEditionView && '16px',
            marginBottom: gameEditionView && '16px',
          }}
          onClick={async () => {
            setLoading(true);
            swap.swapSend();
            onClose();
            setLoading(false);
          }}
          loading={loading}
        >
          Send Transaction
        </CustomButton>
      </Content>
    );
  };

  const successAddView = () => {
    return (
      <Content gameEditionView={gameEditionView}>
        <Label geCenter geColor="yellow" labelStyle={{ marginTop: 16 }}>
          Preview Successful!
        </Label>
        {!gameEditionView && <SuccessfullIcon style={{ marginTop: 16, marginBottom: 16 }} />}
        <TransactionsDetails>
          <FlexStartRow style={{ marginBottom: 16 }}>
            <Label fontSize={13}>Add</Label>
          </FlexStartRow>
          <SpaceBetweenRow>
            <FlexStartRow>
              {getTokenIcon(token0)}
              <Label fontFamily="bold">{`${extractDecimal(swap.localRes.result.data.amount0)}`}</Label>
            </FlexStartRow>
            <Label fontFamily="bold">{` ${showTicker(token0)}`}</Label>
          </SpaceBetweenRow>
          <FlexStartRow style={{ marginBottom: 16 }}>
            <Label fontSize={13}>Add</Label>
          </FlexStartRow>
          <SpaceBetweenRow>
            <FlexStartRow>
              {getTokenIcon(token1)}
              <Label fontFamily="bold">{`${extractDecimal(swap.localRes.result.data.amount1)} `}</Label>
            </FlexStartRow>
            <Label fontFamily="bold">{` ${showTicker(token1)}`}</Label>
          </SpaceBetweenRow>
          <SpaceBetweenRow>
            <Label fontSize={13}>Gas Cost</Label>
            <div style={{ display: 'flex' }}>
              {ENABLE_GAS_STATION ? (
                <>
                  <Label fontSize={13} color={commonColors.green} geColor="green">{`${gasUnit(GAS_PRICE * swap.localRes.gas)} KDA`}</Label>
                  <Label fontSize={13} color={commonColors.green} geColor="green" labelStyle={{ marginLeft: 5 }}>
                    FREE!
                  </Label>
                </>
              ) : (
                <Label color={commonColors.green} geColor="green">{`${gasUnit(GAS_PRICE * swap.localRes.gas)} KDA`}</Label>
              )}
              {ENABLE_GAS_STATION && <PopupTxView popupStyle={{ maxWidth: '400px' }} />}
            </div>
          </SpaceBetweenRow>
        </TransactionsDetails>
        <CustomButton
          type="secondary"
          buttonStyle={{
            width: '100%',
            marginTop: !gameEditionView && '16px',
            marginBottom: gameEditionView && '16px',
          }}
          onClick={async () => {
            setLoading(true);
            if (view === 'Add Liquidity') {
              swap.swapSend();
              onClose();
            } else {
              await createTokenPair();
              await swap.swapSend();
              onClose();
            }
            setLoading(false);
          }}
          loading={loading}
        >
          Send Transaction
        </CustomButton>
      </Content>
    );
  };

  const failView = () => {
    return (
      <Content gameEditionView={gameEditionView}>
        {!gameEditionView && <ErrorIcon style={{ marginTop: 16, marginBottom: 16 }} />}
        <Label geCenter geColor="yellow">
          Preview Failed!
        </Label>
        <Label fontFamily="bold" labelStyle={{ marginBottom: ' 12px', marginTop: 16, width: '100%' }}>
          Error Message
        </Label>
        <TransactionsDetails style={{ marginTop: 16, marginBottom: 16 }}>
          <Message color="red">{swap?.localRes?.result?.error?.message}</Message>

          {swap?.localRes?.result?.error?.message?.includes('insufficient') && (
            <Label geColor="blue" geCenter labelStyle={{ marginTop: 16 }} geLabelStyle={{ marginTop: 16 }}>
              TIP: Try setting a higher slippage amount
            </Label>
          )}
        </TransactionsDetails>

        <CustomButton
          onClick={() => {
            onClose();
          }}
          geType="retry"
          buttonStyle={{
            marginTop: !gameEditionView && '16px',
          }}
        >
          Retry
        </CustomButton>
      </Content>
    );
  };

  const localError = () => {
    return (
      <Content gameEditionView={gameEditionView} style={{ marginTop: 16 }}>
        <Label geCenter geColor="yellow">
          Transaction Error!
        </Label>
        {!gameEditionView && <ErrorIcon style={{ width: '60px', height: ' 60px', margin: '16px 0' }} />}
        <Label fontFamily="bold" labelStyle={{ marginBottom: ' 12px', marginTop: 16, width: '100%' }}>
          Error Message
        </Label>
        <TransactionsDetails style={{ marginTop: 16, marginBottom: 16 }}>
          <Message color="red" style={{ wordBreak: 'break-all' }}>
            {swap?.localRes}
          </Message>
        </TransactionsDetails>
        <CustomButton
          buttonStyle={{
            width: '100%',
            marginTop: !gameEditionView && '16px',
          }}
          geType="retry"
          onClick={() => {
            onClose();
          }}
        >
          Retry
        </CustomButton>
      </Content>
    );
  };

  const renderSwitch = () => {
    if (swap.localRes && swap.localRes.result && swap.localRes.result.status === 'success') {
      switch (view) {
        default:
          return () => {};
        case 'Remove Liquidity':
          return successRemoveView();
        case 'Add Liquidity':
          return successAddView();
        case undefined:
          return successView();
      }
    } else return failView();
  };
  return typeof swap.localRes === 'string' ? localError() : renderSwitch();
};

export default TxView;

const MessageContainer = styled.div`
  border: ${({ color, gameEditionView }) => (gameEditionView ? `2px dashed ${color}` : `1px solid ${color}`)};
  padding: 16px 24px;
  border-radius: ${({ gameEditionView }) => !gameEditionView && '4px'};
  background-color: ${({ gameEditionView, theme: { colors } }) => !gameEditionView && colors.black};
`;
const Message = ({ color, children }) => {
  const { gameEditionView } = useGameEditionContext();

  const getColor = () => {
    switch (color) {
      case 'red':
        return commonColors.error;
      default:
        return null;
    }
  };
  return (
    <MessageContainer gameEditionView={gameEditionView} color={getColor()}>
      <Label color={getColor()} geColor={color} labelStyle={{ wordBreak: 'break-all' }} geLabelStyle={{ wordBreak: 'break-all' }}>
        {children}
      </Label>
    </MessageContainer>
  );
};
