import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components/macro';
import { useGameEditionContext } from '../../../contexts';
import { ErrorIcon } from '../../../assets';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { SwapContext } from '../../../contexts/SwapContext';
import CustomButton from '../../../components/shared/CustomButton';
import Label from '../../shared/Label';
import { LIQUIDITY_VIEW } from '../../../constants/liquidityView';
import { SuccessAddRemoveView, SuccessAddRemoveViewGE } from '../../modals/liquidity/LiquidityTxView';
import { SwapSuccessView, SwapSuccessViewGE } from './SwapSuccesTxView';
import { commonColors } from '../../../styles/theme';

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

const TxView = ({ view, onClose, token0, token1, createTokenPair }) => {
  const swap = useContext(SwapContext);
  const { gameEditionView } = useContext(GameEditionContext);

  const [loading, setLoading] = useState(false);

  const sendTransaction = () => {
    setLoading(true);
    swap.swapSend();
    onClose();
    setLoading(false);
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
          return gameEditionView ? (
            <SuccessAddRemoveViewGE token0={token0} token1={token1} swap={swap} label="Remove" />
          ) : (
            <SuccessAddRemoveView token0={token0} token1={token1} swap={swap} label="Remove" loading={loading} onClick={sendTransaction} />
          );
        case LIQUIDITY_VIEW.ADD_LIQUIDITY:
          return gameEditionView ? (
            <SuccessAddRemoveViewGE token0={token0} token1={token1} swap={swap} label="Add" />
          ) : (
            <SuccessAddRemoveView token0={token0} token1={token1} swap={swap} label="Add" loading={loading} onClick={onAddLiquidity} />
          );
        case undefined:
          return gameEditionView ? (
            <SwapSuccessViewGE swap={swap} />
          ) : (
            <SwapSuccessView swap={swap} loading={loading} sendTransaction={sendTransaction} />
          );
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
