import React, { useEffect, useState } from 'react';
import moment from 'moment';
import styled, { css } from 'styled-components/macro';
import { useGameEditionContext, useSwapContext, usePactContext, useModalContext } from '../../contexts';
import { PixeledCircleArrowIcon } from '../../assets';
import { GE_DESKTOP_CONFIGURATION } from '../../contexts/GameEditionContext';
import CustomButton from '../shared/CustomButton';
import Label from '../shared/Label';
import { commonColors } from '../../styles/theme';
import Loader from '../shared/Loader';
import GameEditionLabel from '../game-edition-v2/components/GameEditionLabel';
import { PixeledInfoContainerWhite } from '../game-edition-v2/components/PixeledInfoContainerWhite';
import PixeledBlueContainer, { InfoContainer } from '../game-edition-v2/components/PixeledInfoContainerBlue';
import PressButtonToActionLabel from '../game-edition-v2/components/PressButtonToActionLabel';
import { FlexContainer } from '../shared/FlexContainer';
import LogoLoader from '../shared/Loader';
import { useInterval } from '../../hooks/useInterval';

const TransactionsDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  & > *:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const TxView = ({ loading, onClose, children }) => {
  const swap = useSwapContext();
  const { gameEditionView } = useGameEditionContext();
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
        <Label
          color={getColor()}
          geColor={color}
          className="capitalize"
          labelStyle={{ wordBreak: 'break-all' }}
          geLabelStyle={{ wordBreak: 'break-all' }}
        >
          {children}
        </Label>
      </MessageContainer>
    );
  };

  const failView = () => {
    return (
      <Content gameEditionView={gameEditionView}>
        <Label geCenter geColor="yellow">
          Preview Failed!
        </Label>
        <Label fontFamily="syncopate" labelStyle={{ marginBottom: ' 12px', width: '100%' }}>
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
        <Label fontFamily="syncopate" geCenter geColor="yellow" labelStyle={{ marginTop: 16 }}>
          Transaction Error!
        </Label>
        <Label fontFamily="syncopate" labelStyle={{ marginBottom: ' 12px', width: '100%' }}>
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

  const renderSwitch = () => {
    if (swap.localRes && swap.localRes.result && swap.localRes.result.status === 'success') {
      return loading ? <Loader /> : children || <></>;
      // switch (view) {
      //   default:
      //     return () => {};
      //   case LIQUIDITY_VIEW.REMOVE_LIQUIDITY:
      //     return gameEditionView ? (
      //       <SuccessAddRemoveViewGE token0={token0} token1={token1} swap={swap} label="Remove Liquidity" onBPress={sendTransaction} />
      //     ) : (
      //       <SuccessRemoveView token0={token0} token1={token1} swap={swap} label="Remove Liquidity" loading={loading} onClick={sendTransaction} />
      //     );
      //   case LIQUIDITY_VIEW.ADD_LIQUIDITY:
      //     return gameEditionView ? (
      //       <SuccessAddRemoveViewGE token0={token0} token1={token1} swap={swap} label="Add Liquidity" onBPress={onAddLiquidity} />
      //     ) : (
      //       <SuccessAddView token0={token0} token1={token1} swap={swap} label="Add Liquidity" loading={loading} onClick={onAddLiquidity} />
      //     );
      //   case undefined:
      //     return gameEditionView ? (
      //       <SwapSuccessViewGE swap={swap} />
      //     ) : (
      //       <SwapSuccessView swap={swap} loading={loading} sendTransaction={sendTransaction} />
      //     );
      // }
    } else return failView();
  };
  return typeof swap.localRes === 'string' ? localError() : renderSwitch();
};

export default TxView;

const MessageContainer = styled.div`
  border: ${({ color, gameEditionView }) => (gameEditionView ? `2px dashed ${color}` : `1px solid ${color}`)};
  padding: 16px 24px;
  border-radius: ${({ gameEditionView }) => !gameEditionView && '4px'};
  background-color: ${({ gameEditionView, theme: { colors } }) => !gameEditionView && colors.backgroundContainer};
`;

// GAS COST COMPONENT
export const GasCost = ({ swap }) => {
  const colorGasStation = () => {
    return pact.gasConfiguration.gasPrice * swap?.localRes?.gas > 0.5
      ? commonColors.error
      : [
          pact.gasConfiguration.gasPrice * swap?.localRes?.gas <= 0.5 && pact.gasConfiguration.gasPrice * swap?.localRes?.gas > 0.01
            ? commonColors.orange
            : commonColors.green,
        ];
  };

  const pact = usePactContext();
  return (
    <div className="flex justify-sb">
      <Label fontSize={13} color={!pact.enableGasStation ? colorGasStation() : commonColors.green}>
        Gas Cost
      </Label>
      <div style={{ display: 'flex' }}>
        {pact.enableGasStation ? (
          <>
            <Label fontSize={13} color={commonColors.green} geColor="green" labelStyle={{ marginLeft: 5 }}>
              FREE
            </Label>
          </>
        ) : (
          <Label fontSize={13} color={colorGasStation()} geColor="green">
            {(pact.gasConfiguration.gasPrice * swap?.localRes?.gas).toPrecision(4)} KDA
          </Label>
        )}
      </div>
    </div>
  );
};

// CONTENT CONTAINER
export const SuccesViewContainer = ({ swap, onClick, children, icon, hideSubtitle, disableButton, footer }) => {
  const { gameEditionView } = useGameEditionContext();
  const pact = usePactContext();
  const { closeModal } = useModalContext();
  const [counter, setCounter] = useState(pact.ttl);

  useInterval(() => setCounter(counter - 1), 1000);

  useEffect(() => {
    const timer = setTimeout(() => closeModal(), pact.ttl * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Content gameEditionView={gameEditionView}>
      {!hideSubtitle && (
        <Label fontFamily="syncopate" geCenter geColor="yellow" labelStyle={{ marginTop: 16 }}>
          Preview Successful!
        </Label>
      )}
      {!gameEditionView && icon}

      <FlexContainer className="w-100 flex column" gap={16}>
        {children}
        <GasCost swap={swap} />
      </FlexContainer>
      <FlexContainer className="w-100 flex column" style={{ marginBottom: 24 }}>
        <Label>{`The transaction will expire in ${`${moment.utc(counter * 1000).format('mm:ss')}`} ${
          counter / 60 >= 1 ? 'minutes' : 'seconds'
        }`}</Label>
      </FlexContainer>
      {footer}
      <CustomButton
        type={disableButton ? 'primary' : 'secondary'}
        disabled={disableButton}
        buttonStyle={{
          width: '100%',
          marginBottom: gameEditionView && '16px',
        }}
        onClick={async () => {
          await onClick();
        }}
      >
        confirm
      </CustomButton>
    </Content>
  );
};

export const SuccessViewContainerGE = ({ leftItem, rightItem, infoItems, hideIcon, title, containerStyle, loading }) => {
  const { gameEditionView } = useGameEditionContext();
  return (
    <PreviewContainer gameEditionView={gameEditionView} style={containerStyle}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {title && (
          <GameEditionLabel center color="yellow" fontSize={24} style={{ marginBottom: 0 }}>
            {title}
          </GameEditionLabel>
        )}
        <div className="flex justify-sb relative">
          <PixeledInfoContainerWhite>{leftItem}</PixeledInfoContainerWhite>
          {!hideIcon && (
            <PixeledCircleArrowIcon
              style={{ position: 'absolute', width: 51.5, height: 49, top: 'calc(50% - 20px)', left: '44%', transform: 'rotate(-90deg)' }}
            />
          )}
          <PixeledInfoContainerWhite>{rightItem}</PixeledInfoContainerWhite>
        </div>
        <InfoContainer style={{ width: infoItems.length < 3 ? 'min-content' : GE_DESKTOP_CONFIGURATION.DISPLAY_WIDTH, marginTop: 16 }}>
          {infoItems?.map((item, i) => (
            <PixeledBlueContainer key={i} label={item.label} value={item.value} />
          ))}
        </InfoContainer>
      </div>
      <div className="flex justify-ce">{loading ? <LogoLoader /> : <PressButtonToActionLabel actionLabel="send" />}</div>
    </PreviewContainer>
  );
};

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  max-width: 550px;
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
const PreviewContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 16px;
  & > *:not(:last-child) {
    margin-bottom: 16px;
  }
`;
