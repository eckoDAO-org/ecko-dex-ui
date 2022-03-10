import React from 'react';
import GradientBorder from '../shared/GradientBorder';
import Label from '../shared/Label';
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import moment from 'moment';
import { FlexContainer } from '../shared/FlexContainer';

const data = [
  {
    name: moment('2022-01-01').format('DD MMM'),
    VCS: 0,
    Team: 0,
    'DAO Treasury': 5,
    'Community Sales': 10,
    'Liquidity Mining': 10,
  },
  {
    name: moment('2022-02-01').format('DD MMM'),
    VCS: 0,
    Team: 0,
    'DAO Treasury': 5,
    'Community Sales': 10,
    'Liquidity Mining': 10,
  },
  {
    name: moment('2022-03-01').format('DD MMM'),
    VCS: 0,
    Team: 0,
    'DAO Treasury': 5,
    'Community Sales': 10,
    'Liquidity Mining': 10,
  },
  {
    name: moment('2022-04-01').format('DD MMM'),
    VCS: 0,
    Team: 2,
    'DAO Treasury': 10,
    'Community Sales': 15,
    'Liquidity Mining': 10,
  },
  {
    name: moment('2022-05-01').format('DD MMM'),
    VCS: 0,
    Team: 2,
    'DAO Treasury': 10,
    'Community Sales': 15,
    'Liquidity Mining': 10,
  },
  {
    name: moment('2022-06-01').format('DD MMM'),
    VCS: 0,
    Team: 2,
    'DAO Treasury': 10,
    'Community Sales': 15,
    'Liquidity Mining': 10,
  },
  {
    name: moment('2022-07-01').format('DD MMM'),
    VCS: 0,
    Team: 3,
    'DAO Treasury': 15,
    'Community Sales': 20,
    'Liquidity Mining': 15,
  },
  {
    name: moment('2022-08-01').format('DD MMM'),
    VCS: 0,
    Team: 3,
    'DAO Treasury': 15,
    'Community Sales': 20,
    'Liquidity Mining': 15,
  },
  {
    name: moment('2022-09-01').format('DD MMM'),
    VCS: 0,
    Team: 3,
    'DAO Treasury': 15,
    'Community Sales': 20,
    'Liquidity Mining': 15,
  },
  {
    name: moment('2022-10-01').format('DD MMM'),
    VCS: 0,
    Team: 4,
    'DAO Treasury': 20,
    'Community Sales': 25,
    'Liquidity Mining': 15,
  },
  {
    name: moment('2022-11-01').format('DD MMM'),
    VCS: 0,
    Team: 4,
    'DAO Treasury': 20,
    'Community Sales': 25,
    'Liquidity Mining': 15,
  },
  {
    name: moment('2022-12-01').format('DD MMM'),
    VCS: 0,
    Team: 4,
    'DAO Treasury': 20,
    'Community Sales': 25,
    'Liquidity Mining': 15,
  },
  {
    name: moment('2023-01-01').format('DD MMM'),
    VCS: 0,
    Team: 5,
    'DAO Treasury': 25,
    'Community Sales': 30,
    'Liquidity Mining': 40,
  },
  {
    name: moment('2023-02-01').format('DD MMM'),
    VCS: 0,
    Team: 5,
    'DAO Treasury': 25,
    'Community Sales': 30,
    'Liquidity Mining': 40,
  },
  {
    name: moment('2023-03-01').format('DD MMM'),
    VCS: 0,
    Team: 5,
    'DAO Treasury': 25,
    'Community Sales': 30,
    'Liquidity Mining': 40,
  },
];

const VestingScheduleChart = () => {
  return (
    <FlexContainer withGradient className="column w-100 h-100">
      <GradientBorder />
      <Label>KDX Release Schedule</Label>
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
        <Tooltip />
        <Area type="monotone" dataKey="Liquidity Mining" stackId="1" stroke="#ed1cb5" fill="#ed1cb5" />
        <Area type="monotone" dataKey="Community Sales" stackId="1" stroke="#ffc658" fill="#ffc658" />
        <Area type="monotone" dataKey="DAO Treasury" stackId="1" stroke="#828cec" fill="#828cec" />
        <Area type="monotone" dataKey="Team" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        <Area type="monotone" dataKey="VCS" stackId="1" stroke="#8884d8" fill="#8884d8" />
        'Liquidity Mining': 200,
      </AreaChart>
    </FlexContainer>
  );
};

export default VestingScheduleChart;
