import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { getDate, NETWORK_TYPE } from '../../constants/contextConstants';
import tokenData from '../../constants/cryptoCurrencies';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import useWindowSize from '../../hooks/useWindowSize';
import theme from '../../styles/theme';
import reduceToken from '../../utils/reduceToken';
import { ColumnContainer, Container } from '../layout/Containers';
import Label from '../../components/shared/Label';

const CustomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: 4px 0px;

  cursor: pointer;
`;

const DesktopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: 100%;
  cursor: pointer;
`;

const HistoryCardContainer = styled(Container)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  flex-direction: ${({ gameEditionView }) => (!gameEditionView ? 'row' : 'column')};
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    & > *:not(:last-child) {
      margin-bottom: 16px;
    }
  }
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  img:first-child {
    z-index: 2;
  }
  img:not(:first-child):not(:last-child) {
    margin-left: -15px;
  }
`;

const HistoryCard = ({ tx }) => {
  const { gameEditionView } = useContext(GameEditionContext);

  const getInfoCoin = (coinPositionArray) => {
    let cryptoCode = tx?.params[coinPositionArray]?.refName?.namespace
      ? `${tx?.params[coinPositionArray]?.refName?.namespace}.${tx?.params[coinPositionArray]?.refName?.name}`
      : tx?.params[coinPositionArray]?.refName?.name;
    const crypto = Object.values(tokenData).find(({ code }) => code === cryptoCode);
    return crypto;
  };

  const [width] = useWindowSize();

  return gameEditionView ? (
    <CustomGrid
      onClick={() => {
        window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${tx?.requestKey}`, '_blank', 'noopener,noreferrer');
      }}
    >
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'start', display: 'block' }} geColor="yellow">
        Swap Pair
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block', whiteSpace: 'nowrap' }}>
        {getInfoCoin(3)?.name}/{getInfoCoin(5)?.name}
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'start', display: 'block' }} geColor="yellow">
        Date
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block', whiteSpace: 'nowrap' }}>
        {getDate(tx?.blockTime)}
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'start', display: 'block' }} geColor="yellow">
        Request Key
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block', whiteSpace: 'nowrap' }}>
        {reduceToken(tx?.requestKey)}
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'start', display: 'block' }} geColor="yellow">
        Amount
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block', whiteSpace: 'nowrap' }}>
        {tx?.params[2]} {getInfoCoin(3)?.name}
      </Label>
    </CustomGrid>
  ) : (
    <HistoryCardContainer
      gameEditionView={gameEditionView}
      onClick={() => {
        window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${tx?.requestKey}`, '_blank', 'noopener,noreferrer');
      }}
    >
      {/* ICONS */}
      {width >= theme.mediaQueries.mobilePixel ? (
        <DesktopGrid>
          <IconsContainer>
            {getInfoCoin(3)?.icon}
            {getInfoCoin(5)?.icon}
            <Label fontFamily="syncopate">{`${getInfoCoin(3)?.name}-${getInfoCoin(5)?.name}`}</Label>
          </IconsContainer>
          <ColumnContainer style={{ marginRight: '16px' }}>
            <Label withShade>Date</Label>
            <Label>{getDate(tx?.blockTime)}</Label>
          </ColumnContainer>
          <ColumnContainer style={{ marginRight: '16px' }}>
            <Label withShade>Request Key</Label>
            <Label>{reduceToken(tx?.requestKey)}</Label>
          </ColumnContainer>
          <ColumnContainer style={{ marginRight: '16px' }}>
            <Label withShade>Amount</Label>
            <Label>
              {tx?.params[2]} {getInfoCoin(3)?.name}
            </Label>
          </ColumnContainer>
        </DesktopGrid>
      ) : (
        <div style={{ display: 'flex', flex: 1, width: '100%', justifyContent: 'space-between' }}>
          <ColumnContainer>
            <IconsContainer style={{ flex: 1 }}>
              {getInfoCoin(3)?.icon}
              {getInfoCoin(5)?.icon}
              <Label fontFamily="syncopate">{`${getInfoCoin(3)?.name}-${getInfoCoin(5)?.name}`}</Label>
            </IconsContainer>

            <ColumnContainer style={{ marginTop: 32 }}>
              <Label withShade>Date</Label>
              <Label>{getDate(tx?.blockTime)}</Label>
            </ColumnContainer>
          </ColumnContainer>

          <ColumnContainer>
            <ColumnContainer>
              <Label withShade>Request Key</Label>
              <Label>{reduceToken(tx?.requestKey)}</Label>
            </ColumnContainer>
            <ColumnContainer style={{ marginTop: 16 }}>
              <Label withShade>Amount</Label>
              <Label>
                {tx?.params[2]} {getInfoCoin(3)?.name}
              </Label>
            </ColumnContainer>
          </ColumnContainer>
        </div>
      )}
    </HistoryCardContainer>
  );
};

export default HistoryCard;
