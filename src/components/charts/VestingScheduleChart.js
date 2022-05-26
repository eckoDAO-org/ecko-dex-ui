import React, { useState } from 'react';
import styled from 'styled-components';
import Label from '../shared/Label';
import { TimeRangeBar, TimeRangeBtn } from './VolumeChart';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getVestingScheduleData } from './data/chartData';
import { FlexContainer } from '../shared/FlexContainer';
import { useApplicationContext } from '../../contexts';
import { commonColors } from '../../styles/theme';
import CustomDropdown from '../shared/CustomDropdown';
import { vestingRanges, VESTING_4Y_RANGE, VESTING_CHART_OPTIONS } from '../../constants/chartOptionsConstants';

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

const VestingScheduleChart = ({ height }) => {
  const { themeMode } = useApplicationContext();
  const [vestingEndDate, setVestingEndDate] = useState(VESTING_4Y_RANGE.value);
  return (
    <FlexContainer withGradient className="column w-100 h-100 background-fill">
      <div className="flex justify-sb align-ce w-100">
        <Label fontSize={16}>Vesting Schedule</Label>
        <CustomDropdown
          options={VESTING_CHART_OPTIONS}
          dropdownStyle={{ minWidth: '66px', padding: 10, height: 30 }}
          onChange={(e, { value }) => {
            setVestingEndDate(value);
          }}
          value={vestingEndDate}
        />
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart
            data={getVestingScheduleData('2021-06-01', vestingRanges[vestingEndDate].endDate)}
            margin={{
              top: 10,
              right: 30,
              left: -10,
              bottom: 0,
            }}
          >
            <XAxis dataKey="name" interval={vestingRanges[vestingEndDate].interval} />
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
            <Area
              type="monotone"
              dataKey="Total Supply"
              stackId="2"
              stroke={themeMode === 'light' ? commonColors.purple : '#ffffffb3'}
              fillOpacity={0}
            />
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
