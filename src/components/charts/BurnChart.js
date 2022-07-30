import React, { useState } from 'react';
import Label from '../shared/Label';
import { TimeRangeBar, TimeRangeBtn } from './VolumeChart';
import { VestingHeader, VestingPopup } from './VestingScheduleChart';
import { CardContainer } from '../stats/StatsTab';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getBurningData } from './data/chartData';

const endDate4Years = '2025-11-01';
const endDate10Years = '2031-06-01';

const VestingScheduleChart = ({ height }) => {
  const [endDate, setEndDate] = useState(endDate4Years);
  return (
    <CardContainer>
      <VestingHeader>
        <Label></Label>
        <Label>KDX Burning</Label>

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
            data={getBurningData('2021-06-01', endDate)}
            margin={{
              top: 10,
              right: 30,
              left: -10,
              bottom: 0,
            }}
          >
            <XAxis dataKey="name" interval={endDate === endDate4Years ? 2 : 4} />
            <YAxis domain={[0, 100]} />
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
            <Area type="monotone" dataKey="TotalSupply" stackId="1" stroke="#ffc658" fill="#ffc658" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContainer>
  );
};

export default VestingScheduleChart;
