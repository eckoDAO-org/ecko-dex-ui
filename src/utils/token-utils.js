import moment from 'moment';
import { getCoingeckoPrice } from '../api/coingecko';
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

  const usdPrice = await getUsdTokenPrice('kadena');
  for (const pool of pools) {
    const usdLiquidity = await getUsdPoolLiquidity(pool);
    const { volume24HUsd } = get24HTokenVolume(volumes, 'coin', usdPrice);

    const apr = getApr(volume24HUsd, usdLiquidity);
    aprs.push({ value: apr, token0: pool.token0, token1: pool.token1 });
  }
  return aprs;
};

// call to coin gecko api
export const getUsdTokenPrice = async (coingeckoName) => {
  return (await getCoingeckoPrice(coingeckoName)) || (await getCoingeckoPrice('kadena'));
};

// convert liquidity in usd
export const getUsdTokenLiquidity = async (coingeckoName, liquidty, usdPrice) => {
  return (usdPrice || (await getUsdTokenPrice(coingeckoName))) * liquidty;
};

// get usd pool liquidity adding both liquidity of the pair converted in usd
export const getUsdPoolLiquidity = async (pool, usdPrice) => {
  const liquidity0 = reduceBalance(pool.reserves[0]);
  const liquidity1 = reduceBalance(pool.reserves[1]);

  const token0 = Object.values(tokenData).find((t) => t.name === pool.token0);
  const token1 = Object.values(tokenData).find((t) => t.name === pool.token1);

  const liquidity0Usd = await getUsdTokenLiquidity(token0.coingeckoName, liquidity0, usdPrice);
  const liquidity1Usd = await getUsdTokenLiquidity(token1.coingeckoName, liquidity1, usdPrice);

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
