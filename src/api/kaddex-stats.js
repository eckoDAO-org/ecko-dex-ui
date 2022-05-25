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
