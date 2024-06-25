import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { BoosterIcon, BurnedIcon, DaoIcon } from '../../assets';
import { usePactContext } from '../../contexts';
import useWindowSize from '../../hooks/useWindowSize';
import theme, { commonColors } from '../../styles/theme';
import { extractDecimal, getDecimalPlaces, humanReadableNumber } from '../../utils/reduceBalance';
import { getDailyCandles } from '../../api/kaddex-stats';
import VestingPieChart from '../charts/VestingPieChart';
import AnalyticsSimpleWidget from '../shared/AnalyticsSimpleWidget';
import { FlexContainer } from '../shared/FlexContainer';
import GraphicPercentage from '../shared/GraphicPercentage';
import ProgressBar from '../shared/ProgressBar';
import KdxDaoTreasuryDetails from './analytics-details/KdxDaoTreasuryDetails';
import KdxCirculatingSupplyDetails from './analytics-details/KdxCirculatingSupplyDetails';

const KDX_MINING_REWARDS_CAP = 400000000;
const KDX_DAO_TREASURY_CAP = 250000000;

const Kdx = ({ KDX_TOTAL_SUPPLY, kdaPrice, analyticsData }) => {
  const [width] = useWindowSize();
  const pact = usePactContext();
  const kdxPrice = pact?.tokensUsdPrice?.KDX;
  const [kdxPriceDiff, setKdxPriceDiff] = useState(null);

  const kdxToken = pact.allTokens.KDX ?? null;
  const asset = (kdxToken.statsID || kdxToken.code) === 'coin' ? 'KDA' : kdxToken.statsID || kdxToken.code;
  const currency = (kdxToken.statsID || kdxToken.code) === 'coin' ? 'USDT' : 'coin';

  useEffect(() => {
    const initData = async () => {
      if (kdxToken && asset && currency) {
        const result = await getDailyCandles(asset, currency, moment().subtract(1, 'days').toDate(), new Date());
        if (result?.data?.length) {
          const initial = result.data[0]?.usdPrice?.close;
          const final = result.data[1]?.usdPrice?.close;
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
    <FlexContainer className="column" gap={16} style={{ paddingBottom: 32 }}>
      <FlexContainer className="grid" columns={getColumns()} gridColumnGap={16}>
        <AnalyticsSimpleWidget
          title={'Price'}
          mainText={
            <FlexContainer className="flex align-fs column">
              {`$ ${kdxPrice ? humanReadableNumber(kdxPrice, 3) : '-'}`}

              <div style={{ fontSize: 13 }}>{kdxPrice && `${getDecimalPlaces(extractDecimal(kdxPrice / kdaPrice))} KDA`}</div>
            </FlexContainer>
          }
          subtitle={<GraphicPercentage prevValue={kdxPriceDiff?.initial} currentValue={kdxPriceDiff?.final} />}
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
      {/* <VestingScheduleChart height={300} /> */}
      <VestingPieChart
        kdxSupplyPercentage={(analyticsData?.circulatingSupply?.totalSupply / KDX_TOTAL_SUPPLY) * 100}
        kdxBurntPercentage={((analyticsData?.burn?.stakingBurn + analyticsData?.burn?.tokenBurn) / KDX_TOTAL_SUPPLY) * 100}
        kdxLiquidityMiningPercentage={(analyticsData?.liquidityMining / KDX_TOTAL_SUPPLY) * 100}
        kdxCommunitySalePercentage={20.2}
        kdxTeamPercentage={0}
        kdxDaoTreasuryPercentage={(analyticsData?.daoTreasury?.amount / KDX_TOTAL_SUPPLY) * 100}
      />
    </FlexContainer>
  );
};

export default Kdx;
