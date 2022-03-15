import moment from 'moment';
import { getCoingeckoUsdPrice } from '../api/coingecko';
import { chainId, FEE } from '../constants/contextConstants';
import tokenData from '../constants/cryptoCurrencies';
import { reduceBalance } from './reduceBalance';

export const showTicker = (ticker) => {
  if (ticker === 'coin') return 'KDA';
  else if (ticker === 'runonflux.flux') return 'FLUX';
  else return ticker?.toUpperCase();
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

export const getApr = (usdVolume, usdLiquidity) => {
  const percentageOnVolume = (usdVolume / 100) * FEE;
  const percentagePerYear = percentageOnVolume * 365;
  const apr = (percentagePerYear * 100) / usdLiquidity;

  return apr;
};
// calculate all apr for each pair
export const getAllApr = async (pools, volumes) => {
  const aprs = [];

  const usdPrice = await await getCoingeckoUsdPrice('kadena');
  for (const pool of pools) {
    const usdLiquidity = await getUsdPoolLiquidity(pool);
    const { volume24HUsd } = get24HTokenVolume(volumes, 'coin', usdPrice);

    const apr = getApr(volume24HUsd, usdLiquidity);
    aprs.push({ value: apr, token0: pool.token0, token1: pool.token1 });
  }
  return aprs;
};

// convert liquidity in usd
export const getUsdTokenLiquidity = (liquidty, usdPrice) => {
  return usdPrice * liquidty;
};

// get usd pool liquidity adding both liquidity of the pair converted in usd
export const getUsdPoolLiquidity = async (pool, usdPrice) => {
  const kdaUsd = await getCoingeckoUsdPrice('kadena');
  const liquidity0 = reduceBalance(pool.reserves[0]);
  const liquidity1 = reduceBalance(pool.reserves[1]);

  const token0 = Object.values(tokenData).find((t) => t.name === pool.token0);
  const token1 = Object.values(tokenData).find((t) => t.name === pool.token1);

  const token0Usd = await getCoingeckoUsdPrice(token0.coingeckoName);
  const token1Usd = await getCoingeckoUsdPrice(token1.coingeckoName);

  let liquidity0Usd = 0;
  let liquidity1Usd = 0;
  if (token0.name === 'KDA') {
    liquidity0Usd = getUsdTokenLiquidity(liquidity0, token0Usd);
    if (token1Usd) {
      liquidity1Usd = getUsdTokenLiquidity(liquidity1, token1Usd);
    } else {
      const liquidityRatio = liquidity0 / liquidity1;
      liquidity1Usd = liquidityRatio * kdaUsd * liquidity1;
    }
  } else {
    liquidity1Usd = getUsdTokenLiquidity(liquidity1, token1Usd);
    if (token0Usd) {
      liquidity0Usd = getUsdTokenLiquidity(liquidity0, token0Usd);
    } else {
      const liquidityRatio = liquidity1 / liquidity0;
      liquidity0Usd = liquidityRatio * kdaUsd * liquidity0;
    }
  }

  return liquidity0Usd + liquidity1Usd;
};

export const get24HTokenVolume = (volumes, tokenNameKaddexStats, usdPrice) => {
  const last24hDailyVolume = volumes.find((d) => d._id === moment().subtract(1, 'day').format('YYYY-MM-DD'));

  const volume24H = last24hDailyVolume.volumes
    ?.filter((v) => v.chain === Number(chainId))
    .reduce((total, v) => {
      if (v.tokenFromName === tokenNameKaddexStats) {
        total += v.tokenFromVolume;
      } else {
        total += v.tokenToVolume;
      }
      return total;
    }, 0);
  const volume24HUsd = volume24H * usdPrice;
  return { volume24H, volume24HUsd };
};
