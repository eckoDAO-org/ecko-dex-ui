import axios from 'axios';
import moment from 'moment';

export const kaddexStatsRequest = async (url) => {
  try {
    return await axios
      .get(`${process.env.REACT_APP_KADDEX_STATS_API_URL}/${url}`, {
        headers: { accept: 'application/json' },
      })
      .then(async (res) => {
        return res;
      })
      .catch((err) => console.log('stats error', err));
  } catch (error) {
    console.log('error', error);
  }
};

export const dexscanAllPoolsStatsRequest = async (url) => {
  try {
    return await axios
      .get(`${process.env.REACT_APP_DEXSCAN_API_URL}/${url}`, {
        headers: { accept: 'application/json' },
      })
      .then(async (res) => {
        return res;
      })
      .catch((err) => console.log('dexscan stats error', err));
  } catch (error) {
    console.log('error', error);
  }
};

export const dexscanPoolDetailsRequest = async (url, poolId) => {
  try {
    return await axios
      .get(`${process.env.REACT_APP_DEXSCAN_API_URL}/${url}`, {
        headers: { accept: 'application/json' },
        params: {
          id: poolId,
          exchange: 'KADDEX',
        },
      })
      .then(async (res) => {
        return res;
      })
      .catch((err) => console.log('dexscan stats error', err));
  } catch (error) {
    console.log('error', error);
  }
};

export const dexscanPoolTransactionsRequest = async (url, poolId=undefined, account=undefined, fromTime = undefined, toTime = undefined) => {
  try {
    return await axios
      .get(`${process.env.REACT_APP_DEXSCAN_API_URL}/${url}`, {
        headers: { accept: 'application/json' },
        params: {
          id: poolId,
          account,
          exchange: 'KADDEX',
          limit: 25,
          fromTime,
          toTime,
        },
      })
      .then(async (res) => {
        return res;
      })
      .catch((err) => console.log('dexscan stats error', err));
  } catch (error) {
    console.log('error', error);
  }
};

//TODO: NOT USED
export const getDailyVolume = async () => {
  const url = `volume/daily?dateStart=${moment().subtract(4, 'day').format('YYYY-MM-DD')}&dateEnd=${moment()
    .subtract(1, 'day')
    .format('YYYY-MM-DD')}`;
  return await kaddexStatsRequest(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log('err', err));
};

export const getGroupedVolume = (startDate, endDate, type = 'daily') => {
  const url = `volume/${type}?dateStart=${moment(startDate).format('YYYY-MM-DD')}&dateEnd=${moment(endDate).format('YYYY-MM-DD')}`;
  return kaddexStatsRequest(url);
};

export const getGroupedTVL = (startDate, endDate, type = 'daily') => {
  const url = `tvl/${type}?dateStart=${moment(startDate).format('YYYY-MM-DD')}&dateEnd=${moment(endDate).format('YYYY-MM-DD')}`;
  return kaddexStatsRequest(url);
};

export const getTotalKDAVolume = async (startDate, endDate, token, stats) => {
  const [namespace, name] = token.split('.');
  let verifiedStats = null;
  if (!stats) {
    verifiedStats = await getGroupedVolume(startDate, endDate, 'daily');
  } else {
    verifiedStats = stats;
  }
  let totalVolume = 0;
  if (verifiedStats?.data) {
    for (const day of verifiedStats?.data) {
      if (day?.volumes) {
        for (const vol of day?.volumes) {
          if ((vol?.tokenFromName === name && vol?.tokenFromNamespace === namespace) || (vol?.tokenToName === 'coin' && token === 'coin')) {
            totalVolume += vol?.tokenToVolume;
          }
          if ((vol?.tokenToName === name && vol?.tokenToNamespace === namespace) || (vol?.tokenFromName === 'coin' && token === 'coin')) {
            totalVolume += vol?.tokenFromVolume;
          }
        }
      }
    }
  }

  return totalVolume;
};

export const getTotalVolume = async (startDate, endDate, token, stats) => {
  const [namespace, name] = token.split('.');
  let verifiedStats = null;
  if (!stats) {
    verifiedStats = await getGroupedVolume(startDate, endDate, 'daily');
  } else {
    verifiedStats = stats;
  }
  let totalVolume = 0;
  if (verifiedStats?.data) {
    for (const day of verifiedStats?.data) {
      if (day?.volumes) {
        for (const vol of day?.volumes) {
          if ((vol?.tokenFromName === name && vol?.tokenFromNamespace === namespace) || (vol?.tokenFromName === 'coin' && token === 'coin')) {
            totalVolume += vol?.tokenFromVolume;
          }
          if ((vol?.tokenToName === name && vol?.tokenToNamespace === namespace) || (vol?.tokenToName === 'coin' && token === 'coin')) {
            totalVolume += vol?.tokenToVolume;
          }
        }
      }
    }
  }

  return totalVolume;
};

export const getTokenVolumeDiff = async (startDate, endDate, asset) => {
  const final = await getTotalVolume(endDate, new Date(), asset);
  const initial = await getTotalVolume(startDate, endDate, asset);
  return {
    initial,
    final,
  };
};

export const getUSDPriceDiff = async (dateStart, dateEnd, asset, currency) => {
  const candles = await getDailyCandles(asset, currency, dateStart, dateEnd);
  return candles?.data?.length
    ? {
        initial: candles?.data[0]?.usdPrice?.close,
        final: candles?.data[candles?.data?.length - 1]?.usdPrice?.close,
      }
    : null;
};

export const getKDAPriceDiff = async (dateStart, dateEnd, asset, currency) => {
  const candles = await getDailyCandles(asset, currency, dateStart, dateEnd);
  return candles?.data?.length
    ? {
        initial: candles?.data[0]?.price?.close,
        final: candles?.data[candles?.data?.length - 1]?.price?.close,
      }
    : null;
};

export const getDailyCandles = (asset, currency, dateStart, dateEnd = new Date()) => {
  const url = `candles?dateStart=${moment(dateStart).format('YYYY-MM-DD')}&dateEnd=${moment(dateEnd).format('YYYY-MM-DD')}
  &currency=${currency}&asset=${asset}`;
  return kaddexStatsRequest(url);
};
