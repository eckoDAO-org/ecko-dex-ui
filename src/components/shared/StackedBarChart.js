import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { CHART_OPTIONS, DAILY_VOLUME_RANGE } from '../../constants/chartOptionsConstants';
import { getTokenIconById } from '../../utils/token-utils';
import CustomDropdown from './CustomDropdown';
import { CryptoContainer, FlexContainer } from './FlexContainer';
import Label from './Label';

const StackedBarChartContainer = styled(FlexContainer)`
  .recharts-surface {
    margin-left: -5px;
  }
  .recharts-yAxis,
  .recharts-xAxis,
  .recharts-cartesian-axis-line {
    display: none;
  }

  /* recharts-layer 
  recharts-cartesian-axis-tick
  recharts-cartesian-axis-tick-line 
  
  
  var shortLine = document.getElementById('ShortLine')
shortLine.y1.baseVal.value = 500
  */
  .recharts-text,
  .recharts-cartesian-axis-tick-value {
    fill: ${({ theme: { colors } }) => colors.white};
    font-family: ${({ theme: { fontFamily } }) => fontFamily.basier};
  }

  .recharts-cartesian-axis-tick {
    line {
      stroke: #ffffff;
    }
  }

  .recharts-cartesian-axis-ticks > :first-child,
  .recharts-cartesian-axis-ticks > :last-child {
    line {
      display: none;
    }
  }
`;

const TooltipContent = styled.div`
  background: ${({ theme: { colors } }) => colors.primary};
  min-width: 50px;
  height: 50px;
`;

const StackedBarChart = ({ title }) => {
  const [barOnHover, setBarOnHover] = useState('');
  const [volumeRange, setVolumeRange] = useState(DAILY_VOLUME_RANGE.value);
  const data = [{ KDA: 50, KDX: 20, XYZ: 10, OTHER: 20 }];

  const colors = ['#5dcbe5', '#e37480', ' #f6cc7d', '#A9AAB4'];

  const CustomTooltip = (props) => {
    return (
      <TooltipContent>
        <Label>{barOnHover}</Label>
      </TooltipContent>
    );
  };

  return (
    <StackedBarChartContainer gap={24} withGradient className="column background-fill w-100" style={{ padding: 32 }}>
      <div className="w-100 flex justify-sb">
        <Label fontSize={16}>{title}</Label>

        <CustomDropdown
          options={CHART_OPTIONS}
          dropdownStyle={{ minWidth: '66px', padding: 10, height: 30 }}
          onChange={(e, { value }) => {
            setVolumeRange(value);
          }}
          value={volumeRange}
        />
      </div>
      <ResponsiveContainer height={50} width={'100%'} m>
        <BarChart layout="vertical" data={data}>
          <YAxis type="category" dataKey="name" stroke="#FFFFFF" fontSize="12" width={0} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          {Object.keys(data[0]).map((item, index) => {
            return (
              <Bar
                onMouseEnter={() => {
                  setBarOnHover(item);
                }}
                data={{ value: item.value }}
                onMouseLeave={() => setBarOnHover('')}
                radius={index === 0 ? [10, 0, 0, 10] : index === 3 ? [0, 10, 10, 0] : [0, 0, 0, 0]}
                dataKey={item}
                fill={colors[index]}
                stackId="a"
              />
            );
          })}
          <XAxis ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} height={0} dy={5} domain={['dataMin', '100']} type="number" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex w-100">
        {Object.entries(data[0]).map((item, index) => (
          <div className="flex align-fs" style={{ marginRight: 32 }}>
            <div style={{ width: 32, height: 16, borderRadius: 4, background: colors[index], marginRight: 8 }}></div>
            {getTokenIconById(item[0]) && <CryptoContainer size={16}>{getTokenIconById(item[0])}</CryptoContainer>}
            <Label>
              {item[0]} {item[1]}%
            </Label>
          </div>
        ))}
      </div>
    </StackedBarChartContainer>
  );
};

export default StackedBarChart;
