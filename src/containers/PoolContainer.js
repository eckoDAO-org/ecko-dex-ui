import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';
import LiquidityContainer from './liquidity/LiquidityContainer';
import LiquidityList from './liquidity/LiquidityList';
import RemoveLiqContainer from './liquidity/RemoveLiqContainer';
import modalBackground from '../assets/images/game-edition/modal-background.png';
import { useGameEditionContext } from '../contexts';
import useButtonScrollEvent from '../hooks/useButtonScrollEvent';
import { LIQUIDITY_VIEW } from '../constants/liquidityView';

const Container = styled.div`
  display: flex;
  width: 100%;

  align-items: center;
  ${({ $gameEditionView, selectedView }) => {
    if ($gameEditionView) {
      return css`
        padding: 16px 0px;
        height: 100%;
        display: flex;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image: ${`url(${modalBackground})`};
        overflow: auto;
        ::-webkit-scrollbar {
          display: none;
        }
        scrollbar-width: none;
      `;
    } else {
      if (selectedView === LIQUIDITY_VIEW.LIQUIDITY_LIST) {
        return css`
          padding-top: 10%;
          @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel}px`}) {
            padding-bottom: 40px;
          }
        `;
      }
      return css`
        height: 100%;
        justify-content: center;
      `;
    }
  }}
`;

const PoolContainer = () => {
  const { gameEditionView } = useGameEditionContext();
  const [selectedView, setSelectedView] = useState(LIQUIDITY_VIEW.LIQUIDITY_LIST);
  const [pair, setPair] = useState(null);
  useButtonScrollEvent(gameEditionView && 'pool-scrolling-container');

  return (
    <Container id="pool-scrolling-container" $gameEditionView={gameEditionView} selectedView={selectedView}>
      {selectedView === LIQUIDITY_VIEW.REMOVE_LIQUIDITY && (
        <RemoveLiqContainer
          closeLiquidity={() => {
            setPair(null);
            setSelectedView(LIQUIDITY_VIEW.LIQUIDITY_LIST);
          }}
          pair={pair}
        />
      )}
      {selectedView === LIQUIDITY_VIEW.LIQUIDITY_LIST && (
        <LiquidityList
          selectCreatePair={() => setSelectedView('Create A Pair')}
          selectAddLiquidity={() => setSelectedView(LIQUIDITY_VIEW.ADD_LIQUIDITY)}
          selectRemoveLiquidity={() => setSelectedView(LIQUIDITY_VIEW.REMOVE_LIQUIDITY)}
          setTokenPair={(pair) => setPair(pair)}
          pair={pair}
        />
      )}
      {selectedView === LIQUIDITY_VIEW.ADD_LIQUIDITY && (
        <LiquidityContainer
          closeLiquidity={() => {
            setPair(null);
            setSelectedView(LIQUIDITY_VIEW.LIQUIDITY_LIST);
          }}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          pair={pair}
        />
      )}
    </Container>
  );
};

export default PoolContainer;
