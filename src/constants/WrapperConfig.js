const wrapperConfig = {
    'coin:kaddex.kdx': { isBoosted: true },
    'coin:n_b742b4e9c600892af545afb408326e82a6c0c6ed.zUSD': { isBoosted: true },
    'coin:free.crankk01': { isBoosted: true }
  };
  
  export const isWrapperBoosted = (token0, token1) => {
    const pairKey = `${token0}:${token1}`;
    const reversePairKey = `${token1}:${token0}`;
    return (
      (wrapperConfig[pairKey] && wrapperConfig[pairKey].isBoosted) ||
      (wrapperConfig[reversePairKey] && wrapperConfig[reversePairKey].isBoosted) ||
      false
    );
  };
  
  export default wrapperConfig;