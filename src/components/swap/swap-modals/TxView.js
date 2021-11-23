import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import { Transition } from 'react-spring/renderprops';
import { Message, Icon, Divider } from 'semantic-ui-react';
import { ErrorIcon, SuccessfullIcon } from '../../../assets';
import {
  extractDecimal,
  gasUnit,
  reduceBalance,
} from '../../../utils/reduceBalance';
import CustomButton from '../../../shared/CustomButton';
import Backdrop from '../../../shared/Backdrop';
import ModalContainer from '../../../shared/ModalContainer';
import { SwapContext } from '../../../contexts/SwapContext';
import {
  ENABLE_GAS_STATION,
  GAS_PRICE,
} from '../../../constants/contextConstants';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import GameEditionModalsContainer from '../../game-edition/GameEditionModalsContainer';
import reduceToken from '../../../utils/reduceToken';
import { AccountContext } from '../../../contexts/AccountContext';
import { PactContext } from '../../../contexts/PactContext';
import tokenData from '../../../constants/cryptoCurrencies';
import PopupTxView from './PopupTxView';
import { theme } from '../../../styles/theme';
import { LightModeContext } from '../../../contexts/LightModeContext';

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 550px;
  width: 100%;
  z-index: 5;
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  svg {
    display: ${({ gameEditionView }) => gameEditionView && 'none '};
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
  width: ${({ gameEditionView }) => (gameEditionView ? '97%' : '100%')};
  position: ${({ gameEditionView }) => gameEditionView && 'absolute'};
  bottom: ${({ gameEditionView }) => gameEditionView && '66px'};
  padding: ${({ gameEditionView }) => gameEditionView && '4px'};

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobileSmallPixel}px`}) {
    svg {
      width: 40px;
      height: 40px;
    }
  }
`;

const Title = styled.div`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold};
  font-size: 16px;
  padding: ${({ gameEditionView }) => (gameEditionView ? '20px 0px' : '16px')};

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobileSmallPixel}px`}) {
    padding: ${({ gameEditionView }) => (gameEditionView ? '20px 0px' : '8px')};
  }
  width: ${({ gameEditionView }) => (gameEditionView ? '100%' : 'auto')};
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : colors.white};
  text-align: ${({ gameEditionView }) => (gameEditionView ? 'left' : 'center')};
`;

const SubTitle = styled.div`
  width: ${({ gameEditionView }) => (gameEditionView ? '100%' : 'auto')};
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '14px' : '16px')};
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : colors.white};
  text-align: ${({ gameEditionView }) => (gameEditionView ? 'left' : 'center')};
`;

const TransactionsDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px;
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

const HighlightLabel = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '10px' : '16px')};
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : colors.white};
`;

const Label = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '10px' : '13px')};
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : `${colors.white}99`};
`;

const TxView = ({ show, view, onClose, token0, token1, createTokenPair }) => {
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
        <Title gameEditionView={gameEditionView}>Preview Successful!</Title>
        <SuccessfullIcon />

        <TransactionsDetails>
          <SpaceBetweenRow>
            <HighlightLabel gameEditionView={gameEditionView}>
              From
            </HighlightLabel>
            <Label gameEditionView={gameEditionView}></Label>
          </SpaceBetweenRow>
          <SpaceBetweenRow>
            <Label gameEditionView={gameEditionView}>Account</Label>
            <Label gameEditionView={gameEditionView}>
              {`${reduceToken(account.account)}`}
              <PopupTxView isAccountPopup />
            </Label>
          </SpaceBetweenRow>
          <SpaceBetweenRow>
            <Label gameEditionView={gameEditionView}>Chain ID</Label>
            <Label gameEditionView={gameEditionView}>
              {swap.localRes.metaData.publicMeta.chainId}
            </Label>
          </SpaceBetweenRow>
          <Divider
            style={{
              width: '100%',
              marginTop: 0,
              borderTop: gameEditionView
                ? `1px dashed ${theme(themeMode).colors.black}`
                : `1px solid ${theme(themeMode).colors.white}`,
            }}
          />

          <SpaceBetweenRow>
            <FlexStartRow>
              {getTokenIcon(swap.localRes.result.data[0].token)}
              <HighlightLabel gameEditionView={gameEditionView}>
                {`${extractDecimal(swap.localRes.result.data[0].amount)} `}
              </HighlightLabel>
            </FlexStartRow>
            <HighlightLabel gameEditionView={gameEditionView}>
              {` ${showTicker(swap.localRes.result.data[0].token)}`}
            </HighlightLabel>
          </SpaceBetweenRow>
          <SpaceBetweenRow>
            <HighlightLabel gameEditionView={gameEditionView}>
              <Icon name='long arrow alternate down' style={{}} />
            </HighlightLabel>
            <Label gameEditionView={gameEditionView}>{`1 ${showTicker(
              swap.localRes.result.data[0].token
            )} = ${reduceBalance(pact.computeOut(1), 12)} ${showTicker(
              swap.localRes.result.data[1].token
            )}`}</Label>
          </SpaceBetweenRow>
          <SpaceBetweenRow>
            <FlexStartRow>
              {getTokenIcon(swap.localRes.result.data[1].token)}
              <HighlightLabel gameEditionView={gameEditionView}>
                {`${extractDecimal(swap.localRes.result.data[1].amount)} `}
              </HighlightLabel>
            </FlexStartRow>
            <HighlightLabel gameEditionView={gameEditionView}>
              {` ${showTicker(swap.localRes.result.data[1].token)}`}
            </HighlightLabel>
          </SpaceBetweenRow>
          <SpaceBetweenRow>
            <Label gameEditionView={gameEditionView}>Gas Cost</Label>
            <Label
              gameEditionView={gameEditionView}
              style={{ color: !gameEditionView && '#41CC41' }}
            >
              {ENABLE_GAS_STATION ? (
                <>
                  <s>{`${gasUnit(GAS_PRICE * swap.localRes.gas)} KDA`}</s>
                  <span style={{ marginLeft: 5 }}>FREE!</span>
                </>
              ) : (
                <span>{`${gasUnit(GAS_PRICE * swap.localRes.gas)} KDA`}</span>
              )}
              {ENABLE_GAS_STATION && <PopupTxView />}
            </Label>
          </SpaceBetweenRow>
        </TransactionsDetails>
        <CustomButton
          buttonStyle={{
            width: '100%',
            position: gameEditionView && 'absolute',
            top: gameEditionView && '325px',
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
      <Content
        gameEditionView={gameEditionView}
        style={{ bottom: gameEditionView && '132px' }}
      >
        <Title gameEditionView={gameEditionView}>Preview Successful!</Title>

        <SuccessfullIcon />

        <TransactionsDetails>
          <FlexStartRow style={{ marginBottom: 16 }}>
            <HighlightLabel gameEditionView={gameEditionView}>
              Remove
            </HighlightLabel>
          </FlexStartRow>
          <SpaceBetweenRow>
            <FlexStartRow>
              {getTokenIcon(token0)}
              <HighlightLabel gameEditionView={gameEditionView}>
                {`${extractDecimal(swap.localRes.result.data.amount0)} `}
              </HighlightLabel>
            </FlexStartRow>
            <HighlightLabel gameEditionView={gameEditionView}>
              {` ${showTicker(token0)}`}
            </HighlightLabel>
          </SpaceBetweenRow>
          <FlexStartRow style={{ marginBottom: 16 }}>
            <HighlightLabel gameEditionView={gameEditionView}>
              Remove
            </HighlightLabel>
          </FlexStartRow>
          <SpaceBetweenRow>
            <FlexStartRow>
              {getTokenIcon(token1)}
              <HighlightLabel gameEditionView={gameEditionView}>
                {`${extractDecimal(swap.localRes.result.data.amount1)} `}
              </HighlightLabel>
            </FlexStartRow>
            <HighlightLabel gameEditionView={gameEditionView}>
              {` ${showTicker(token1)}`}
            </HighlightLabel>
          </SpaceBetweenRow>

          <SpaceBetweenRow>
            <Label gameEditionView={gameEditionView}>Gas Cost</Label>
            <Label
              gameEditionView={gameEditionView}
              style={{ color: !gameEditionView && '#41CC41' }}
            >
              {ENABLE_GAS_STATION ? (
                <>
                  <s>{`${gasUnit(GAS_PRICE * swap.localRes.gas)} KDA`}</s>
                  <span style={{ marginLeft: 5 }}>FREE!</span>
                </>
              ) : (
                <span>{`${gasUnit(GAS_PRICE * swap.localRes.gas)} KDA`}</span>
              )}
              {ENABLE_GAS_STATION && <PopupTxView />}
            </Label>
          </SpaceBetweenRow>
        </TransactionsDetails>
        <CustomButton
          buttonStyle={{
            width: '100%',
            position: gameEditionView && 'absolute',
            top: gameEditionView && 316,
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
      <Content gameEditionView={gameEditionView} style={{ bottom: '128px' }}>
        <Title gameEditionView={gameEditionView}>Preview Successful!</Title>
        <SuccessfullIcon />
        <TransactionsDetails>
          <FlexStartRow style={{ marginBottom: 16 }}>
            <Label gameEditionView={gameEditionView}>Add</Label>
          </FlexStartRow>
          <SpaceBetweenRow>
            <FlexStartRow>
              {getTokenIcon(token0)}
              <HighlightLabel gameEditionView={gameEditionView}>
                {`${extractDecimal(swap.localRes.result.data.amount0)} `}
              </HighlightLabel>
            </FlexStartRow>
            <HighlightLabel gameEditionView={gameEditionView}>
              {` ${showTicker(token0)}`}
            </HighlightLabel>
          </SpaceBetweenRow>
          <FlexStartRow style={{ marginBottom: 16 }}>
            <Label gameEditionView={gameEditionView}>Add</Label>
          </FlexStartRow>
          <SpaceBetweenRow>
            <FlexStartRow>
              {getTokenIcon(token1)}
              <HighlightLabel gameEditionView={gameEditionView}>
                {`${extractDecimal(swap.localRes.result.data.amount1)} `}
              </HighlightLabel>
            </FlexStartRow>
            <HighlightLabel gameEditionView={gameEditionView}>
              {` ${showTicker(token1)}`}
            </HighlightLabel>
          </SpaceBetweenRow>
          <SpaceBetweenRow>
            <Label gameEditionView={gameEditionView}>Gas Cost</Label>
            <Label
              gameEditionView={gameEditionView}
              style={{ color: !gameEditionView && '#41CC41' }}
            >
              {ENABLE_GAS_STATION ? (
                <>
                  <s>{`${gasUnit(GAS_PRICE * swap.localRes.gas)} KDA`}</s>
                  <span style={{ marginLeft: 5 }}>FREE!</span>
                </>
              ) : (
                <span>{`${gasUnit(GAS_PRICE * swap.localRes.gas)} KDA`}</span>
              )}
              {ENABLE_GAS_STATION && <PopupTxView />}
            </Label>
          </SpaceBetweenRow>
        </TransactionsDetails>
        <CustomButton
          buttonStyle={{
            width: '100%',
            position: gameEditionView && 'absolute',
            top: gameEditionView && 316,
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
        <ErrorIcon />
        <Title gameEditionView={gameEditionView}>Preview Failed!</Title>
        <SubTitle gameEditionView={gameEditionView}>Error Message</SubTitle>
        <TransactionsDetails>
          <Message
            color='red'
            style={{ wordBreak: 'break-all', backgroundColor: '#424242' }}
          >
            <RowContainer>
              <span style={{ wordBreak: 'break-all' }}>
                {swap.localRes.result.error.message}
              </span>
            </RowContainer>
          </Message>
          {swap.localRes.result.error.message.includes('insufficient') ? (
            <span style={{ wordBreak: 'break-all' }}>
              TIP: Try setting a higher slippage amount
            </span>
          ) : (
            <></>
          )}
        </TransactionsDetails>
        <CustomButton
          onClick={() => {
            onClose();
          }}
          buttonStyle={{
            position: gameEditionView && 'absolute',
            top: gameEditionView && '282px',
            width: gameEditionView && '100%',
          }}
        >
          Retry
        </CustomButton>
      </Content>
    );
  };

  const localError = () => {
    return (
      <Content
        gameEditionView={gameEditionView}
        style={{ bottom: gameEditionView && '156px' }}
      >
        <ErrorIcon />
        <Title gameEditionView={gameEditionView}>Transaction Error!</Title>
        <SubTitle gameEditionView={gameEditionView}>Error Message</SubTitle>
        <TransactionsDetails>
          <Message
            color='red'
            style={{ wordBreak: 'break-all', backgroundColor: '#424242' }}
          >
            <RowContainer>
              <span style={{ wordBreak: 'break-all' }}>{swap.localRes}</span>
            </RowContainer>
          </Message>
        </TransactionsDetails>
        <CustomButton
          buttonStyle={{
            position: gameEditionView && 'absolute',
            top: gameEditionView && '282px',
            width: gameEditionView && '100%',
          }}
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
    if (
      swap.localRes &&
      swap.localRes.result &&
      swap.localRes.result.status === 'success'
    ) {
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
  // console.log(pact)
  return gameEditionView && show ? (
    <GameEditionModalsContainer
      modalStyle={{ zIndex: 1 }}
      title='transaction details'
      onClose={onClose}
      content={
        typeof swap.localRes === 'string' ? localError() : renderSwitch()
      }
    />
  ) : (
    <Transition
      items={show}
      from={{ opacity: 1 }}
      enter={{ opacity: 1 }}
      leave={{ opacity: 0 }}
    >
      {(show) =>
        show &&
        ((props) => (
          <Container style={props}>
            <Backdrop onClose={onClose} />
            <ModalContainer
              className='withRainbow'
              title='transaction details'
              containerStyle={{
                maxHeight: '90vh',
                maxWidth: '90vw',
              }}
              onClose={onClose}
            >
              {typeof swap.localRes === 'string'
                ? localError()
                : renderSwitch()}
            </ModalContainer>
          </Container>
        ))
      }
    </Transition>
  );
};

export default TxView;
