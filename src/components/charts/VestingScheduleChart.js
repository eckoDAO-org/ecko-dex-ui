import React from 'react';
import styled from 'styled-components';
import GradientBorder from '../shared/GradientBorder';
import Label from '../shared/Label';
import { TimeRangeBar, TimeRangeBtn } from './VolumeChart';
import { CardContainer } from '../stats/StatsTab';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getVestingScheduleData } from './data/vestingSchedule';

const VestingHeader = styled.div`
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    padding: 15px;
  }
  width: 100%;
  display: flex;
  padding: 0 22px;
  justify-content: space-between;
`;

const VestingPopup = styled.div`
  background-color: #0a0d30;
  padding: 15px;
  span {
    color: white;
  }
`;

const VestingScheduleChart = ({ height }) => {
  return (
    <CardContainer>
      <GradientBorder />
      <VestingHeader>
        <Label></Label>
        <Label>KDX Vesting</Label>

        <TimeRangeBar>
          <TimeRangeBtn className="active" fontSize={16}>
            3y
          </TimeRangeBtn>
          <TimeRangeBtn fontSize={16}>10y</TimeRangeBtn>
        </TimeRangeBar>
      </VestingHeader>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart
            data={getVestingScheduleData('2021-07-01', '2024-07-01')}
            margin={{
              top: 10,
              right: 30,
              left: -10,
              bottom: 0,
            }}
          >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              content={(data) => {
                return (
                  <VestingPopup>
                    <span className="popupTitle">{data.payload[0]?.payload?.name}</span>
                    {data.payload?.map((p) => (
                      <div style={{ color: p.color, marginTop: 10 }}>
                        {p.name}: {p.value}%
                      </div>
                    ))}
                  </VestingPopup>
                );
              }}
            />
            <Area type="monotone" dataKey="Liquidity Mining" stackId="1" stroke="#ed1cb5" fill="#ed1cb5" />
            <Area type="monotone" dataKey="Community Sales" stackId="1" stroke="#ffc658" fill="#ffc658" />
            <Area type="monotone" dataKey="Team" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            <Area type="monotone" dataKey="DAO" stackId="1" stroke="#8884d8" fill="#8884d8" />
            'Liquidity Mining': 200,
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContainer>
  );
};

export default VestingScheduleChart;
