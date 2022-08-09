import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Label from '../shared/Label';
import { humanReadableNumber } from '../../utils/reduceBalance';
import { BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { FlexContainer } from '../shared/FlexContainer';
import { chartTimeRanges, CHART_OPTIONS, DAILY_VOLUME_RANGE } from '../../constants/chartOptionsConstants';
import CustomDropdown from '../shared/CustomDropdown';

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

const VolumeChart = ({ kdaPrice, width, height }) => {
  const [volume, setVolume] = useState([]);
  const [dailyVolume, setDailyVolume] = useState('');
  const [currentDate, setCurrentDate] = useState(null);
  const [volumeRange, setVolumeRange] = useState(DAILY_VOLUME_RANGE.value);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_KADDEX_STATS_API_URL}/volume/${volumeRange}?dateStart=${
          chartTimeRanges[volumeRange]?.dateStart ?? moment().subtract(60, 'days').format('YYYY-MM-DD')
        }&dateEnd=${moment().subtract(1, 'days').format('YYYY-MM-DD')}`
      )
      .then(async (res) => {
        const allVolume = [];
        for (const timeRange of res.data) {
          allVolume.push({
            name: timeRange._id,
            title: chartTimeRanges[volumeRange]?.title(timeRange),
            Volume: Number(
              timeRange.volumes.reduce((partialSum, currVol) => {
                return partialSum + (currVol.tokenFromName === 'coin' ? currVol.tokenFromVolume : currVol.tokenToVolume);
              }, 0) * (2).toFixed(2)
            ),
          });
        }
        setVolume(allVolume);
        setDailyVolume(allVolume[allVolume.length - 1].Volume * kdaPrice);
      })
      .catch((err) => console.log('get volume error', err));
  }, [volumeRange, kdaPrice]);

  return (
    <FlexContainer withGradient className="column align-ce w-100 h-100 background-fill" style={{ padding: 32 }}>
      <div className="w-100 flex justify-sb">
        <div>
          <Label fontSize={16}>Volume {chartTimeRanges[volumeRange].timeLabel}</Label>
          <Label fontSize={24}>$ {humanReadableNumber(Number(dailyVolume))}</Label>
          <Label>&nbsp;{currentDate || ''}</Label>
        </div>
        <CustomDropdown
          options={CHART_OPTIONS}
          dropdownStyle={{ minWidth: '66px', padding: 10, height: 30 }}
          onChange={(e, { value }) => {
            setVolumeRange(value);
          }}
          value={volumeRange}
        />
      </div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart
            width={width}
            height={height}
            data={volume}
            onMouseMove={({ activePayload }) => {
              if (activePayload) {
                setDailyVolume((activePayload && activePayload[0]?.payload?.Volume * kdaPrice) || '');
                setCurrentDate((activePayload && activePayload[0]?.payload?.title) || null);
              }
            }}
            onMouseLeave={() => {
              setDailyVolume(volume[volume.length - 1]?.Volume * kdaPrice);
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
            <Bar dataKey="Volume" fill="#ffa900" radius={[10, 10, 10, 10]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </FlexContainer>
  );
};

export default VolumeChart;
