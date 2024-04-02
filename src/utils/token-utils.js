import moment from 'moment';
import { getAnalyticsDexscanPoolsData } from '../api/kaddex-analytics';
import { getCoingeckoUsdPrice } from '../api/coingecko';
import { getTotalKDAVolume } from '../api/kaddex-stats';
import { getPairsMultiplier } from '../api/liquidity-rewards';
import { getPairList } from '../api/pact';
import { CHAIN_ID, APR_FEE, STAKING_REWARDS_PERCENT } from '../constants/contextConstants';
import { bigNumberConverter } from './bignumber';
import { reduceBalance } from './reduceBalance';

export const getTokenByModuleV2 = (token, allTokens) => {
  const tokenCode = token.refName.namespace ? `${token.refName.namespace}.${token.refName.name}` : `${token.refName.name}`;
  const token0 = Object.values(allTokens).find((t) => t.code === tokenCode);
  if (token0?.name) {
    return token0.name === 'zUSD' ? token0.name : token0?.name?.toUpperCase();
  }
  return token0?.toUpperCase();
};

export const getTokenName = (code, allTokens) => {
  const token0 = Object.values(allTokens).find((t) => t.code === code);
  if (token0?.name) {
    return token0?.name;
  }
  return code?.toUpperCase();
};

export const getTokenIconById = (token, allTokens) => {
  return allTokens[token]?.icon;
};
export const getTokenIconByCode = (tokenCode, allTokens) => {
  return allTokens[getTokenName(tokenCode, allTokens)]?.icon;
};

export const getInfoCoin = (item, coinPositionArray, allTokens) => {
  let cryptoCode = item?.params[coinPositionArray]?.refName?.namespace
    ? `${item?.params[coinPositionArray]?.refName?.namespace}.${item?.params[coinPositionArray]?.refName?.name}`
    : item?.params[coinPositionArray]?.refName?.name;
  const crypto = Object.values(allTokens).find(({ code }) => code === cryptoCode);
  return crypto
    ? crypto
    : {
        code: cryptoCode,
        coingeckoId: 'kadena',
        color: '#FFFFFF',
        icon: null,
        isVerified: false,
        main: false,
        name: cryptoCode.split('.')[1],
        precision: 12,
        tokenNameKaddexStats: null,
      };
};

export const getApr = (volume, liquidity) => {
  const percentageOnVolume = volume * APR_FEE;
  const percentagePerYear = percentageOnVolume * 365;
  const apr = liquidity ? (percentagePerYear * 100) / liquidity : 0;

  return apr;
};

export const getDailyUSDRewards = (totalDailyVolumeUSD) => (totalDailyVolumeUSD * STAKING_REWARDS_PERCENT) / 100;

export const getStakingApr = (totalDailyVolumeUSD, totalUsdStakedKDX) => {
  if (isNaN(totalDailyVolumeUSD) || isNaN(totalUsdStakedKDX)) {
    return null;
  }
  const dailyRewards = getDailyUSDRewards(totalDailyVolumeUSD);
  const yearlyRewards = dailyRewards * 365;
  return (100 * yearlyRewards) / totalUsdStakedKDX;
};

export const getPairByTokensName = (token0Name, token1Name, allPairs) => {
  return Object.values(allPairs).find(
    (pair) => (pair.token0 === token0Name && pair.token1 === token1Name) || (pair.token0 === token1Name && pair.token1 === token0Name)
  );
};

// calculate liquidity, volumes and apr for each pool
// TODO: NOT USED
export const getAllPairValues = async (pools, volumes, allTokens) => {
  const result = [];

  for (const pool of pools) {
    const token0 = Object.values(allTokens).find((t) => t.name === pool.token0);
    const token1 = Object.values(allTokens).find((t) => t.name === pool.token1);

    const liquidity0 = token0.code === 'coin' ? reduceBalance(pool.reserves[0]) : reduceBalance(pool.reserves[1]);
    const liquidity1 = token1.code === 'coin' ? reduceBalance(pool.reserves[0]) : reduceBalance(pool.reserves[1]);
    let liquidityUsd = 0;
    let volume24H = 0;
    let volume24HUsd = 0;
    let apr = 0;
    const liquidity = liquidity0 + liquidity1;

    //ToDo: workaround for pool name with coin as second argument. Be careful when add create-pair function
    const tokenArraySorted = token0.code === 'coin' ? [token0, token1] : [token1, token0];

    // retrieve usd value for each token of the pair to calculate values in usd
    for (const token of tokenArraySorted) {
      const tokenUsdPrice = await getTokenUsdPrice({ coingeckoId: 'kadena' }, pools);

      if (tokenUsdPrice) {
        volume24H = await getTotalKDAVolume(
          moment().subtract(1, 'days').toDate(),
          moment().subtract(1, 'days').toDate(),
          token.tokenNameKaddexStats,
          volumes
        );

        volume24HUsd = volume24H * tokenUsdPrice * 2;
        liquidityUsd += liquidity0 * tokenUsdPrice;
        apr = getApr(volume24HUsd, liquidityUsd);
      } else {
        apr = getApr(volume24H, liquidity);
        liquidityUsd = null;
      }
    }
    result.push({ ...pool, liquidityUsd, liquidity, volume24HUsd, volume24H, apr: { value: apr, token0: pool.token0, token1: pool.token1 } });
  }

  return result;
};

export const getAllPairsData = async (tokensUsdPrice, allTokens, allPairs, _pools) => {
  const pools = _pools ? _pools : await getPairList(allPairs);

  if (pools.length) {
    const dexscanPoolsStats = await getAnalyticsDexscanPoolsData();
    const multipliers = await getPairsMultiplier(pools);
    let allData = [];
    for (const pool of pools) {
      let volume24HUsd = 0;
      let liquidityUsd = 0;
      let apr = 0;
      const token0 = Object.values(allTokens).find((t) => t.name === pool.token0);
      const token1 = Object.values(allTokens).find((t) => t.name === pool.token1);

      const specificPairData = dexscanPoolsStats.filter(
        (d) =>
          (d.token0.address === token0.code && d.token1.address === token1.code) ||
          (d.token0.address === token1.code && d.token1.address === token0.code)
      );

      let liquidity0 = 0;
      let liquidity1 = 0;

      if (tokensUsdPrice) {
        liquidity0 = tokensUsdPrice[token0?.name] ? reduceBalance(pool.reserves[0]) * tokensUsdPrice[token0.name] : 0;
        liquidity1 = tokensUsdPrice[token1?.name] ? reduceBalance(pool.reserves[1]) * tokensUsdPrice[token1.name] : 0;

        volume24HUsd = specificPairData[0] ? specificPairData[0].volume24h : 0;

        liquidityUsd = liquidity0 + liquidity1;
        apr = volume24HUsd && liquidityUsd ? getApr(volume24HUsd, liquidityUsd) : 0;
      } else {
        apr = null;
        liquidityUsd = null;
        volume24HUsd = null;
      }

      const multiplier = multipliers.find((m) => m.pair === pool.name).multiplier;

      let data = {
        ...pool,
        apr,
        multiplier,
        liquidityUsd,
        liquidity0,
        liquidity1,
        volume24HUsd,
      };
      allData.push(data);
    }

    return allData;
  }
};

// convert liquidity in usd
export const getUsdTokenLiquidity = (liquidty, usdPrice) => {
  return usdPrice * liquidty;
};

export const isMatchingStatToken = (statNamespace, statName, code) => {
  const [namespace, name] = code.split('.');
  const isMatch = (namespace === statNamespace && name === statName) || (namespace === 'coin' && !name);
  return isMatch;
};

const getVolume = (volume, tokenNameKaddexStats) => {
  if (isMatchingStatToken(volume.tokenFromNamespace, volume.tokenFromName, tokenNameKaddexStats)) {
    return volume.tokenFromVolume;
  } else {
    return volume.tokenToVolume;
  }
};

export const get24HVolumeDoubleSided = (volumes, token0NameKaddexStats, token1NameKaddexStats, tokenNameKaddexStats) => {
  const last24hDailyVolume = volumes.slice(-1)[0];
  return last24hDailyVolume.volumes
    ?.filter(
      (v) =>
        v.chain === Number(CHAIN_ID) &&
        ((isMatchingStatToken(v.tokenFromNamespace, v.tokenFromName, token0NameKaddexStats) &&
          isMatchingStatToken(v.tokenToNamespace, v.tokenToName, token1NameKaddexStats)) ||
          (isMatchingStatToken(v.tokenFromNamespace, v.tokenFromName, token1NameKaddexStats) &&
            isMatchingStatToken(v.tokenToNamespace, v.tokenToName, token0NameKaddexStats)))
    )
    .reduce((total, v) => total + getVolume(v, tokenNameKaddexStats), 0);
};

export const get24HVolumeSingleSided = (volumes, tokenNameKaddexStats) => {
  const last24hDailyVolume = volumes?.slice(-1)[0];
  return last24hDailyVolume?.volumes
    ?.filter(
      (v) =>
        v.chain === Number(CHAIN_ID) &&
        (isMatchingStatToken(v.tokenFromNamespace, v.tokenFromName, tokenNameKaddexStats) ||
          isMatchingStatToken(v.tokenToNamespace, v.tokenToName, tokenNameKaddexStats))
    )
    .reduce((total, v) => total + getVolume(v, tokenNameKaddexStats), 0);
};

export const getTokenUsdPriceByLiquidity = (liquidity0, liquidity1, usdPrice, precision = 8) => {
  const liquidityRatio = liquidity0 / liquidity1;
  return bigNumberConverter(liquidityRatio * usdPrice, precision);
};

/**
 * @param {string} tokenName [example: "KDX"]
 */
export const getTokenUsdPriceByName = async (tokenName, pools, allTokens, kdaPrice, dexscanPoolsStats) => {
  const specificPairData = dexscanPoolsStats.filter(
    (d) => (d.token0.name === tokenName && d.token1.name === 'KDA') || (d.token0.name === 'KDA' && d.token1.name === tokenName)
  );
  if (specificPairData[0] && tokenName !== 'KDA') {
    return specificPairData[0].price;
  } else {
    const token = Object.values(allTokens).find((t) => t.name === tokenName);
    return await getTokenUsdPrice(token, pools, allTokens, kdaPrice);
  }
};

// retrieve token usd price based on the first pair that contains the token with a known price
export const getTokenUsdPrice = async (token, pairsList, allTokens, kdaPrice) => {
  if (!Array.isArray(pairsList)) {
    return null;
  }
  const filteredPairs = pairsList.filter((p) => p.token0 === token.name || p.token1 === token.name);

  let tokenUsd = token.name === 'KDA' && !kdaPrice ? await getCoingeckoUsdPrice(token.coingeckoId) : token.name === 'KDA' ? kdaPrice : null;
  if (tokenUsd) {
    return tokenUsd;
  } else {
    if (filteredPairs) {
      for (const pair of filteredPairs) {
        const liquidity0 = reduceBalance(pair.reserves[0]);
        const liquidity1 = reduceBalance(pair.reserves[1]);

        if (pair.token0 === token.name) {
          const token1 = Object.values(allTokens).find((t) => t.name === pair.token1);
          const token1Usd = token1.name === 'KDA' && !kdaPrice ? await getCoingeckoUsdPrice(token1.coingeckoId) : kdaPrice;
          if (!token1Usd) {
            tokenUsd = null;
          } else {
            return getTokenUsdPriceByLiquidity(liquidity1, liquidity0, token1Usd, token.precision);
          }
        } else {
          const token0 = Object.values(allTokens).find((t) => t.name === pair.token0);
          const token0Usd = token0.name === 'KDA' && !kdaPrice ? await getCoingeckoUsdPrice(token0.coingeckoId) : kdaPrice;
          if (!token0Usd) {
            tokenUsd = null;
          }
          return getTokenUsdPriceByLiquidity(liquidity0, liquidity1, token0Usd, token.precision);
        }

        return tokenUsd;
      }
    }
    return 0;
  }
};

export const checkIfTokenIsInBoostedPool = (item, allPairs) => {
  const itemCode = item.code;
  let pairIsBoosted = null;
  Object.keys(allPairs).forEach((pair) => {
    const tokens = pair.split(':');
    if (tokens[0] === itemCode || tokens[1] === itemCode) {
      pairIsBoosted = allPairs[pair].isBoosted;
    }
  });
  return pairIsBoosted;
};
