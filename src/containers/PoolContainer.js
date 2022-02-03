import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';
import LiquidityContainer from '../components/liquidity/LiquidityContainer';
import LiquidityList from '../components/liquidity/LiquidityList';
import RemoveLiqContainer from '../components/liquidity/RemoveLiqContainer';
import modalBackground from '../assets/images/game-edition/modal-background.png';
import { useGameEditionContext } from '../contexts';
import useButtonScrollEvent from '../hooks/useButtonScrollEvent';
import { LIQUIDITY_VIEW } from '../constants/liquidityView';
import { FadeIn } from '../components/shared/animations';
import useLazyImage from '../hooks/useLazyImage';
import LogoLoader from '../components/shared/Loader';

const Container = styled(FadeIn)`
  display: flex;
  width: 100%;

  align-items: center;
  ${({ $gameEditionView, selectedView }) => {
    if ($gameEditionView) {
      return css`
        padding-top: 16px;
        padding-bottom: ${selectedView !== LIQUIDITY_VIEW.LIQUIDITY_LIST && '16px'};
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

  const [loaded] = useLazyImage([modalBackground]);

  return !loaded && gameEditionView ? (
    <LogoLoader />
  ) : (
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
