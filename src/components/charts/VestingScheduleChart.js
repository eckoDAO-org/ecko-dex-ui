import React, { useState } from 'react';
import styled from 'styled-components';
import Label from '../shared/Label';
import { TimeRangeBar, TimeRangeBtn } from './VolumeChart';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getVestingScheduleData } from './data/chartData';
import { FlexContainer } from '../shared/FlexContainer';

export const VestingHeader = styled.div`
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    padding: 15px;
  }
  width: 100%;
  display: flex;
  padding: 0 22px;
  justify-content: space-between;
`;

export const VestingPopup = styled.div`
  background-color: #0a0d30;
  padding: 15px;
  span {
    color: white;
  }
`;

const endDate4Years = '2025-11-01';
const endDate10Years = '2031-06-01';

const VestingScheduleChart = ({ height }) => {
  const [endDate, setEndDate] = useState(endDate4Years);
  return (
    <FlexContainer withGradient className="column w-100 h-100 background-fill">
      <VestingHeader>
        <Label></Label>
        <Label>KDX Vesting</Label>

        <TimeRangeBar>
          <TimeRangeBtn className={endDate === endDate4Years ? 'active' : ''} onClick={() => setEndDate(endDate4Years)}>
            4y
          </TimeRangeBtn>
          <TimeRangeBtn className={endDate === endDate10Years ? 'active' : ''} onClick={() => setEndDate(endDate10Years)}>
            10y
          </TimeRangeBtn>
        </TimeRangeBar>
      </VestingHeader>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart
            data={getVestingScheduleData('2021-06-01', endDate)}
            margin={{
              top: 10,
              right: 30,
              left: -10,
              bottom: 0,
            }}
          >
            <XAxis dataKey="name" interval={endDate === endDate4Years ? 2 : 4} />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              content={(data) => {
                return (
                  <VestingPopup>
                    <span className="popupTitle">{data.payload[0]?.payload?.name}</span>
                    {data.payload?.map((p, j) => (
                      <div key={j} style={{ color: p.color, marginTop: 10 }}>
                        {p.name}: {p.value}%
                      </div>
                    ))}
                  </VestingPopup>
                );
              }}
            />
            <Area type="monotone" dataKey="Total Supply" stackId="2" stroke="#ffffffb3" fill="#4120727a" />
            <Area type="monotone" dataKey="Liquidity mining" stackId="1" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" dataKey="Community Sales" stackId="1" stroke="#ffc658" fill="#ffc658" />
            <Area type="monotone" dataKey="Team" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            <Area type="monotone" dataKey="DAO treasury" stackId="1" stroke="#ed1cb5" fill="#ed1cb5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </FlexContainer>
  );
};

export default VestingScheduleChart;
