import React, { useState } from 'react';
import styled from 'styled-components';
import Label from '../shared/Label';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getVestingScheduleData } from './data/chartData';
import { FlexContainer } from '../shared/FlexContainer';
import { useApplicationContext } from '../../contexts';
import useWindowSize from '../../hooks/useWindowSize';
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
  const [width] = useWindowSize();
  const [vestingEndDate, setVestingEndDate] = useState(VESTING_4Y_RANGE.value);

  // TODO: set in useWIndowsSize
  const isMobile = () => width && width < 530;

  const xAxisMultiplier = isMobile() ? 3 : 1;

  const getDefs = (id, color) => {
    return (
      <defs key={id}>
        <linearGradient id={id} x1="2" y1="0" x2="1" y2="2">
          <stop offset="0%" stopColor={color} stopOpacity={0.9} />
          <stop offset="75%" stopColor={color} stopOpacity={0.25} />
        </linearGradient>
      </defs>
    );
  };

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
            <XAxis dataKey="name" interval={vestingRanges[vestingEndDate].interval * xAxisMultiplier} />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value} %`} />
            <Tooltip
              content={(data) => {
                return (
                  <VestingPopup>
                    <span className="popupTitle">{data.payload[0]?.payload?.name}</span>
                    {data.payload?.map((p, j) => (
                      <div key={j} style={{ color: p.color, marginTop: 10 }}>
                        {p.name}: {p.value} %
                      </div>
                    ))}
                  </VestingPopup>
                );
              }}
            />

            {[
              { id: 'total-supply', color: themeMode === 'light' ? commonColors.purple : '#AFB0BA' },
              { id: 'liquidity-mining', color: '#E77E76' },
              { id: 'community-sales', color: '#897DBC' },
              { id: 'team', color: '#5AC2DD' },
              { id: 'dao-tresury', color: '#E7638E' },
            ].map((v) => getDefs(v.id, v.color))}
            <Area
              type="monotone"
              dataKey="Total Supply"
              stackId="2"
              stroke={themeMode === 'light' ? commonColors.purple : '#AFB0BA'}
              fill="transparent"
              fillOpacity={0.7}
              strokeWidth={2}
            />
            <Area type="monotone" dataKey="Liquidity mining" stackId="1" stroke="#E77E76" fill="url(#liquidity-mining)" strokeWidth={2} />
            <Area type="monotone" dataKey="Community Sales" stackId="1" stroke="#897DBC" fill="url(#community-sales)" strokeWidth={2} />
            <Area type="monotone" dataKey="Team" stackId="1" stroke="#5AC2DD" fill="url(#team)" strokeWidth={2} />
            <Area type="monotone" dataKey="DAO treasury" stackId="1" stroke="#E7638E" fill="url(#dao-tresury)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </FlexContainer>
  );
};

export default VestingScheduleChart;
