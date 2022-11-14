import axios from 'axios';
import moment from 'moment';

export const getAnalyticsKdaUsdPrice = async () => {
  const kdaPrice = await axios.get(
    `${process.env.REACT_APP_KADDEX_STATS_API_URL}/candles?dateStart=${moment().subtract(1, 'days').format('YYYY-MM-DD')}&dateEnd=${moment().format(
      'YYYY-MM-DD'
    )}&currency=USDT&asset=KDA`
  );
  if (kdaPrice) {
    return kdaPrice?.data[kdaPrice.data.length - 1]?.price?.close;
  } else {
    return null;
  }
};

export const getCoingeckoUsdPrice = async (tokenName) => {
  if (tokenName) {
    const API = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenName}&vs_currencies=usd`;

    return await axios
      .get(API)
      .then(async (res) => {
        return res.data?.[tokenName]?.usd;
      })
      .catch((err) => {
        console.log('error', err);
        return null;
      });
  } else return null;
};
