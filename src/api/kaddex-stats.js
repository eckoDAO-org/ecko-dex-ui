import axios from 'axios';
import moment from 'moment';

const kaddexStatsRequest = async (url) => {
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

export const getTotalVolume = async (startDate, endDate, token) => {
  const [namespace, name] = token.split('.');
  const stats = await getGroupedVolume(startDate, endDate, 'daily');
  let totalVolume = 0;
  if (stats?.data) {
    for (const day of stats?.data) {
      if (day?.volumes) {
        for (const vol of day?.volumes) {
          if (vol?.tokenFromName === name && vol?.tokenFromNamespace === namespace) {
            totalVolume += vol?.tokenFromVolume;
          }
          if (vol?.tokenToName === name && vol?.tokenToNamespace === namespace) {
            totalVolume += vol?.tokenToVolume;
          }
        }
      }
    }
  }

  return totalVolume;
};

export const getDailyCandles = (asset, currency, dateStart, dateEnd = new Date()) => {
  const url = `candles?dateStart=${moment(dateStart).format('YYYY-MM-DD')}&dateEnd=${moment(dateEnd).format('YYYY-MM-DD')}
  &currency=${currency}&asset=${asset}`;
  return kaddexStatsRequest(url);
};
