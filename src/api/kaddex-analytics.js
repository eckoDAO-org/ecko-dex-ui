import { kaddexStatsRequest } from './kaddex-stats';

export const getAnalyticsData = async (dateStart, dateEnd) => {
  const url = `analytics/get-data?dateStart=${dateStart}&dateEnd=${dateEnd}`;
  return await kaddexStatsRequest(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log('err', err));
};
