import React, { useContext, useEffect, useState } from 'react';
import styled, { css } from 'styled-components/macro';
import { Icon, Divider } from 'semantic-ui-react';
import { LightModeContext } from '../../../contexts/LightModeContext';
import { useGameEditionContext } from '../../../contexts';
import { AccountContext } from '../../../contexts/AccountContext';
import { ChainIcon, ErrorIcon, PixeledCircleArrowIcon, SuccessfullIcon } from '../../../assets';
import { GameEditionContext, GE_DESKTOP_CONFIGURATION } from '../../../contexts/GameEditionContext';
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
import PixeledInfoContainerBlue, { InfoContainer } from '../../game-edition-v2/components/PixeledInfoContainerBlue';
import PressButtonToActionLabel from '../../game-edition-v2/components/PressButtonToActionLabel';
import { PixeledInfoContainerWhite } from '../../game-edition-v2/components/PixeledInfoContainerWhite';

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  & > *:not(:last-child) {
    margin-bottom: 16px;
  }
  svg {
    path {
      fill: ${({ theme: { colors }, gameEditionView }) => !gameEditionView && colors.white};
    }
  }

  ${({ gameEditionView }) => {
    if (gameEditionView) {
      return css`
        padding: 16px;
        height: 100%;
      `;
    }
  }}

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
      <SuccessViewContainerGE
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
            label: `price ${showTicker(swap?.localRes?.result?.data[0]?.token)} per ${showTicker(swap?.localRes?.result?.data[1]?.token)}`,
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

  const successAddRemoveViewGE = ({ label }) => {
    return (
      <SuccessViewContainerGE
        hideIcon
        title={label}
        leftItem={
          <>
            <GameEditionLabel fontSize={32} color="blue">
              {showTicker(token0)}
            </GameEditionLabel>
            <Row className="fs">
              {getTokenIcon(token0)}
              <GameEditionLabel fontSize={22} color="blue-grey">
                {extractDecimal(swap?.localRes?.result?.data?.amount0)}
              </GameEditionLabel>
            </Row>
          </>
        }
        rightItem={
          <>
            <GameEditionLabel fontSize={32} color="blue">
              {showTicker(token1)}
            </GameEditionLabel>

            <Row className="fs">
              {getTokenIcon(token1)}
              <GameEditionLabel fontSize={22} color="blue-grey">
                {extractDecimal(swap?.localRes?.result?.data?.amount1)}
              </GameEditionLabel>
            </Row>
          </>
        }
        infoItems={[
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

  const successAddRemoveView = ({ label, onClick }) => {
    return (
      <SuccesViewContainer swap={swap} loading={loading} onClick={onClick}>
        <Row className="fs">
          <Label fontFamily="bold">{label}</Label>
        </Row>
        <Row className="sb">
          <Row className="fs">
            {getTokenIcon(token0)}
            <Label fontFamily="bold">{extractDecimal(swap?.localRes?.result?.data?.amount0)}</Label>
          </Row>
          <Label fontFamily="bold">{showTicker(token0)}</Label>
        </Row>
        <Row className="fs">
          <Label fontFamily="bold">{label}</Label>
        </Row>
        <Row className="sb">
          <Row className="fs">
            {getTokenIcon(token1)}
            <Label fontFamily="bold">{extractDecimal(swap?.localRes?.result?.data?.amount1)}</Label>
          </Row>
          <Label fontFamily="bold">{showTicker(token1)}</Label>
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
        <Label fontFamily="bold" labelStyle={{ marginBottom: ' 12px', width: '100%' }}>
          Error Message
        </Label>
        <TransactionsDetails>
          <Message color="red">{swap?.localRes?.result?.error?.message}</Message>

          {swap?.localRes?.result?.error?.message?.includes('insufficient') && (
            <Label geColor="blue" geCenter>
              TIP: Try setting a higher slippage amount
            </Label>
          )}
        </TransactionsDetails>

        <CustomButton
          onClick={() => {
            onClose();
          }}
          geType="retry"
        >
          Retry
        </CustomButton>
      </Content>
    );
  };

  const localError = () => {
    return (
      <Content gameEditionView={gameEditionView}>
        <Label fontFamily="bold" geCenter geColor="yellow" labelStyle={{ marginTop: 16 }}>
          Transaction Error!
        </Label>
        {!gameEditionView && <ErrorIcon style={{ width: '60px', height: ' 60px', margin: '16px 0' }} />}
        <Label fontFamily="bold" labelStyle={{ marginBottom: ' 12px', width: '100%' }}>
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

  const onAddLiquidity = async () => {
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
  };

  const renderSwitch = () => {
    if (swap.localRes && swap.localRes.result && swap.localRes.result.status === 'success') {
      switch (view) {
        default:
          return () => {};
        case LIQUIDITY_VIEW.REMOVE_LIQUIDITY:
          return gameEditionView ? successAddRemoveViewGE({ label: 'Remove' }) : successAddRemoveView({ label: 'Remove', onClick: sendTransaction });
        case LIQUIDITY_VIEW.ADD_LIQUIDITY:
          return gameEditionView ? successAddRemoveViewGE({ label: 'Add' }) : successAddRemoveView({ label: 'Add', onClick: onAddLiquidity });
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

const SuccessViewContainerGE = ({ leftItem, rightItem, infoItems, hideIcon, title }) => {
  const { gameEditionView } = useGameEditionContext();
  return (
    <PreviewContainer gameEditionView={gameEditionView}>
      {title && (
        <GameEditionLabel center color="yellow" fontSize={24} style={{ marginBottom: 0 }}>
          {title}
        </GameEditionLabel>
      )}
      <Row className="sb" style={{ position: 'relative', paddingLeft: 16, paddingRight: 16 }}>
        <PixeledInfoContainerWhite>{leftItem}</PixeledInfoContainerWhite>
        {!hideIcon && (
          <PixeledCircleArrowIcon
            style={{ position: 'absolute', width: 51.5, height: 49, top: 'calc(50% - 20px)', left: '44%', transform: 'rotate(-90deg)' }}
          />
        )}
        <PixeledInfoContainerWhite>{rightItem}</PixeledInfoContainerWhite>
      </Row>
      <InfoContainer style={{ width: GE_DESKTOP_CONFIGURATION.displayWidth }}>
        {infoItems?.map((item, i) => (
          <PixeledInfoContainerBlue key={i} gameEditionView>
            <GameEditionLabel color="blue">{item.label}</GameEditionLabel>
            <GameEditionLabel color="white">{item?.value}</GameEditionLabel>
          </PixeledInfoContainerBlue>
        ))}
      </InfoContainer>
      <Row className="c">
        <PressButtonToActionLabel actionLabel="send" />
      </Row>
    </PreviewContainer>
  );
};
