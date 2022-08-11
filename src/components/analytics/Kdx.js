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
import KdxDaoTreasuryDetails from './analytics-details/KdxDaoTreasuryDetails';
import KdxCirculatingSupplyDetails from './analytics-details/KdxCirculatingSupplyDetails';

const Kdx = ({ KDX_TOTAL_SUPPLY, kdaPrice, analyticsData }) => {
  console.log('LOG --> analyticsData', analyticsData);
  const [width] = useWindowSize();
  const pact = usePactContext();
  const kdxPrice = pact?.tokensUsdPrice?.KDX;
  const [kdxPriceDiff, setKdxPriceDiff] = useState(null);

  const kdxToken = tokenData.KDX ?? null;
  const asset = (kdxToken.statsID || kdxToken.code) === 'coin' ? 'KDA' : kdxToken.statsID || kdxToken.code;
  const currency = (kdxToken.statsID || kdxToken.code) === 'coin' ? 'USDT' : 'coin';

  useEffect(() => {
    const initData = async () => {
      if (kdxToken && asset && currency) {
        const { data } = await getDailyCandles(asset, currency, moment().subtract(1, 'days').toDate(), new Date());
        if (data?.length) {
          const initial = data[0]?.usdPrice?.close;
          const final = data[1]?.usdPrice?.close;
          setKdxPriceDiff({ initial, final });
        }
      }
    };
    initData();
  }, [kdxToken, asset, currency, kdxPrice]);

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
              {`$ ${kdxPrice ? humanReadableNumber(kdxPrice, 3) : '-'}`}
              <GraphicPercentage
                prevValue={kdxPriceDiff?.initial}
                currentValue={kdxPriceDiff?.final}
                componentStyle={{ marginLeft: 10, marginTop: 0 }}
              />
            </div>
          }
          subtitle={kdxPrice && `${getDecimalPlaces(extractDecimal(kdxPrice / kdaPrice))} KDA`}
        />
        <AnalyticsSimpleWidget
          title="Marketcap"
          mainText={
            (analyticsData?.circulatingSupply?.totalSupply &&
              kdxPrice &&
              `$ ${humanReadableNumber(Number(analyticsData?.circulatingSupply?.totalSupply * kdxPrice))}`) ||
            '-'
          }
          subtitle={<GraphicPercentage prevValue={kdxPriceDiff?.initial} currentValue={kdxPriceDiff?.final} />}
        />

        <AnalyticsSimpleWidget
          title={'Circulating supply'}
          mainText={
            (analyticsData?.circulatingSupply?.totalSupply && `${humanReadableNumber(analyticsData?.circulatingSupply?.totalSupply, 2)} KDX`) || '-'
          }
          subtitle={
            <div className="w-100 flex" style={{ paddingTop: 10 }}>
              <ProgressBar
                activeBackground="white"
                maxValue={KDX_TOTAL_SUPPLY}
                currentValue={analyticsData?.circulatingSupply?.totalSupply}
                containerStyle={{ flex: 1, paddingTop: 2 }}
              />
              <span style={{ flex: 2, marginLeft: 20 }}>
                {((100 * analyticsData?.circulatingSupply?.totalSupply) / KDX_TOTAL_SUPPLY).toFixed(2)} %
              </span>
            </div>
          }
          detailsContent={
            <KdxCirculatingSupplyDetails
              supply={analyticsData?.circulatingSupply ? analyticsData?.circulatingSupply : []}
              tokensUsdPrice={pact.tokensUsdPrice}
            />
          }
        />
        <AnalyticsSimpleWidget
          title={'Burned'}
          mainText={
            (analyticsData?.burn && `${humanReadableNumber(analyticsData?.burn?.stakingBurn + analyticsData?.burn?.tokenBurn, 2)} KDX`) || '-'
          }
          subtitle={`${(((analyticsData?.burn?.stakingBurn + analyticsData?.burn?.tokenBurn) / KDX_TOTAL_SUPPLY) * 100).toFixed(2)} %`}
          icon={<BurnedIcon />}
          iconColor={commonColors.redComponent}
        />
        {/* TODO: add Dao tresury and Liquidity Mining */}
        <AnalyticsSimpleWidget
          title={'DAO Treasury'}
          mainText={`${analyticsData?.daoTreasury ? humanReadableNumber(analyticsData?.daoTreasury?.amount, 2) : '-'} KDX`}
          subtitle={`${analyticsData?.daoTreasury ? ((analyticsData?.daoTreasury?.amount / KDX_TOTAL_SUPPLY) * 100).toFixed(2) : '-'} %`}
          icon={<DaoIcon />}
          iconColor={commonColors.gold}
          detailsContent={
            <KdxDaoTreasuryDetails
              positions={analyticsData?.daoTreasury ? analyticsData?.daoTreasury?.lpPositions : []}
              tokensUsdPrice={pact.tokensUsdPrice}
            />
          }
        />
        <AnalyticsSimpleWidget
          title={'Liquidity Mining'}
          mainText={`${analyticsData?.liquidityMining ? humanReadableNumber(analyticsData?.liquidityMining, 2) : '-'} KDX`}
          subtitle={`${analyticsData?.liquidityMining ? ((analyticsData?.liquidityMining / KDX_TOTAL_SUPPLY) * 100).toFixed(2) : '-'} %`}
          icon={<BoosterIcon />}
          iconColor={commonColors.pink}
        />
      </FlexContainer>
      <VestingScheduleChart height={300} />
      <VestingPieChart
        kdxSupplyPercentage={(analyticsData?.circulatingSupply?.totalSupply / KDX_TOTAL_SUPPLY) * 100}
        kdxBurntPercentage={((analyticsData?.burn?.stakingBurn + analyticsData?.burn?.tokenBurn) / KDX_TOTAL_SUPPLY) * 100}
        kdxLiquidityMiningPercentage={(analyticsData?.liquidityMining / KDX_TOTAL_SUPPLY) * 100}
        kdxCommunitySalePercentage={(analyticsData?.communitySale / KDX_TOTAL_SUPPLY) * 100}
        kdxTeamPercentage={5}
        kdxDaoTreasuryPercentage={(analyticsData?.daoTreasury?.amount / KDX_TOTAL_SUPPLY) * 100}
      />
    </FlexContainer>
  );
};

export default Kdx;
