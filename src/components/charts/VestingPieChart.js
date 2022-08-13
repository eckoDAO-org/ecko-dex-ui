import React from 'react';
import moment from 'moment';
import styled from 'styled-components/macro';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import useWindowSize from '../../hooks/useWindowSize';
import { FlexContainer } from '../shared/FlexContainer';
//import { getVestingScheduleData } from './data/chartData';
import ProgressBar from '../shared/ProgressBar';

import Label from '../shared/Label';
import { Divider } from 'semantic-ui-react';
import { BoosterIcon, BurnedIcon, DaoIcon, SalesIcon, TeamIcon } from '../../assets';
import { commonTheme } from '../../styles/theme';

const IconContainer = styled.div`
  height: 32px;
  width: 32px;
  margin-right: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    height: 24px;
    width: 100%;
    path {
      fill: ${({ color }) => color};
    }
  }
`;

const VestingPieChart = ({
  kdxSupplyPercentage,
  kdxBurntPercentage,
  kdxLiquidityMiningPercentage,
  kdxCommunitySalePercentage,
  kdxTeamPercentage,
  kdxDaoTreasuryPercentage,
}) => {
  const [width] = useWindowSize();

  //const vesting = getVestingScheduleData('2021-06-01', moment().format('YYYY-MM-DD')).slice(-1)[0];

  //TODO Community Sale will contains private sale
  const chartData = {
    Burned: { name: 'Burned', color: '#6699C9', value: kdxBurntPercentage, icon: <BurnedIcon /> },
    LiquidityMining: { name: 'Liquidity Mining', color: '#E77E76', value: kdxLiquidityMiningPercentage, icon: <BoosterIcon /> },
    CommunitySales: { name: 'Community Sales', color: '#897DBC', value: kdxCommunitySalePercentage, icon: <SalesIcon /> },
    Team: { name: 'Team', color: '#5AC2DD', value: kdxTeamPercentage, icon: <TeamIcon /> },
    DAOTreasury: { name: 'DAO Treasury', color: '#E7638E', value: kdxDaoTreasuryPercentage, icon: <DaoIcon /> },
  };

  const Circulating = { name: 'Circulating', color: '#9797A4', value: kdxSupplyPercentage };

  const NotCirculating = {
    name: 'Not Circulating',
    color: '#9797A4',
    value: 100 - kdxBurntPercentage - kdxSupplyPercentage,
  };

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
            <>
              <FlexContainer key={i} className="flex align-ce justify-sb" mobileStyle={{ marginBottom: 16 }} tabletStyle={{ marginBottom: 16 }}>
                <div className="flex align-ce">
                  <IconContainer color={d.color}>{d?.icon || <div style={{ width: 58 }} />}</IconContainer>
                  <Label fontSize={16} color={d.color} labelStyle={{ marginRight: 70 }}>
                    {d.name}:
                  </Label>
                </div>
                <Label fontSize={16} color={d.color} labelStyle={{ whiteSpace: 'nowrap' }}>
                  {d.value.toFixed(2)} %
                </Label>
              </FlexContainer>
              {d.name === 'Burned' && <Divider fitted style={{ marginBottom: width < commonTheme.mediaQueries.desktopPixel ? 16 : 0 }} />}
            </>
          ))}
          <FlexContainer
            className="flex"
            style={{ marginLeft: 58, width: 'calc(100% - 84)' }}
            mobileStyle={{ marginTop: 16, marginBottom: 16 }}
            tabletStyle={{ marginTop: 16, marginBottom: 16 }}
          >
            <ProgressBar maxValue={100} currentValue={Circulating.value} />
          </FlexContainer>
          <Divider fitted />
          <FlexContainer
            className="flex align-ce justify-sb"
            style={{ marginLeft: 58 }}
            mobileStyle={{ marginTop: 16 }}
            tabletStyle={{ marginTop: 16 }}
          >
            <Label fontSize={16} color={NotCirculating.color} labelStyle={{ marginRight: 50 }}>
              {NotCirculating.name}:
            </Label>
            <Label fontSize={16} color={NotCirculating.color} labelStyle={{ whiteSpace: 'nowrap' }}>
              {NotCirculating.value.toFixed(2)} %
            </Label>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default VestingPieChart;
