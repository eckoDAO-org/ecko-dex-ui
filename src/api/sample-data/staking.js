export const poolStateData = { 'burnt-kdx': 0.359282203366, 'revenue-per-kdx': 0.004133966188375, 'staked-kdx': 50.0 };

export const estimateUnstakeSampleData = (account) => ({
  'current-time': '2020-01-08T00:00:00Z',
  'can-claim': false,
  'reward-accrued': 0.020516508948,
  'reward-penalty': 0.019138307146,
  staked: 20.0,
  'stake-penalty': 0.0,
  'stake-record': {
    account,
    amount: 20.0,
    'effective-start': '2020-01-02T00:00:00Z',
    'last-add-request': '2020-01-03T00:00:00Z',
    'last-claim': '2020-01-07T00:00:00Z',
    'last-stake': '2020-01-03T00:00:00Z',
    'pending-add': 0.0,
    rollover: 0.006828361269,
    'start-cumulative': 0.0034495588044,
  },
});
