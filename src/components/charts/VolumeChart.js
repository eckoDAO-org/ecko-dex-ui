/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Label from '../shared/Label';
import { humanReadableNumber } from '../../utils/reduceBalance';
import { BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { FlexContainer } from '../shared/FlexContainer';
import { chartTimeRanges, CHART_OPTIONS, DAILY_VOLUME_RANGE, MONTHLY_VOLUME_RANGE, WEEKLY_VOLUME_RANGE } from '../../constants/chartOptionsConstants';
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
    const volumes = axios.get(
      `${process.env.REACT_APP_KADDEX_STATS_API_URL}/volume/${volumeRange}?dateStart=${
        chartTimeRanges[volumeRange]?.dateStart ?? moment().subtract(60, 'days').format('YYYY-MM-DD')
      }&dateEnd=${moment().subtract(1, 'days').format('YYYY-MM-DD')}`
    );
    const candles = axios.get(
      `${process.env.REACT_APP_KADDEX_STATS_API_URL}/candles?currency=USDT&asset=KDA&dateStart=${
        chartTimeRanges[volumeRange]?.dateStart ?? moment().subtract(60, 'days').format('YYYY-MM-DD')
      }&dateEnd=${moment().subtract(1, 'days').format('YYYY-MM-DD')}`
    );
    Promise.all([volumes, candles]).then(async (res) => {
      const allVolume = [];
      for (const timeRange of res[0]?.data) {
        let kdaVerifiedPrice = null;
        switch (volumeRange) {
          case DAILY_VOLUME_RANGE.value:
            kdaVerifiedPrice = getDailyKdaPrice(timeRange, res[1]?.data);
            break;
          case WEEKLY_VOLUME_RANGE.value:
            kdaVerifiedPrice = getWeeklyKdaPrice(timeRange, res[1]?.data);
            break;
          case MONTHLY_VOLUME_RANGE.value:
            kdaVerifiedPrice = getMonthlyKdaPrice(timeRange, res[1]?.data);
            break;
          default:
            kdaVerifiedPrice = getDailyKdaPrice(timeRange, res[1]?.data);
            break;
        }

        allVolume.push({
          name: timeRange._id,
          title: chartTimeRanges[volumeRange]?.title(timeRange),
          Volume: Number(
            timeRange.volumes
              .reduce((partialSum, currVol) => {
                return partialSum + (currVol.tokenFromName === 'coin' ? currVol.tokenFromVolume : currVol.tokenToVolume);
              }, 0)
              .toFixed(2)
          ),
          kdaPrice: kdaVerifiedPrice,
        });
      }
      setVolume(allVolume);
      setDailyVolume(
        allVolume[allVolume.length - 1].Volume * (allVolume[allVolume.length - 1].kdaPrice ? allVolume[allVolume.length - 1].kdaPrice : kdaPrice)
      );
    });
  }, [volumeRange]);

  const getDailyKdaPrice = (timeRange, candles) => {
    const id = timeRange?._id;
    const candle = candles.find((x) => x?.dayString === id);
    return candle?.price?.close;
  };
  const getWeeklyKdaPrice = (timeRange, candles) => {
    const timeRangeSplitted = timeRange?._id.split('-');
    const days = getWeekDaysByWeekNumber(timeRangeSplitted[0], timeRangeSplitted[1]?.replace('W', ''));
    return getKdaAveragePrice(days, candles);
  };

  const getMonthlyKdaPrice = (timeRange, candles) => {
    const timeRangeSplitted = timeRange?._id.split('-');
    const days = getWeekDaysByMonthNumber(timeRangeSplitted[0], timeRangeSplitted[1]);
    return getKdaAveragePrice(days, candles);
  };

  const getWeekDaysByWeekNumber = (year, weeknumber) => {
    let date = moment()
        .year(year)
        .isoWeek(weeknumber || 1)
        .startOf('week'),
      weeklength = 7,
      result = [];
    while (weeklength--) {
      result.push(date?.format('YYYY-MM-DD'));
      date.add(1, 'day');
    }
    return result;
  };

  const getWeekDaysByMonthNumber = (year, month) => {
    let count = moment()
      .year(year)
      .month(month - 1)
      .daysInMonth();
    let days = [];
    for (var i = 1; i < count + 1; i++) {
      days.push(
        moment()
          .year(year)
          .month(month - 1)
          .date(i)
          .format('YYYY-MM-DD')
      );
    }
    return days;
  };

  const getKdaAveragePrice = (days, candles) => {
    const filteredCandels = [];
    days.forEach((day) => {
      const dailyCandle = candles?.find((x) => x?.dayString === day);
      if (dailyCandle) filteredCandels.push(dailyCandle);
    });

    const sumKdaCandles = filteredCandels?.reduce((a, b) => {
      return a + b?.price?.close;
    }, 0);
    return sumKdaCandles / filteredCandels?.length;
  };

  return (
    <FlexContainer withGradient className="column align-ce h-100 analytics-volumes-container background-fill" style={{ padding: 32 }}>
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
                setDailyVolume(
                  (activePayload &&
                    activePayload[0]?.payload?.Volume * (activePayload[0]?.payload?.kdaPrice ? activePayload[0]?.payload?.kdaPrice : kdaPrice)) ||
                    ''
                );
                setCurrentDate((activePayload && activePayload[0]?.payload?.title) || null);
              }
            }}
            onMouseLeave={() => {
              setDailyVolume(
                volume[volume.length - 1]?.Volume * (volume[volume.length - 1]?.kdaPrice ? volume[volume.length - 1]?.kdaPrice : kdaPrice)
              );
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
