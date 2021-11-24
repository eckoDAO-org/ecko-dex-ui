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
  flex-direction: ${({ gameEditionView }) =>
    !gameEditionView ? 'row' : 'column'};
  justify-content: space-between;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    & > *:not(:last-child) {
      margin-bottom: 16px;
    }
    /* flex-direction: column; */
  }

  flex-flow: wrap;
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
    const crypto = Object.values(tokenData).find(
      ({ code }) => code === cryptoCode
    );
    return crypto;
  };

  return (
    <HistoryCardContainer gameEditionView={gameEditionView}>
      {/* ICONS */}
      <IconsContainer style={{ marginRight: '16px' }}>
        {getInfoCoin(3)?.icon}
        {getInfoCoin(5)?.icon}
        <CustomLabel bold>{`${getInfoCoin(3)?.name}-${
          getInfoCoin(5)?.name
        }`}</CustomLabel>
      </IconsContainer>
      <ColumnContainer
        gameEditionView={gameEditionView}
        style={{ marginRight: '16px' }}
      >
        <Label gameEditionView={gameEditionView} withShade='99'>
          Date
        </Label>
        <Value gameEditionView={gameEditionView}>{`${getDate(
          tx?.blockTime
        )}`}</Value>
      </ColumnContainer>
      <ColumnContainer
        gameEditionView={gameEditionView}
        style={{ marginRight: '16px', cursor: 'pointer' }}
        onClick={() => {
          window.open(
            `https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${tx?.requestKey}`,
            '_blank',
            'noopener,noreferrer'
          );
        }}
      >
        <Label gameEditionView={gameEditionView} withShade='99'>
          Request Key
        </Label>
        <Value gameEditionView={gameEditionView}>
          {reduceToken(tx?.requestKey)}
        </Value>
      </ColumnContainer>
      {/* TR TOKEN 1 */}
      <ColumnContainer
        gameEditionView={gameEditionView}
        style={{ marginRight: '16px' }}
      >
        <Label
          gameEditionView={gameEditionView}
          withShade='99'
          style={{ textAlign: 'end' }}
        >
          Amount
        </Label>
        <Value
          gameEditionView={gameEditionView}
          style={{ textAlign: 'end' }}
        >{`${tx?.params[2]} ${getInfoCoin(3)?.name}`}</Value>
      </ColumnContainer>
    </HistoryCardContainer>
  );
};

export default HistoryCard;
