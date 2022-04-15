import { getCoingeckoUsdPrice } from '../api/coingecko';
import { CHAIN_ID, FEE } from '../constants/contextConstants';
import tokenData from '../constants/cryptoCurrencies';
import { bigNumberConverter } from './bignumber';
import { getPairList } from '../api/pact-pair';
import { reduceBalance } from './reduceBalance';

export const showTicker = (ticker) => {
  if (ticker === 'coin') return 'KDA';
  else if (ticker === 'runonflux.flux') return 'FLUX';
  else return ticker?.toUpperCase();
};

export const getTokenName = (code) => {
  const token0 = Object.values(tokenData).find((t) => t.code === code);
  if (token0?.name) {
    return token0?.name?.toUpperCase();
  }
  return code?.toUpperCase();
};

export const getTokenIcon = (token) => {
  return tokenData[showTicker(token)]?.icon;
};

export const getKadenaTokenPrice = () => {};

export const getInfoCoin = (item, coinPositionArray) => {
  let cryptoCode = item?.params[coinPositionArray]?.refName?.namespace
    ? `${item?.params[coinPositionArray]?.refName?.namespace}.${item?.params[coinPositionArray]?.refName?.name}`
    : item?.params[coinPositionArray]?.refName?.name;
  const crypto = Object.values(tokenData).find(({ code }) => code === cryptoCode);
  return crypto;
};

export const getApr = (volume, liquidity) => {
  const percentageOnVolume = (volume / 100) * FEE;
  const percentagePerYear = percentageOnVolume * 365;
  const apr = (percentagePerYear * 100) / liquidity;

  return apr;
};

// calculate liquidity, volumes and apr for each pool
export const getAllPairValues = async (pools, volumes) => {
  const result = [];

  for (const pool of pools) {
    const token0 = Object.values(tokenData).find((t) => t.name === pool.token0);
    const token1 = Object.values(tokenData).find((t) => t.name === pool.token1);

    const liquidity0 = reduceBalance(pool.reserves[0]);
    const liquidity1 = reduceBalance(pool.reserves[1]);
    let liquidityUsd = 0;
    let volume24H = 0;
    let volume24HUsd = 0;
    let apr = 0;
    const liquidity = liquidity0 + liquidity1;

    // retrieve usd value for each token of the pair to calculate values in usd
    for (const token of [token0, token1]) {
      const tokenUsdPrice = await getTokenUsdPrice(token, pools);

      if (tokenUsdPrice) {
        volume24H = get24HVolumeDoubleSided(volumes, token0.tokenNameKaddexStats, token1.tokenNameKaddexStats, token.tokenNameKaddexStats);
        volume24HUsd = volume24H * tokenUsdPrice;
        liquidityUsd += (token.name === token0.name ? liquidity0 : liquidity1) * tokenUsdPrice;
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

// convert liquidity in usd
export const getUsdTokenLiquidity = (liquidty, usdPrice) => {
  return usdPrice * liquidty;
};

const getVolume = (volume, tokenNameKaddexStats) => {
  if (volume.tokenFromName === tokenNameKaddexStats) {
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
        ((v.tokenFromName === token0NameKaddexStats && v.tokenToName === token1NameKaddexStats) ||
          (v.tokenFromName === token1NameKaddexStats && v.tokenToName === token0NameKaddexStats))
    )
    .reduce((total, v) => total + getVolume(v, tokenNameKaddexStats), 0);
};

export const get24HVolumeSingleSided = (volumes, tokenNameKaddexStats) => {
  const last24hDailyVolume = volumes.slice(-1)[0];
  return last24hDailyVolume.volumes
    ?.filter((v) => v.chain === Number(CHAIN_ID) && (v.tokenFromName === tokenNameKaddexStats || v.tokenToName === tokenNameKaddexStats))
    .reduce((total, v) => total + getVolume(v, tokenNameKaddexStats), 0);
};

export const getTokenUsdPriceByLiquidity = (liquidity0, liquidity1, usdPrice) => {
  const liquidityRatio = liquidity0 / liquidity1;
  return bigNumberConverter(liquidityRatio * usdPrice);
};

/**
 * @param {string} tokenName [example: "KDX"]
 */
export const getTokenUsdPriceByName = async (tokenName) => {
  const pools = await getPairList();
  const token = Object.values(tokenData).find((t) => t.name === tokenName);
  return await getTokenUsdPrice(token, pools);
};

// retrieve token usd price based on the first pair that contains the token with a known price
export const getTokenUsdPrice = async (token, pairsList) => {
  const filteredPairs = pairsList.filter((p) => p.token0 === token.name || p.token1 === token.name);

  let tokenUsd = await getCoingeckoUsdPrice(token.coingeckoId);
  if (tokenUsd) {
    return tokenUsd;
  } else {
    for (const pair of filteredPairs) {
      const liquidity0 = reduceBalance(pair.reserves[0]);
      const liquidity1 = reduceBalance(pair.reserves[1]);

      if (pair.token0 === token.name) {
        const token1 = Object.values(tokenData).find((t) => t.name === pair.token1);
        const token1Usd = await getCoingeckoUsdPrice(token1.coingeckoId);
        if (!token1Usd) {
          tokenUsd = null;
        } else {
          return getTokenUsdPriceByLiquidity(liquidity1, liquidity0, token1Usd);
        }
      } else {
        const token0 = Object.values(tokenData).find((t) => t.name === pair.token0);
        const token0Usd = await getCoingeckoUsdPrice(token0.coingeckoId);
        if (!token0Usd) {
          tokenUsd = null;
        }
        return getTokenUsdPriceByLiquidity(liquidity0, liquidity1, token0Usd);
      }

      return tokenUsd;
    }
  }
};
