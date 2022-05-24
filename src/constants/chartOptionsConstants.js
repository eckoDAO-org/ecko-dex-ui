import moment from 'moment';
////VOLUME
export const DAILY_VOLUME_RANGE = {
  key: 0,
  text: '24h',
  value: 'daily',
};
export const WEEKLY_VOLUME_RANGE = {
  key: 1,
  text: '7d',
  value: 'weekly',
};
export const MONTHLY_VOLUME_RANGE = {
  key: 2,
  text: '1m',
  value: 'monthly',
};

export const CHART_OPTIONS = [DAILY_VOLUME_RANGE, WEEKLY_VOLUME_RANGE, MONTHLY_VOLUME_RANGE];

export const chartTimeRanges = {
  [DAILY_VOLUME_RANGE.value]: {
    name: (_id) => moment(_id).format('DD/MM/YYYY'),
    dateStart: moment().subtract(60, 'days').format('YYYY-MM-DD'),
    title: (payload) => moment(payload._id).format('DD/MM/YYYY'),
    timeLabel: '24h',
  },
  [WEEKLY_VOLUME_RANGE.value]: {
    name: (_id) => _id,
    dateStart: moment()
      .subtract(7 * 40, 'days')
      .format('YYYY-MM-DD'),
    title: (payload) => moment(payload.volumes[0]?.startDay).format('DD/MM/YYYY'),
    timeLabel: 'weekly',
  },
  [MONTHLY_VOLUME_RANGE.value]: {
    name: (_id) => _id,
    dateStart: moment()
      .subtract(30 * 6, 'days')
      .days(0)
      .format('YYYY-MM-DD'),
    title: (payload) => moment(payload.volumes[0]?.startDay).format('MMM YY'),
    timeLabel: 'monthly',
  },
};
///TVL
export const TVL_3M_RANGE = {
  key: 0,
  text: '3m',
  value: '3m',
};
export const TVL_6M_RANGE = {
  key: 1,
  text: '6m',
  value: '6m',
};
export const TVL_12M_RANGE = {
  key: 2,
  text: '1y',
  value: '1y',
};

export const TVL_CHART_OPTIONS = [TVL_3M_RANGE, TVL_6M_RANGE, TVL_12M_RANGE];

export const tvlRanges = {
  [TVL_3M_RANGE.value]: {
    name: (_id) => moment(_id).format('DD/MM/YYYY'),
    dateStart: moment().subtract(90, 'days').format('YYYY-MM-DD'),
    title: (payload) => moment(payload._id).format('DD/MM/YYYY'),
    timeLabel: '3m',
  },
  [TVL_6M_RANGE.value]: {
    name: (_id) => _id,
    dateStart: moment().subtract(6, 'months').format('YYYY-MM-DD'),
    title: (payload) => moment(payload.volumes[0]?.startDay).format('DD/MM/YYYY'),
    timeLabel: '6m',
  },
  [TVL_12M_RANGE.value]: {
    name: (_id) => _id,
    dateStart: moment().subtract(1, 'years').days(0).format('YYYY-MM-DD'),
    title: (payload) => moment(payload.volumes[0]?.startDay).format('MMM YY'),
    timeLabel: '1y',
  },
};
