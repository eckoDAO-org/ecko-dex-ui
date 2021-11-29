import React, { useContext } from 'react';
import styled from 'styled-components';
import { getDate, NETWORK_TYPE } from '../../constants/contextConstants';
import tokenData from '../../constants/cryptoCurrencies';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import CustomLabel from '../../shared/CustomLabel';
import reduceToken from '../../utils/reduceToken';
import { ColumnContainer, Container, Label, Value } from '../layout/Containers';

const HistoryCardContainer = styled(Container)`
  width: 100%;
  --auto-grid-min-size: ${({ gameEditionView }) => (gameEditionView ? '180px' : '260px')};
  @media only screen and (min-device-width: 1024px) and (max-device-width: 1180px) and (-webkit-min-device-pixel-ratio: 2) {
    --auto-grid-min-size: 180px;
  }
  grid-gap: ${({ gameEditionView }) => gameEditionView && '0.5em'};
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--auto-grid-min-size), 1fr));
  flex-direction: ${({ gameEditionView }) => (!gameEditionView ? 'row' : 'column')};
  justify-content: space-between;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    & > *:not(:last-child) {
      margin-bottom: 16px;
    }
  }
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: flex-start;

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

  return (
    <HistoryCardContainer gameEditionView={gameEditionView}>
      {/* ICONS */}
      <IconsContainer>
        {getInfoCoin(3)?.icon}
        {getInfoCoin(5)?.icon}
        <CustomLabel bold>{`${getInfoCoin(3)?.name}-${getInfoCoin(5)?.name}`}</CustomLabel>
      </IconsContainer>
      <ColumnContainer gameEditionView={gameEditionView}>
        <Label gameEditionView={gameEditionView} withShade="99">
          Date
        </Label>
        <Value gameEditionView={gameEditionView}>{`${getDate(tx?.blockTime)}`}</Value>
      </ColumnContainer>
      <ColumnContainer
        gameEditionView={gameEditionView}
        style={{ cursor: 'pointer' }}
        onClick={() => {
          window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${tx?.requestKey}`, '_blank', 'noopener,noreferrer');
        }}
      >
        <Label gameEditionView={gameEditionView} withShade="99">
          Request Key
        </Label>
        <Value gameEditionView={gameEditionView}>{reduceToken(tx?.requestKey)}</Value>
      </ColumnContainer>
      {/* TR TOKEN 1 */}
      <ColumnContainer gameEditionView={gameEditionView}>
        <Label gameEditionView={gameEditionView} withShade="99" style={{ textAlign: 'left' }}>
          Amount
        </Label>
        <Value gameEditionView={gameEditionView} style={{ textAlign: 'left' }}>{`${tx?.params[2]} ${getInfoCoin(3)?.name}`}</Value>
      </ColumnContainer>
    </HistoryCardContainer>
  );
};

export default HistoryCard;
