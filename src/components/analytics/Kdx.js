import React from 'react';
import { BoosterIcon, BurnedIcon, DaoIcon } from '../../assets';
import { usePactContext } from '../../contexts';
import useWindowSize from '../../hooks/useWindowSize';
import theme, { commonColors } from '../../styles/theme';
import { humanReadableNumber } from '../../utils/reduceBalance';
import VestingPieChart from '../charts/VestingPieChart';
import VestingScheduleChart from '../charts/VestingScheduleChart';
import AnalyticsSimpleWidget from '../shared/AnalyticsSimpleWidget';
import { FlexContainer } from '../shared/FlexContainer';
import GraphicPercetage from '../shared/GraphicPercetage';
import ProgressBar from '../shared/ProgressBar';

const Kdx = ({ KDX_TOTAL_SUPPLY, kdxSupply, kdaPrice, kdxBurnt }) => {
  const [width] = useWindowSize();
  const pact = usePactContext();

  const getColumns = () => {
    if (width <= theme.mediaQueries.mobilePixel) {
      return 1;
    } else return width <= theme.mediaQueries.desktopPixel ? 2 : 3;
  };
  return (
    <FlexContainer className="column" gap={16}>
      <FlexContainer className="grid" columns={getColumns()} gridColumnGap={16}>
        <AnalyticsSimpleWidget
          title={'Price'}
          mainText={
            <div className="flex align-ce">
              {`$ ${pact?.tokensUsdPrice?.KDX || '-'}`}
              <GraphicPercetage prevValue={50} currentValue={99} componentStyle={{ marginLeft: 10, marginTop: 0 }} />
            </div>
          }
          subtitle={pact?.tokensUsdPrice?.KDX && `${(pact?.tokensUsdPrice?.KDX / kdaPrice).toFixed(4)} KDA`}
        />
        <AnalyticsSimpleWidget
          title="Marketcap"
          mainText={(kdxSupply && `$ ${humanReadableNumber(Number(kdxSupply * pact?.tokensUsdPrice?.KDX))}`) || '-'}
          subtitle={<GraphicPercetage prevValue={99} currentValue={2} />}
        />

        <AnalyticsSimpleWidget
          title={'Circulating supply'}
          mainText={(kdxSupply && `${humanReadableNumber(kdxSupply, 2)} KDX`) || '-'}
          subtitle={
            <div className="w-100 flex" style={{ paddingTop: 10 }}>
              <ProgressBar
                activeBackground="white"
                maxValue={KDX_TOTAL_SUPPLY}
                currentValue={kdxSupply}
                containerStyle={{ flex: 1, paddingTop: 2 }}
              />
              <span style={{ flex: 2, marginLeft: 20 }}>{((100 * kdxSupply) / KDX_TOTAL_SUPPLY).toFixed(2)} %</span>
            </div>
          }
        />
        <AnalyticsSimpleWidget
          title={'Burned'}
          mainText={(kdxBurnt && `${humanReadableNumber(kdxBurnt, 2)} KDX`) || '-'}
          subtitle={`${((100 * kdxBurnt) / KDX_TOTAL_SUPPLY).toFixed(2)} %`}
          icon={<BurnedIcon />}
          iconColor={commonColors.redComponent}
        />

        <AnalyticsSimpleWidget
          title={'DAO Treasury'}
          mainText={`${humanReadableNumber(KDX_TOTAL_SUPPLY * 0.25, 2)} KDX` || '-'}
          subtitle={`${(25).toFixed(2)} %`}
          icon={<DaoIcon />}
          iconColor={commonColors.gold}
        />
        <AnalyticsSimpleWidget
          title={'Liquidity Mining'}
          mainText={`${humanReadableNumber(KDX_TOTAL_SUPPLY * 0.4, 2)} KDX` || '-'}
          subtitle={`${(40).toFixed(2)} %`}
          icon={<BoosterIcon />}
          iconColor={commonColors.pink}
        />
      </FlexContainer>
      <VestingScheduleChart height={300} />
      <VestingPieChart kdxSupply={kdxSupply} KDX_TOTAL_SUPPLY={KDX_TOTAL_SUPPLY} />
    </FlexContainer>
  );
};

export default Kdx;
