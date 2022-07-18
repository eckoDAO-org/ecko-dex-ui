import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { BoosterIcon, BurnedIcon, DaoIcon } from '../../assets';
import { usePactContext } from '../../contexts';
import useWindowSize from '../../hooks/useWindowSize';
import theme, { commonColors } from '../../styles/theme';
import tokenData from '../../constants/cryptoCurrencies';
import { extractDecimal, getDecimalPlaces, humanReadableNumber } from '../../utils/reduceBalance';
import { getDailyCandles } from '../../api/kaddex-stats';
import VestingPieChart from '../charts/VestingPieChart';
import VestingScheduleChart from '../charts/VestingScheduleChart';
import AnalyticsSimpleWidget from '../shared/AnalyticsSimpleWidget';
import { FlexContainer } from '../shared/FlexContainer';
import GraphicPercentage from '../shared/GraphicPercentage';
import ProgressBar from '../shared/ProgressBar';

const Kdx = ({ KDX_TOTAL_SUPPLY, kdxSupply, kdaPrice, kdxBurnt }) => {
  const [width] = useWindowSize();
  const pact = usePactContext();
  const [kdxPriceDiff, setKdxPriceDiff] = useState(null);

  const kdxToken = tokenData.KDX ?? null;
  const asset = (kdxToken.statsID || kdxToken.code) === 'coin' ? 'KDA' : kdxToken.statsID || kdxToken.code;
  const currency = (kdxToken.statsID || kdxToken.code) === 'coin' ? 'USDT' : 'coin';

  useEffect(() => {
    const initData = async () => {
      if (kdxToken && asset && currency) {
        const { data } = await getDailyCandles(asset, currency, moment().subtract(2, 'days').toDate(), new Date());
        if (data?.length) {
          const lastKDXPrice = data[data?.length - 1]?.usdPrice?.close;
          setKdxPriceDiff({ initial: lastKDXPrice, final: pact?.tokensUsdPrice?.KDX });
        }
      }
    };
    initData();
  }, [kdxToken, asset, currency, pact?.tokensUsdPrice?.KDX]);

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
              <GraphicPercentage
                prevValue={kdxPriceDiff?.initial}
                currentValue={kdxPriceDiff?.final}
                componentStyle={{ marginLeft: 10, marginTop: 0 }}
              />
            </div>
          }
          subtitle={pact?.tokensUsdPrice?.KDX && `${getDecimalPlaces(extractDecimal(pact?.tokensUsdPrice?.KDX / kdaPrice))} KDA`}
        />
        <AnalyticsSimpleWidget
          title="Marketcap"
          mainText={(kdxSupply && pact?.tokensUsdPrice?.KDX && `$ ${humanReadableNumber(Number(kdxSupply * pact?.tokensUsdPrice?.KDX))}`) || '-'}
          subtitle={<GraphicPercentage prevValue={kdxPriceDiff?.initial} currentValue={kdxPriceDiff?.final} />}
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
