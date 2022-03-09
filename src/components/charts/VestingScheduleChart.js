import React from 'react';
import styled from 'styled-components';
import GradientBorder from '../shared/GradientBorder';
import Label from '../shared/Label';
import { CardContainer } from '../stats/StatsTab';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const VestingPopup = styled.div`
  background-color: #0a0d30;
  padding: 15px;
  span {
    color: white;
  }
`;

const startDate = moment('2021-05-01');
const monthInterval = 2;

const data = [
  {
    name: startDate.format('MMM YY'),
    VCS: 0,
    Team: 0,
    'Community Sales': 0,
    'Liquidity Mining': 0,
  },
  {
    name: startDate.add(monthInterval * 1, 'months').format('MMM YY'),
    VCS: 0,
    Team: 0,
    'Community Sales': 0,
    'Liquidity Mining': 0,
  },
  {
    name: startDate.add(monthInterval * 2, 'months').format('MMM YY'),
    VCS: 0,
    Team: 0,
    'Community Sales': 10,
    'Liquidity Mining': 10,
  },
  {
    name: startDate.add(monthInterval * 3, 'months').format('MMM YY'),
    VCS: 0,
    Team: 0,
    'Community Sales': 10,
    'Liquidity Mining': 10,
  },
  {
    name: startDate.add(monthInterval * 4, 'months').format('MMM YY'),
    VCS: 0,
    Team: 0,
    'Community Sales': 10,
    'Liquidity Mining': 10,
  },
  {
    name: startDate.add(monthInterval * 5, 'months').format('MMM YY'),
    VCS: 0,
    Team: 2,
    'Community Sales': 15,
    'Liquidity Mining': 10,
  },
  {
    name: startDate.add(monthInterval * 6, 'months').format('MMM YY'),
    VCS: 0,
    Team: 2,
    'Community Sales': 15,
    'Liquidity Mining': 10,
  },
  {
    name: startDate.add(monthInterval * 7, 'months').format('MMM YY'),
    VCS: 0,
    Team: 2,
    'Community Sales': 15,
    'Liquidity Mining': 10,
  },
  {
    name: startDate.add(monthInterval * 8, 'months').format('MMM YY'),
    VCS: 0,
    Team: 3,
    'Community Sales': 20,
    'Liquidity Mining': 15,
  },
  {
    name: startDate.add(monthInterval * 9, 'months').format('MMM YY'),
    VCS: 0,
    Team: 3,
    'Community Sales': 20,
    'Liquidity Mining': 15,
  },
  {
    name: startDate.add(monthInterval * 10, 'months').format('MMM YY'),
    VCS: 0,
    Team: 3,
    'Community Sales': 20,
    'Liquidity Mining': 15,
  },
  {
    name: startDate.add(monthInterval * 11, 'months').format('MMM YY'),
    VCS: 0,
    Team: 4,
    'Community Sales': 25,
    'Liquidity Mining': 15,
  },
  {
    name: startDate.add(monthInterval * 12, 'months').format('MMM YY'),
    VCS: 0,
    Team: 4,
    'Community Sales': 25,
    'Liquidity Mining': 15,
  },
  {
    name: startDate.add(monthInterval * 13, 'months').format('MMM YY'),
    VCS: 0,
    Team: 4,
    'Community Sales': 25,
    'Liquidity Mining': 15,
  },
  {
    name: startDate.add(monthInterval * 14, 'months').format('MMM YY'),
    VCS: 0,
    Team: 5,
    'Community Sales': 30,
    'Liquidity Mining': 40,
  },
  {
    name: startDate.add(monthInterval * 15, 'months').format('MMM YY'),
    VCS: 0,
    Team: 5,
    'Community Sales': 30,
    'Liquidity Mining': 40,
  },
  {
    name: startDate.add(monthInterval * 16, 'months').format('MMM YY'),
    VCS: 0,
    Team: 5,
    'Community Sales': 30,
    'Liquidity Mining': 40,
  },
];

const VestingScheduleChart = ({ height }) => {
  return (
    <CardContainer>
      <GradientBorder />
      <Label>KDX Vesting</Label>{' '}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart
            width={1000}
            height={400}
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              content={(data) => {
                console.log('🚀 !!! ~ data', data);
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
            <Area type="monotone" dataKey="VCS" stackId="1" stroke="#8884d8" fill="#8884d8" />
            'Liquidity Mining': 200,
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContainer>
  );
};

export default VestingScheduleChart;
