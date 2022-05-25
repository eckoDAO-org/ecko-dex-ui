import React, { useEffect, useLayoutEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { FlexContainer } from './FlexContainer';
import Label from './Label';

const StackedBarChartContainer = styled(FlexContainer)`
  .recharts-yAxis,
  .recharts-cartesian-axis-line {
    display: none;
  }

  /* recharts-layer 
  recharts-cartesian-axis-tick
  recharts-cartesian-axis-tick-line 
  
  
  var shortLine = document.getElementById('ShortLine')
shortLine.y1.baseVal.value = 500
  */

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

const StackedBarChart = ({}) => {
  const [barOnHover, setBarOnHover] = useState('');
  console.log('LOG --> barOnHover', barOnHover);
  const data = [{ completed: 60, failed: 20, inprogress: 20 }];

  const CustomTooltip = (props) => {
    return (
      <TooltipContent>
        <Label>{barOnHover}</Label>
      </TooltipContent>
    );
  };

  const ticks = document.getElementsByClassName('recharts-cartesian-axis-tick-line');
  for (const element of ticks) {
    element.setAttribute('y2', -10);
    // if (element !== ticks[0] && element !== ticks[ticks.length - 1]) {
    //   element.setAttribute('y2', -10);
    // } else {
    //   element.style.stroke = 'transparent';
    // }
  }

  // const tspan = document.getElementsByClassName('recharts-text recharts-cartesian-axis-tick-value');
  // console.log('LOG --> tspan', tspan);
  // for (const element of tspan) {
  //   element.;
  // }

  return (
    <StackedBarChartContainer withGradient className="background-fill w-100">
      <ResponsiveContainer height={80} width={'100%'}>
        <BarChart layout="vertical" data={data}>
          <YAxis type="category" dataKey="name" stroke="#FFFFFF" fontSize="12" width={0} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Bar
            onMouseEnter={() => {
              setBarOnHover('completed');
            }}
            onMouseLeave={() => setBarOnHover('')}
            radius={[10, 0, 0, 10]}
            dataKey="completed"
            fill="#82ba7f"
            stackId="a"
          />
          <Bar onMouseEnter={() => setBarOnHover('failed')} onMouseLeave={() => setBarOnHover('')} dataKey="failed" fill="#dd7876" stackId="a" />
          <Bar
            onMouseEnter={() => setBarOnHover('inprogress')}
            onMouseLeave={() => setBarOnHover('')}
            radius={[0, 10, 10, 0]}
            dataKey="inprogress"
            fill="#76a8dd"
            stackId="a"
          />
          <XAxis
            ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            dy={5}
            domain={['dataMin - 1', '100']}
            type="number"
            tickFormatter={(v) => `${v}%`}
          />
        </BarChart>
      </ResponsiveContainer>
    </StackedBarChartContainer>
  );
};

export default StackedBarChart;
