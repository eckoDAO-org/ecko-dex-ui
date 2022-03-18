import React from 'react';
import styled, { css } from 'styled-components/macro';
import { PixeledCircleArrowIcon, SuccessfullIcon } from '../../assets';
import { ENABLE_GAS_STATION, GAS_PRICE } from '../../constants/contextConstants';
import { useGameEditionContext } from '../../contexts';
import { GE_DESKTOP_CONFIGURATION } from '../../contexts/GameEditionContext';
import { commonColors } from '../../styles/theme';
import GameEditionLabel from '../game-edition-v2/components/GameEditionLabel';
import PixeledBlueContainer, { InfoContainer } from '../game-edition-v2/components/PixeledInfoContainerBlue';
import { PixeledInfoContainerWhite } from '../game-edition-v2/components/PixeledInfoContainerWhite';
import PressButtonToActionLabel from '../game-edition-v2/components/PressButtonToActionLabel';
import CustomButton from '../shared/CustomButton';
import Label from '../shared/Label';
import LogoLoader from '../shared/Loader';
import PopupTxView from './PopupTxView';

export const Message = ({ color, children }) => {
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
export const GasCost = ({ swap }) => {
  return (
    <div className="flex justify-sb">
      <Label fontSize={13}>Gas Cost</Label>
      <div style={{ display: 'flex' }}>
        {ENABLE_GAS_STATION ? (
          <>
            <Label fontSize={13} color={commonColors.green} geColor="green" labelStyle={{ textDecoration: 'line-through' }}>
              {(GAS_PRICE * swap?.localRes?.gas).toPrecision(4)} KDA
            </Label>
            <Label fontSize={13} color={commonColors.green} geColor="green" labelStyle={{ marginLeft: 5 }}>
              FREE!
            </Label>
          </>
        ) : (
          <Label fontSize={13} color={commonColors.green} geColor="green">
            {(GAS_PRICE * swap?.localRes?.gas).toPrecision(4)} KDA
          </Label>
        )}
        {ENABLE_GAS_STATION && <PopupTxView popupStyle={{ maxWidth: '400px' }} />}
      </div>
    </div>
  );
};

// CONTENT CONTAINER
export const SuccesViewContainer = ({ swap, onClick, children, icon, hideSubtitle }) => {
  const { gameEditionView } = useGameEditionContext();
  return (
    <Content gameEditionView={gameEditionView}>
      {!hideSubtitle && (
        <Label fontFamily="syncopate" geCenter geColor="yellow" labelStyle={{ marginTop: 16 }}>
          Preview Successful!
        </Label>
      )}
      {!gameEditionView && (icon || <SuccessfullIcon />)}

      <TransactionsDetails>
        {children}
        <GasCost swap={swap} />
      </TransactionsDetails>
      <CustomButton
        type="gradient"
        buttonStyle={{
          width: '100%',
          marginTop: !gameEditionView && '16px',
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
        <div className="flex justify-sb relative" style={{ paddingLeft: 16, paddingRight: 16 }}>
          <PixeledInfoContainerWhite>{leftItem}</PixeledInfoContainerWhite>
          {!hideIcon && (
            <PixeledCircleArrowIcon
              style={{ position: 'absolute', width: 51.5, height: 49, top: 'calc(50% - 20px)', left: '44%', transform: 'rotate(-90deg)' }}
            />
          )}
          <PixeledInfoContainerWhite>{rightItem}</PixeledInfoContainerWhite>
        </div>
        <InfoContainer style={{ width: GE_DESKTOP_CONFIGURATION.DISPLAY_WIDTH, marginTop: 16 }}>
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

const MessageContainer = styled.div`
  border: ${({ color, gameEditionView }) => (gameEditionView ? `2px dashed ${color}` : `1px solid ${color}`)};
  padding: 16px 24px;
  border-radius: ${({ gameEditionView }) => !gameEditionView && '4px'};
  background-color: ${({ gameEditionView, theme: { colors } }) => !gameEditionView && colors.black};
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
