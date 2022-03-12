import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import GradientBorder from '../shared/GradientBorder';
import Label from '../shared/Label';
import { GraphCardHeader } from './TVLChart';
import { humanReadableNumber } from '../../utils/reduceBalance';
import { BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { FlexContainer } from '../shared/FlexContainer';

export const TimeRangeBar = styled.div`
  display: flex;
  width: 90px;
  justify-content: space-around;
`;
export const TimeRangeBtn = styled(Label)`
  cursor: pointer;
  font-size: 16px;
  &.active {
    font-weight: bold;
    font-size: 20px;
  }
`;

const DAILY_VOLUME_RANGE = 'daily';
const WEEKLY_VOLUME_RANGE = 'weekly';
const MONTHLY_VOLUME_RANGE = 'monthly';

const volumeRanges = {
  [DAILY_VOLUME_RANGE]: {
    name: (_id) => moment(_id).format('DD/MM/YYYY'),
    dateStart: moment().subtract(60, 'days').format('YYYY-MM-DD'),
    title: (payload) => moment(payload._id).format('DD/MM/YYYY'),
  },
  [WEEKLY_VOLUME_RANGE]: {
    name: (_id) => _id,
    dateStart: moment()
      .subtract(7 * 40, 'days')
      .format('YYYY-MM-DD'),
    title: (payload) => moment(payload.volumes[0]?.startDay).format('DD/MM/YYYY'),
  },
  [MONTHLY_VOLUME_RANGE]: {
    name: (_id) => _id,
    dateStart: moment()
      .subtract(30 * 12, 'days')
      .format('YYYY-MM-DD'),
    title: (payload) => moment(payload.volumes[0]?.startDay).format('MMM YY'),
  },
};

const VolumeChart = ({ width, height, containerStyle }) => {
  const [volume, setVolume] = useState([]);
  const [dailyVolume, setDailyVolume] = useState('');
  const [currentDate, setCurrentDate] = useState(null);
  const [volumeRange, setVolumeRange] = useState(DAILY_VOLUME_RANGE);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_KADDEX_STATS_API_URL}/volume/${volumeRange}?dateStart=${
          volumeRanges[volumeRange]?.dateStart ?? moment().subtract(60, 'days').format('YYYY-MM-DD')
        }&dateEnd=${moment().format('YYYY-MM-DD')}`
      )
      .then((res) => {
        const allVolume = [];
        for (const timeRange of res.data) {
          allVolume.push({
            name: timeRange._id,
            title: volumeRanges[volumeRange]?.title(timeRange),
            Volume: Number(
              timeRange.volumes
                .reduce((partialSum, currVol) => {
                  return partialSum + (currVol.tokenFromName === 'coin' ? currVol.tokenFromVolume : currVol.tokenToVolume);
                }, 0)
                .toFixed(2)
            ),
          });
        }
        setVolume(allVolume);
        setDailyVolume(allVolume[allVolume.length - 1].Volume);
      })
      .catch((err) => console.log('get volume error', err));
  }, [volumeRange]);

  return (
    <FlexContainer withGradient className="column align-ce w-100 h-100" style={containerStyle}>
      <GradientBorder />
      <GraphCardHeader>
        <div>
          <Label fontSize={16}>Volume 24h</Label>
          <Label fontSize={24}>{humanReadableNumber(Number(dailyVolume))} KDA</Label>
          <Label>&nbsp;{currentDate || ''}</Label>
        </div>
        <TimeRangeBar>
          <TimeRangeBtn className={volumeRange === DAILY_VOLUME_RANGE ? 'active' : ''} onClick={() => setVolumeRange(DAILY_VOLUME_RANGE)}>
            D
          </TimeRangeBtn>
          <TimeRangeBtn className={volumeRange === WEEKLY_VOLUME_RANGE ? 'active' : ''} onClick={() => setVolumeRange(WEEKLY_VOLUME_RANGE)}>
            W
          </TimeRangeBtn>
          <TimeRangeBtn className={volumeRange === MONTHLY_VOLUME_RANGE ? 'active' : ''} onClick={() => setVolumeRange(MONTHLY_VOLUME_RANGE)}>
            M
          </TimeRangeBtn>
        </TimeRangeBar>
      </GraphCardHeader>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart
            width={width}
            height={height}
            data={volume}
            onMouseMove={({ activePayload }) => {
              if (activePayload) {
                setDailyVolume((activePayload && activePayload[0]?.payload?.Volume) || '');
                setCurrentDate((activePayload && activePayload[0]?.payload?.title) || null);
              }
            }}
            onMouseLeave={() => {
              setDailyVolume(volume[volume.length - 1]?.Volume ?? null);
              setCurrentDate(null);
            }}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <Tooltip label="Volume" content={() => ''} />
            <Bar dataKey="Volume" fill="#F68862" radius={[10, 10, 10, 10]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </FlexContainer>
  );
};

export default VolumeChart;
