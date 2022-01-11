import React, { useState } from 'react';
import styled from 'styled-components/macro';
import LiquidityContainer from './liquidity/LiquidityContainer';
import LiquidityList from './liquidity/LiquidityList';
import RemoveLiqContainer from './liquidity/RemoveLiqContainer';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  align-items: center;
`;

const PoolContainer = () => {
  const [selectedView, setSelectedView] = useState(false);
  const [pair, setPair] = useState(null);
  return (
    <Container>
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
