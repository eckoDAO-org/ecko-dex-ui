import { kaddexStatsRequest, dexscanAllPoolsStatsRequest, dexscanPoolDetailsRequest, dexscanPoolTransactionsRequest } from './kaddex-stats';

export const getAnalyticsData = async (dateStart, dateEnd) => {
  const url = `analytics/get-data?dateStart=${dateStart}&dateEnd=${dateEnd}`;
  return await kaddexStatsRequest(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log('err', err));
};

export const getAnalyticsTokenStatsData = async () => {
  const url = `analytics/get-token-stats`;
  return await kaddexStatsRequest(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log('err', err));
};

export const getAnalyticsPoolsStatsData = async () => {
  const url = `analytics/get-pools-stats`;
  return await kaddexStatsRequest(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log('err', err));
};

// Return all pools information for table on Analytics Pools page
export const getAnalyticsDexscanPoolsData = async () => {
  const url = `api/pairs`;
  return await dexscanAllPoolsStatsRequest(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log('err', err));
};

export const getAnalyticsDexscanPoolDetails = async (poolId) => {
  const url = `api/pairs`;
  return await dexscanPoolDetailsRequest(url, poolId)
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log('err', err));
};

export const getAnalyticsDexscanPoolTransactions = async (poolId, fromTime = undefined, toTime = undefined) => {
  const url = `api/transactions`;

  return await dexscanPoolTransactionsRequest(url, poolId, undefined, fromTime, toTime)
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log('err', err));
};

export const getAnalyticsDexscanAccountTransactions = async (account, fromTime = undefined, toTime = undefined) => {
  const url = `api/transactions`;
  return await dexscanPoolTransactionsRequest(url, undefined, account, fromTime, toTime)
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log('err', err));
};
