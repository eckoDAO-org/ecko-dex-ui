import axios from 'axios';
import moment from 'moment';
import {customPactFetchLocal} from './pact';

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

const failoverGC = async (tokenName) => {
  if (tokenName) {
    const API = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenName}&vs_currencies=usd`;

    try {
      const res = await axios.get(API);
      return res.data?.[tokenName]?.usd || null;
    } catch (err) {
      console.error('Failover error:', err);
      return null;
    }
  }
  return null;
};

export const getCoingeckoUsdPrice = async (tokenName) => {
  try {
    const result = await customPactFetchLocal(`(n_bfb76eab37bf8c84359d6552a1d96a309e030b71.dia-oracle.get-value "KDA/USD")`);

    if (result.errorMessage) {
      throw new Error(result.errorMessage);
    }

    if (result?.value != null) {
      return result.value;
    } else {
      throw new Error("Invalid or missing value in the result");
    }
  } catch (error) {
    console.error("Error in getCoingeckoUsdPrice:", error.message);
    // Fallback to failoverGC in case of any node issues
    return await failoverGC(tokenName);
  }
};