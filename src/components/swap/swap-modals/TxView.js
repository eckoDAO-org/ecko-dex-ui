import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { Icon, Divider } from 'semantic-ui-react';
import { LightModeContext } from '../../../contexts/LightModeContext';
import { useGameEditionContext } from '../../../contexts';
import { AccountContext } from '../../../contexts/AccountContext';
import { ChainIcon, ErrorIcon, PixeledCircleArrowIcon, SuccessfullIcon } from '../../../assets';
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
import { LIQUIDITY_VIEW } from '../../../constants/liquidityView';
import pixeledInfoContainerWhite from '../../../assets/images/game-edition/pixeled-info-container-white.svg';
import GameEditionLabel from '../../game-edition-v2/components/GameEditionLabel';
import PixeledInfoContainerBlue from '../../game-edition-v2/components/PixeledInfoContainerBlue';
import PressButtonToActionLabel from '../../game-edition-v2/components/PressButtonToActionLabel';

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  & > *:not(:last-child) {
    margin-bottom: 16px;
  }
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
  & > *:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  &.sb {
    justify-content: space-between;
  }
  &.fs {
    justify-content: flex-start;
  }
  &.c {
    justify-content: center;
  }
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  & > *:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const PixeledInfoContainerWhite = styled.div`
  margin-top: 20px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: ${`url(${pixeledInfoContainerWhite})`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 108px;
  width: 193px;
  padding-left: 18px;

  .chain-icon {
    margin-left: 4px;
    margin-right: 2px;
  }
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
    else return ticker?.toUpperCase();
  };

  const getTokenIcon = (token) => {
    return tokenData[showTicker(token)]?.icon;
  };

  const sendTransaction = () => {
    setLoading(true);
    swap.swapSend();
    onClose();
    setLoading(false);
  };

  const successViewGE = () => {
    return (
      <PreviewContainer gameEditionView={gameEditionView}>
        <Row className="sb" style={{ position: 'relative' }}>
          <PixeledInfoContainerWhite>
            <Row className="fs">
              {getTokenIcon(swap?.localRes?.result?.data[0]?.token)}
              <GameEditionLabel fontSize={32} color="black" fontFamily="bold" style={{ marginLeft: 6.5 }}>
                {`${extractDecimal(swap?.localRes?.result?.data[0]?.amount)} `}
              </GameEditionLabel>
            </Row>

            <GameEditionLabel color="blue">From</GameEditionLabel>
            <Row className="fs">
              <GameEditionLabel fontSize={22} color="blue-grey">{`${reduceToken(account.account)}`}</GameEditionLabel>
              <ChainIcon className="chain-icon" />
              <GameEditionLabel fontSize={22} color="blue-grey">
                {swap?.localRes?.metaData?.publicMeta?.chainId}
              </GameEditionLabel>
            </Row>
          </PixeledInfoContainerWhite>
          <PixeledCircleArrowIcon
            style={{ position: 'absolute', width: 51.5, height: 49, top: 'calc(50% - 20px)', left: '44%', transform: 'rotate(-90deg)' }}
          />
          <PixeledInfoContainerWhite>
            <Row className="fs">
              {getTokenIcon(swap?.localRes?.result?.data[1]?.token)}
              <GameEditionLabel fontSize={32} color="black" fontFamily="bold" style={{ marginLeft: 6.5 }}>
                {`${extractDecimal(swap?.localRes?.result?.data[1]?.amount)} `}
              </GameEditionLabel>
            </Row>

            <GameEditionLabel color="blue">From</GameEditionLabel>
            <Row className="fs">
              <GameEditionLabel fontSize={22} color="blue-grey">{`${reduceToken(account.account)}`}</GameEditionLabel>
              <ChainIcon className="chain-icon" />
              <GameEditionLabel fontSize={22} color="blue-grey">
                {swap?.localRes?.metaData?.publicMeta?.chainId}
              </GameEditionLabel>
            </Row>
          </PixeledInfoContainerWhite>
        </Row>
        <Row className="sb">
          <PixeledInfoContainerBlue gameEditionView>
            <GameEditionLabel color="blue">
              price {showTicker(swap?.localRes?.result?.data[0]?.token)} per {showTicker(swap?.localRes?.result?.data[1]?.token)}
            </GameEditionLabel>
            <GameEditionLabel color="white">1 = {reduceBalance(pact?.computeOut(1), 12)}</GameEditionLabel>
          </PixeledInfoContainerBlue>
          <PixeledInfoContainerBlue gameEditionView>
            <GameEditionLabel color="blue">gas cost KDA</GameEditionLabel>
            {ENABLE_GAS_STATION ? (
              <>
                <GameEditionLabel fontSize={13} geColor="white">{`${gasUnit(GAS_PRICE * swap?.localRes?.gas)} KDA`}</GameEditionLabel>
                <GameEditionLabel fontSize={13} geColor="white" labelStyle={{ marginLeft: 5 }}>
                  FREE!
                </GameEditionLabel>
              </>
            ) : (
              <GameEditionLabel fontSize={13} geColor="white">{`${gasUnit(GAS_PRICE * swap?.localRes?.gas)} KDA`}</GameEditionLabel>
            )}
          </PixeledInfoContainerBlue>
        </Row>
        <Row className="c">
          <PressButtonToActionLabel actionLabel="send" />
        </Row>
      </PreviewContainer>
    );
  };

  const successView = () => {
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
            <Label fontFamily="bold">{`${extractDecimal(swap?.localRes?.result?.data[0]?.amount)} `}</Label>
          </Row>
          <Label fontFamily="bold">{` ${showTicker(swap?.localRes?.result?.data[0]?.token)}`}</Label>
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

  const successRemoveView = () => {
    return (
      <SuccesViewContainer
        swap={swap}
        loading={loading}
        onClick={() => {
          sendTransaction();
        }}
      >
        <Row className="fs">
          <Label fontFamily="bold">Remove</Label>
        </Row>
        <Row className="sb">
          <Row className="fs">
            {getTokenIcon(token0)}

            <Label fontFamily="bold">{`${extractDecimal(swap?.localRes?.result?.data?.amount0)} `}</Label>
          </Row>
          <Label fontFamily="bold">{` ${showTicker(token0)}`}</Label>
        </Row>
        <Row className="fs">
          <Label fontFamily="bold">Remove</Label>
        </Row>
        <Row className="sb">
          <Row className="fs">
            {getTokenIcon(token1)}

            <Label fontFamily="bold">{`${extractDecimal(swap?.localRes?.result?.data?.amount1)} `}</Label>
          </Row>
          <Label fontFamily="bold">{` ${showTicker(token1)}`}</Label>
        </Row>
      </SuccesViewContainer>
    );
  };

  const successAddView = () => {
    return (
      <SuccesViewContainer
        swap={swap}
        loading={loading}
        onClick={async () => {
          setLoading(true);
          if (view === LIQUIDITY_VIEW.ADD_LIQUIDITY) {
            swap.swapSend();
            onClose();
          } else {
            await createTokenPair();
            await swap.swapSend();
            onClose();
          }
          setLoading(false);
        }}
      >
        <Row className="fs">
          <Label fontSize={13}>Add</Label>
        </Row>
        <Row className="sb">
          <Row className="fs">
            {getTokenIcon(token0)}
            <Label fontFamily="bold">{`${extractDecimal(swap.localRes.result.data.amount0)}`}</Label>
          </Row>
          <Label fontFamily="bold">{` ${showTicker(token0)}`}</Label>
        </Row>
        <Row className="fs">
          <Label fontSize={13}>Add</Label>
        </Row>
        <Row className="sb">
          <Row className="fs">
            {getTokenIcon(token1)}
            <Label fontFamily="bold">{`${extractDecimal(swap.localRes.result.data.amount1)} `}</Label>
          </Row>
          <Label fontFamily="bold">{` ${showTicker(token1)}`}</Label>
        </Row>
      </SuccesViewContainer>
    );
  };

  const failView = () => {
    return (
      <Content gameEditionView={gameEditionView}>
        {!gameEditionView && <ErrorIcon />}
        <Label geCenter geColor="yellow">
          Preview Failed!
        </Label>
        <Label fontFamily="bold" labelStyle={{ marginBottom: ' 12px', marginTop: 16, width: '100%' }}>
          Error Message
        </Label>
        <TransactionsDetails>
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
        <Label fontFamily="bold" geCenter geColor="yellow">
          Transaction Error!
        </Label>
        {!gameEditionView && <ErrorIcon style={{ width: '60px', height: ' 60px', margin: '16px 0' }} />}
        <Label fontFamily="bold" labelStyle={{ marginBottom: ' 12px', marginTop: 16, width: '100%' }}>
          Error Message
        </Label>
        <TransactionsDetails>
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
        case LIQUIDITY_VIEW.REMOVE_LIQUIDITY:
          return successRemoveView();
        case LIQUIDITY_VIEW.ADD_LIQUIDITY:
          return successAddView();
        case undefined:
          return gameEditionView ? successViewGE() : successView();
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

// GAS COST COMPONENT
const GasCost = ({ swap }) => {
  return (
    <Row className="sb">
      <Label fontSize={13}>Gas Cost</Label>
      <div style={{ display: 'flex' }}>
        {ENABLE_GAS_STATION ? (
          <>
            <Label fontSize={13} color={commonColors.green} geColor="green">
              {gasUnit(GAS_PRICE * swap?.localRes?.gas)} KDA
            </Label>
            <Label fontSize={13} color={commonColors.green} geColor="green" labelStyle={{ marginLeft: 5 }}>
              FREE!
            </Label>
          </>
        ) : (
          <Label fontSize={13} color={commonColors.green} geColor="green">
            {gasUnit(GAS_PRICE * swap?.localRes?.gas)} KDA
          </Label>
        )}
        {ENABLE_GAS_STATION && <PopupTxView popupStyle={{ maxWidth: '400px' }} />}
      </div>
    </Row>
  );
};

// CONTENT CONTAINER
const SuccesViewContainer = ({ swap, onClick, loading, children }) => {
  const { gameEditionView } = useGameEditionContext();
  return (
    <Content gameEditionView={gameEditionView}>
      <Label fontFamily="bold" geCenter geColor="yellow" labelStyle={{ marginTop: 16 }}>
        Preview Successful!
      </Label>
      {!gameEditionView && <SuccessfullIcon />}

      <TransactionsDetails>
        {children}
        <GasCost swap={swap} />
      </TransactionsDetails>
      <CustomButton
        type="secondary"
        buttonStyle={{
          width: '100%',
          marginTop: !gameEditionView && '16px',
          marginBottom: gameEditionView && '16px',
        }}
        onClick={async () => {
          await onClick();
        }}
        loading={loading}
      >
        Send Transaction
      </CustomButton>
    </Content>
  );
};
