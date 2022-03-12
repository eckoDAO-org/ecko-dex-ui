import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import GradientBorder from '../shared/GradientBorder';
import Label from '../shared/Label';
import { GraphCardHeader } from './TVLChart';
import { humanReadableNUmber } from '../../utils/reduceBalance';
import { CardContainer } from '../stats/StatsTab';
import { BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

export const TimeRangeBar = styled.div`
  display: flex;
  width: 90px;
  justify-content: space-around;
`;
export const TimeRangeBtn = styled(Label)`
  cursor: pointer;
  &.active {
    font-weight: bold;
    font-size: 20px;
  }
`;

const VolumeChart = ({ width, height, containerStyle }) => {
  const [volume, setVolume] = useState([]);
  const [dailyVolume, setDailyVolume] = useState('');
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_KADDEX_STATS_API_URL}/volume/daily?dateStart=${moment()
          .subtract(60, 'days')
          .format('YYYY-MM-DD')}&dateEnd=${moment().format('YYYY-MM-DD')}`
      )
      .then((res) => {
        const allVolume = [];
        for (const day of res.data) {
          allVolume.push({
            name: moment(day._id).format('DD/MM/YYYY'),
            Volume: Number(
              day.volumes
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
  }, []);

  return (
    <CardContainer style={containerStyle}>
      <GradientBorder />
      <GraphCardHeader>
        <div>
          <Label fontSize={16}>Volume 24h</Label>
          <Label fontSize={24}>{humanReadableNUmber(Number(dailyVolume))} KDA</Label>
          <Label>&nbsp;{currentDate || ''}</Label>
        </div>
        {/* <TimeRangeBar>
          <TimeRangeBtn className="active" fontSize={16}>
            D
          </TimeRangeBtn>
          <TimeRangeBtn fontSize={16}>W</TimeRangeBtn>
          <TimeRangeBtn fontSize={16}>M</TimeRangeBtn>
        </TimeRangeBar> */}
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
                setCurrentDate((activePayload && activePayload[0]?.payload?.name) || null);
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
    </CardContainer>
  );
};

export default VolumeChart;
