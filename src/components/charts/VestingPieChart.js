import React from 'react';
import moment from 'moment';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { FlexContainer } from '../shared/FlexContainer';
import { getVestingScheduleData } from './data/chartData';
import ProgressBar from '../shared/ProgressBar';

import Label from '../shared/Label';
import { Divider } from 'semantic-ui-react';
import useWindowSize from '../../hooks/useWindowSize';

const VestingPieChart = ({ kdxSupply, KDX_TOTAL_SUPPLY }) => {
  const [width] = useWindowSize();

  const vesting = getVestingScheduleData('2021-06-01', moment().format('YYYY-MM-DD')).slice(-1)[0];
  const notCirculatingValue =
    100 - (100 - vesting['Total Supply']) - vesting['Liquidity mining'] - vesting['Community Sales'] - vesting['Team'] - vesting['DAO treasury'];

  const chartData = {
    Burned: { name: 'Burned', color: '#ED1C1C', value: 100 - vesting['Total Supply'] },
    LiquidityMining: { name: 'Liquidity Mining', color: '#8884d8', value: vesting['Liquidity mining'] },
    CommunitySales: { name: 'Community Sales', color: '#ED1CB5', value: vesting['Community Sales'] },
    Team: { name: 'Team', color: '#D0A032', value: vesting['Team'] },
    DAOTreasury: { name: 'DAO Treasury', color: '#39FFFC', value: vesting['DAO treasury'] },
  };

  const Circulating = { name: 'Circulating', color: '#9797A4', value: 100 - notCirculatingValue };

  const NotCirculating = { name: 'Not Circulating', color: '#9797A4', value: notCirculatingValue };

  const getPieSize = () => {
    if (width < 900) {
      return { outerRadius: 100, innerRadius: 50, size: 201 };
    } else if (width < 1240) {
      return { outerRadius: 140, innerRadius: 80, size: 281 };
    }

    return { outerRadius: 187.5, innerRadius: 100, size: 376 };
  };
  return (
    <FlexContainer withGradient className="w-100 h-100 background-fill column" style={{ padding: 24 }}>
      <Label fontSize={16}>Today {moment().format('DD/MM/YYYY')}</Label>

      <FlexContainer
        className="flex justify-sb"
        mobileClassName="column align-ce"
        desktopStyle={{ marginTop: 24, padding: '16px 85px' }}
        tabletStyle={{ marginTop: 24, padding: '16px 85px' }}
        mobileStyle={{ margin: '24px 0' }}
      >
        <ResponsiveContainer width={getPieSize().size} height={getPieSize().size}>
          <PieChart>
            <Pie
              data={Object.values({ ...chartData, NotCirculating }).map((d) => ({ ...d }))}
              innerRadius={getPieSize().innerRadius}
              outerRadius={getPieSize().outerRadius}
              dataKey="value"
            >
              {Object.values({ ...chartData, NotCirculating }).map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <FlexContainer className="flex column justify-sb" mobileClassName="column w-100" mobileStyle={{ marginTop: 24 }}>
          {Object.values({ ...chartData, Circulating }).map((d, i) => (
            <FlexContainer key={i} className="flex align-ce justify-sb" mobileStyle={{ marginBottom: 16 }} tabletStyle={{ marginBottom: 16 }}>
              <Label fontSize={16} color={d.color} labelStyle={{ marginRight: 50 }}>
                {d.name}:
              </Label>
              <Label fontSize={16} color={d.color}>
                {d.value.toFixed(2)}%
              </Label>
            </FlexContainer>
          ))}
          <FlexContainer className="w-100 flex" mobileStyle={{ marginTop: 16 }} tabletStyle={{ marginTop: 16 }}>
            <ProgressBar maxValue={KDX_TOTAL_SUPPLY} currentValue={kdxSupply} />
          </FlexContainer>
          <Divider fitted />
          <FlexContainer className="flex align-ce justify-sb" mobileStyle={{ marginBottom: 16 }} tabletStyle={{ marginBottom: 16 }}>
            <Label fontSize={16} color={NotCirculating.color} labelStyle={{ marginRight: 50 }}>
              {NotCirculating.name}:
            </Label>
            <Label fontSize={16} color={NotCirculating.color}>
              {NotCirculating.value.toFixed(2)}%
            </Label>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default VestingPieChart;
