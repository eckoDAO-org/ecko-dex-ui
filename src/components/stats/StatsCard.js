import React, { useContext } from 'react';
import styled from 'styled-components';
import tokenData from '../../constants/cryptoCurrencies';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import CustomLabel from '../../shared/CustomLabel';
import theme from '../../styles/theme';
import { extractDecimal, reduceBalance } from '../../utils/reduceBalance';
import { ColumnContainer, Container, Label, Value } from '../layout/Containers';

const StatsCardContainer = styled(Container)`
  width: 100%;
  flex-direction: ${({ gameEditionView }) =>
    !gameEditionView ? 'row' : 'column'};
  justify-content: space-between;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    & > * {
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

const StatsCard = ({ pair }) => {
  const { gameEditionView } = useContext(GameEditionContext);
  return (
    <StatsCardContainer gameEditionView={gameEditionView}>
      {/* ICONS */}
      <IconsContainer style={{ marginRight: '16px' }}>
        {tokenData[pair.token0].icon}
        {tokenData[pair.token1].icon}
        <CustomLabel bold>{`${pair.token0}-${pair.token1}`}</CustomLabel>
      </IconsContainer>
      {/* TR TOKEN 0 */}
      <ColumnContainer
        gameEditionView={gameEditionView}
        style={{ marginRight: '16px' }}
      >
        <Label gameEditionView={gameEditionView} withShade='99'>
          Total Reserve - Token0
        </Label>
        <Value gameEditionView={gameEditionView}>
          {reduceBalance(pair.reserves[0])}0
        </Value>
      </ColumnContainer>
      {/* TR TOKEN 1 */}
      <ColumnContainer
        gameEditionView={gameEditionView}
        style={{ marginRight: '16px' }}
      >
        <Label gameEditionView={gameEditionView} withShade='99'>
          Total Reserve - Token1
        </Label>
        <Value gameEditionView={gameEditionView}>
          {reduceBalance(pair.reserves[1])}0
        </Value>
      </ColumnContainer>
      {/* RATE */}
      <ColumnContainer
        gameEditionView={gameEditionView}
        style={{ marginRight: '16px' }}
      >
        <Label gameEditionView={gameEditionView} withShade='99'>
          Total Reserve - Token1
        </Label>
        <Value gameEditionView={gameEditionView}>{`${reduceBalance(
          extractDecimal(pair.reserves[0]) / extractDecimal(pair.reserves[1])
        )} ${pair.token0}/${pair.token1}`}</Value>
      </ColumnContainer>
    </StatsCardContainer>
  );
};

export default StatsCard;
