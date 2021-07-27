import React, { useState } from "react";
import LiquidityContainer from "./liquidity/LiquidityContainer";
import LiquidityList from "./liquidity/LiquidityList";
import RemoveLiqContainer from "./liquidity/RemoveLiqContainer";

const PoolContainer = () => {
  const [selectedView, setSelectedView] = useState(false);
  const [pair, setPair] = useState(null);

  return (
    <>
      {selectedView === "Remove Liquidity" ? (
        <RemoveLiqContainer
          closeLiquidity={() => setSelectedView(false)}
          selectedView={selectedView}
          pair={pair}
        />
      ) : selectedView ? (
        <LiquidityContainer
          closeLiquidity={() => setSelectedView(false)}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          pair={pair}
        />
      ) : (
        <LiquidityList
          selectCreatePair={() => setSelectedView("Create A Pair")}
          selectAddLiquidity={() => setSelectedView("Add Liquidity")}
          selectRemoveLiquidity={() => setSelectedView("Remove Liquidity")}
          selectPreviewLiquidity={() => setSelectedView("Preview Liquidity")}
          setTokenPair={(pair) => setPair(pair)}
        />
      )}
    </>
  );
};

export default PoolContainer;
