import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import Label from './Label';

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

  return (
    <ResponsiveContainer height={100} width={'100%'}>
      <BarChart layout="vertical" data={data} margin={{ left: 50, right: 50 }}>
        <YAxis type="category" dataKey="name" stroke="#FFFFFF" fontSize="12" />
        <Tooltip content={<CustomTooltip />} />
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
        <XAxis ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} domain={[10, 100]} type="number" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarChart;
