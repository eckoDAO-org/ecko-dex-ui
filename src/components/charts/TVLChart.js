import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import axios from 'axios';
import { Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Label from '../shared/Label';
import { humanReadableNumber } from '../../utils/reduceBalance';
import { FlexContainer } from '../shared/FlexContainer';
import { getGroupedTVL } from '../../api/kaddex-stats';
import CustomDropdown from '../shared/CustomDropdown';
import { tvlRanges, TVL_3M_RANGE, TVL_CHART_OPTIONS } from '../../constants/chartOptionsConstants';

export const GraphCardHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    padding: 15px 0px 0px 15px;
  }
`;

const STYChartContainer = styled(ResponsiveContainer)`
  .recharts-wrapper {
    width: 100% !important;
  }
  .recharts-surface {
    width: 100%;
  }
  .recharts-cartesian-grid {
    display: none;
  }
`;

const TVLChart = ({ kdaPrice, height }) => {
  const [viewedTVL, setViewedTVL] = useState(null);
  const [currentTVL, setCurrentTVL] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [tvlRange, setTvlRange] = useState(TVL_3M_RANGE.value);

  const [tvlData, setTVLData] = useState([]);

  useEffect(() => {
    const groupedTvl = getGroupedTVL(
      tvlRanges[tvlRange]?.dateStart ?? moment().subtract(90, 'days').format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD')
    );
    const candles = axios.get(
      `${process.env.REACT_APP_KADDEX_STATS_API_URL}/candles?currency=USDT&asset=KDA&dateStart=${
        tvlRanges[tvlRange]?.dateStart ?? moment().subtract(60, 'days').format('YYYY-MM-DD')
      }&dateEnd=${moment().subtract(1, 'days').format('YYYY-MM-DD')}`
    );
    Promise.all([groupedTvl, candles])
      .then(async (res) => {
        const allTVL = [];
        for (const day of res[0].data) {
          let kdaVerifiedPrice = getDailyKdaPrice(day, res[1]?.data) || kdaPrice;

          allTVL.push({
            name: moment(day._id).format('DD/MM/YYYY'),
            tvl: +day.tvl
              .reduce((partialSum, currVol) => {
                if (currVol.tokenFrom === 'coin') {
                  const tokenToPrice = (currVol.tokenFromTVL / currVol.tokenToTVL) * kdaVerifiedPrice;
                  return partialSum + currVol.tokenFromTVL * kdaVerifiedPrice + currVol.tokenToTVL * tokenToPrice;
                } else {
                  const tokenFromPrice = (currVol.tokenToTVL / currVol.tokenFromTVL) * kdaVerifiedPrice;
                  return partialSum + currVol.tokenFromTVL * tokenFromPrice + currVol.tokenToTVL * kdaVerifiedPrice;
                }
              }, 0)
              .toFixed(2),
            kdaVerifiedPrice,
          });
        }
        setTVLData(allTVL);
        setCurrentTVL(allTVL[allTVL.length - 1].tvl);
        setViewedTVL(allTVL[allTVL.length - 1].tvl);
      })
      .catch((err) => console.log('get tvl error', err));
  }, [kdaPrice, tvlRange]);

  const getDailyKdaPrice = (day, candles) => {
    const id = day?._id;
    const candle = candles.find((x) => x?.dayString === id);
    return candle?.price?.close;
  };

  return (
    <FlexContainer className="column align-ce h-100 analytics-tvl-container background-fill" withGradient style={{ padding: 32 }}>
      <div className="flex justify-sb w-100">
        <div className="column w-100">
          <Label fontSize={16}>TVL</Label>
          <Label fontSize={24}>$ {humanReadableNumber(Number(viewedTVL))}</Label>
          <Label fontSize={16}>{currentDate || moment().format('DD/MM/YYYY')}</Label>
        </div>
        <CustomDropdown
          options={TVL_CHART_OPTIONS}
          dropdownStyle={{ minWidth: '66px', padding: 10, height: 30 }}
          onChange={(e, { value }) => {
            setTvlRange(value);
          }}
          value={tvlRange}
        />
      </div>

      <div style={{ width: '100%', height }}>
        <STYChartContainer>
          <AreaChart
            data={tvlData}
            onMouseMove={({ activePayload }) => {
              if (activePayload) {
                setViewedTVL((activePayload && activePayload[0]?.payload?.tvl) || '');
                setCurrentDate((activePayload && activePayload[0]?.payload?.name) || null);
              }
            }}
            onMouseLeave={() => {
              setViewedTVL(currentTVL);
              setCurrentDate(null);
            }}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="color" x1="2" y1="0" x2="1" y2="2">
                <stop offset="0%" stopColor="#ED1CB5" stopOpacity={0.9} />
                <stop offset="75%" stopColor="#ED1CB5." stopOpacity={0.25} />
              </linearGradient>
            </defs>
            <Tooltip label="TVL" content={() => ''} />
            <Area type="monotone" dataKey="tvl" stroke="#ED1CB5" strokeWidth={2} fill="url(#color)" activeDot={{ r: 5 }} dot={{ r: 0 }} />
          </AreaChart>
        </STYChartContainer>
      </div>
    </FlexContainer>
  );
};
export default TVLChart;
