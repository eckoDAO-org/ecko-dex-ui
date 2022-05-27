import React, { useState } from 'react';
import moment from 'moment';
import { humanReadableNumber } from '../../utils/reduceBalance';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import CustomDropdown from '../shared/CustomDropdown';
import { CHART_OPTIONS, DAILY_VOLUME_RANGE } from '../../constants/chartOptionsConstants';
import styled from 'styled-components';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

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

const TokenPriceChart = ({ token, height }) => {
  const [priceRange, setPriceRange] = useState(DAILY_VOLUME_RANGE.value);

  return (
    <FlexContainer className="column align-ce w-100 h-100 background-fill" withGradient style={{ padding: 32 }}>
      <div className="flex justify-sb w-100">
        <div className="column w-100">
          <Label fontSize={24}>$ {humanReadableNumber(Number())}</Label>
          <Label fontSize={16}>{/*currentDate || */ moment().format('DD/MM/YYYY')}</Label>
        </div>
        <CustomDropdown
          options={CHART_OPTIONS}
          dropdownStyle={{ minWidth: '66px', padding: 10, height: 30 }}
          onChange={(e, { value }) => {
            setPriceRange(value);
          }}
          value={priceRange}
        />
      </div>

      <div style={{ width: '100%', height }}>
        <STYChartContainer>
          <AreaChart
            data={fakeData}
            onMouseMove={({ activePayload }) => {
              // if (activePayload) {
              //   setViewedTVL((activePayload && activePayload[0]?.payload?.tvl) || '');
              //   setCurrentDate((activePayload && activePayload[0]?.payload?.name) || null);
              // }
            }}
            onMouseLeave={() => {
              // setViewedTVL(currentTVL);
              // setCurrentDate(null);
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
            <Tooltip label="Price" content={() => ''} />
            <Area type="monotone" dataKey="price" stroke="#ED1CB5" strokeWidth={2} fill="url(#color)" activeDot={{ r: 5 }} dot={{ r: 0 }} />
          </AreaChart>
        </STYChartContainer>
      </div>
    </FlexContainer>
  );
};

export default TokenPriceChart;

const fakeData = [
  { date: '2021-09-10', price: 0.1235 },

  { date: '2021-09-11', price: 1 },
  { date: '2021-09-12', price: 2 },
];
