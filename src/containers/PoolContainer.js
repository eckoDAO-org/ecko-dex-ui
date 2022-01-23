import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components/macro';
import LiquidityContainer from './liquidity/LiquidityContainer';
import LiquidityList from './liquidity/LiquidityList';
import RemoveLiqContainer from './liquidity/RemoveLiqContainer';
import ArcadeBackground from '../assets/images/game-edition/arcade-background.png';
import { useGameEditionContext } from '../contexts';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  align-items: center;
  ${({ $gameEditionView }) => {
    if ($gameEditionView) {
      return css`
        padding: 16px;
        height: 100%;
        display: flex;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image: ${`url(${ArcadeBackground})`};
        overflow: auto;
        ::-webkit-scrollbar {
          display: none;
        }
      `;
    }
  }}
`;

const PoolContainer = () => {
  const { gameEditionView, setButtons } = useGameEditionContext();
  const [selectedView, setSelectedView] = useState(false);
  const [pair, setPair] = useState(null);

  const [scrollTo, setScrollTo] = useState(0);

  useEffect(() => {
    const elementContainer = document.getElementById('pool-scrolling-container');

    if (elementContainer) {
      elementContainer.scrollTo(0, scrollTo);
    }

    setButtons({
      Down: () => {
        if (scrollTo + elementContainer.firstElementChild.clientHeight < elementContainer.firstElementChild.scrollHeight - 20) {
          setScrollTo((prev) => prev + 20);
        }
      },
      Up: () => {
        if (scrollTo > 0) {
          setScrollTo((prev) => prev - 20);
        }
      },
    });
  }, [scrollTo]);

  const listenToScroll = () => {
    const elementContainer = document.getElementById('pool-scrolling-container');

    const position = elementContainer.firstElementChild.he;
    console.log('position', position);
  };

  useEffect(() => {
    const elementContainer = document.getElementById('pool-scrolling-container');
    if (elementContainer)
      elementContainer.addEventListener('scroll', () => {
        listenToScroll();
      });
  }, []);

  console.log('scrollTo', scrollTo);

  return (
    <Container
      id="pool-scrolling-container"
      onWheel={() => {
        const elementContainer = document.getElementById('pool-scrolling-container');
        console.log('elementContainer', elementContainer.scrollHeight);
      }}
      $gameEditionView={gameEditionView}
    >
      {selectedView === 'Remove Liquidity' ? (
        <RemoveLiqContainer
          closeLiquidity={() => {
            setPair(null);
            setSelectedView(false);
          }}
          selectedView={selectedView}
          pair={pair}
        />
      ) : selectedView ? (
        <LiquidityContainer
          closeLiquidity={() => {
            setPair(null);
            setSelectedView(false);
          }}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          pair={pair}
        />
      ) : (
        <LiquidityList
          selectCreatePair={() => setSelectedView('Create A Pair')}
          selectAddLiquidity={() => setSelectedView('Add Liquidity')}
          selectRemoveLiquidity={() => setSelectedView('Remove Liquidity')}
          selectPreviewLiquidity={() => setSelectedView('Preview Liquidity')}
          setTokenPair={(pair) => setPair(pair)}
        />
      )}
    </Container>
  );
};

export default PoolContainer;
