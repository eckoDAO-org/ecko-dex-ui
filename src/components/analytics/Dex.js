import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { getDailyVolume } from '../../api/kaddex-stats';
import { getPairList } from '../../api/pact';
import { CHART_OPTIONS, DAILY_VOLUME_RANGE } from '../../constants/chartOptionsConstants';
import tokenData from '../../constants/cryptoCurrencies';
import { usePactContext } from '../../contexts';
import { humanReadableNumber } from '../../utils/reduceBalance';
import { get24HVolumeSingleSided } from '../../utils/token-utils';
import TVLChart from '../charts/TVLChart';
import VolumeChart from '../charts/VolumeChart';
import AnalyticsSimpleWidget from '../shared/AnalyticsSimpleWidget';
import CustomDropdown from '../shared/CustomDropdown';
import { FlexContainer } from '../shared/FlexContainer';
import GraphicPercetage from '../shared/GraphicPercetage';
import ProgressBar from '../shared/ProgressBar';
import StackedBarChart from '../shared/StackedBarChart';
import pairTokens from '../../constants/pairsConfig';

const KDX_TOTAL_SUPPLY = 1000000000;

const Dex = ({ kdaPrice }) => {
  const [stakeDataRange, setStakeDataRange] = useState(DAILY_VOLUME_RANGE.value);
  const [loading, setLoading] = useState(true);
  const [tokensVolumes, setTokensVolumes] = useState([]);
  const [tokensTvl, setTokensTvl] = useState([]);
  console.log('LOG --> tokens', tokensVolumes);

  const { tokensUsdPrice } = usePactContext();

  const getTokensVolume = async () => {
    const pairsList = await getPairList();
    if (pairsList?.length) {
      const volumes = await getDailyVolume();

      const tokens = Object.values(tokenData);

      const result = [];

      // calculate sum of liquidity in usd and volumes in usd for each token in each pair
      for (const token of tokens) {
        const tokenPairs = pairsList.filter((p) => p.token0 === token.name || p.token1 === token.name);
        const tokenUsdPrice = tokensUsdPrice?.[token.name];
        let volume24HUsd = 0;
        let volume24H = 0;
        for (let i = 0; i < tokenPairs.length; i++) {
          volume24H += get24HVolumeSingleSided(volumes, token.tokenNameKaddexStats);
          volume24HUsd += volume24H * tokenUsdPrice;
        }
        result.push({ ...token, volume24HUsd, volume24H, tokenUsdPrice });
      }
      const totalVolume = result.reduce((acc, t) => acc + t.volume24HUsd, 0);

      const mainTokens = result.filter((t) => t.main).map((token) => ({ ...token, volume24HPercentage: (token.volume24HUsd / totalVolume) * 100 }));
      const otherTokensVolume = result.filter((t) => !t.main).reduce((acc, t) => acc + t.volume24HUsd, 0);
      const otherTokens = {
        name: 'OTHER',
        volume24HUsd: otherTokensVolume,
        volume24HPercentage: (otherTokensVolume / totalVolume) * 100,
      };
      setTokensVolumes([...mainTokens, otherTokens]);
    }
    setLoading(false);
  };

  // useEffect(() => {

  // }, [kdaPrice, tvlRange]);

  // work in progress
  const getTokensTvl = async () => {
    axios
      .get(
        `${process.env.REACT_APP_KADDEX_STATS_API_URL}/tvl/daily?dateStart=${moment().subtract(4, 'day').format('YYYY-MM-DD')}&dateEnd=${moment()
          .subtract(1, 'day')
          .format('YYYY-MM-DD')}`
      )
      .then(async (res) => {
        const lastTvl = res.data.slice(-1)[0];
        const allTVL = [];
        const mainTVL = lastTvl.tvl.filter((t) => {
          const name0 = `${t.tokenTo}:${t.tokenFrom}`;
          const name1 = `${t.tokenFrom}:${t.tokenTo}`;

          return (pairTokens[name0] && pairTokens[name0].main) || (pairTokens[name1] && pairTokens[name1].main);
        });
        const otherTVL = lastTvl.tvl.filter((t) => {
          const name0 = `${t.tokenTo}:${t.tokenFrom}`;
          const name1 = `${t.tokenFrom}:${t.tokenTo}`;
          return (pairTokens[name0] && !pairTokens[name0].main) || (pairTokens[name1] && !pairTokens[name1].main);
        });
        console.log('mainTVL', mainTVL);
        console.log('otherTVL', otherTVL);
        for (const day of res.data) {
          allTVL.push({
            name: moment(day._id).format('DD/MM/YYYY'),
            tvl: +day.tvl
              .reduce((partialSum, currVol) => {
                if (currVol.tokenFrom === 'coin') {
                  const tokenToPrice = (currVol.tokenFromTVL / currVol.tokenToTVL) * kdaPrice;
                  return partialSum + currVol.tokenFromTVL * kdaPrice + currVol.tokenToTVL * tokenToPrice;
                } else {
                  const tokenFromPrice = (currVol.tokenToTVL / currVol.tokenFromTVL) * kdaPrice;
                  return partialSum + currVol.tokenFromTVL * tokenFromPrice + currVol.tokenToTVL * kdaPrice;
                }
              }, 0)
              .toFixed(2),
          });
        }
        // setTVLData(allTVL);
      })
      .catch((err) => console.log('get tvl error', err));
  };

  useEffect(() => {
    console.log('pair', pairTokens);
    if (tokensUsdPrice) {
      getTokensVolume();
      getTokensTvl();
    }
  }, [tokensUsdPrice]);

  const fakeData = {
    totalStaked: 150002300.75,
  };

  return (
    <FlexContainer className="w-100 column" mobileClassName="column" gap={24}>
      <FlexContainer className="w-100" mobileClassName="column" gap={24}>
        <TVLChart kdaPrice={kdaPrice} height={300} />

        <VolumeChart kdaPrice={kdaPrice} height={300} />
      </FlexContainer>
      <FlexContainer mobileClassName="column" gap={24}>
        {/* MISSING REAL FORMULA */}
        <AnalyticsSimpleWidget
          title={'KDX Staked'}
          mainText={(fakeData && `${humanReadableNumber(fakeData.totalStaked, 2)} KDX`) || '-'}
          subtitle={`${((100 * fakeData.totalStaked) / KDX_TOTAL_SUPPLY).toFixed(1)} %`}
        />
        {/* MISSING REAL FORMULA */}
        <AnalyticsSimpleWidget
          title={'Staking Data'}
          mainText={
            <GraphicPercetage prevValue={80} currentValue={100} />
            // (fakeData && `${humanReadableNumber(fakeData.totalStaked, 2)} KDX`) || '-'
          }
          subtitle={
            <div className="w-100 flex" style={{ paddingTop: 10 }}>
              <ProgressBar maxValue={KDX_TOTAL_SUPPLY} currentValue={fakeData.totalStaked} containerStyle={{ paddingTop: 2, width: '100%' }} />
              <span style={{ marginLeft: 20, whiteSpace: 'nowrap' }}>{((100 * fakeData.totalStaked) / KDX_TOTAL_SUPPLY).toFixed(1)} %</span>
            </div>
          }
          rightComponent={
            <CustomDropdown
              options={CHART_OPTIONS}
              dropdownStyle={{ minWidth: '66px', padding: 10, height: 30 }}
              onChange={(e, { value }) => {
                setStakeDataRange(value);
              }}
              value={stakeDataRange}
            />
          }
        />
      </FlexContainer>
      <FlexContainer>
        <StackedBarChart title="Tvl Details" data={tokensTvl} />
      </FlexContainer>
      <FlexContainer>
        <StackedBarChart title="Volume Details" data={tokensVolumes} withDropdown />
      </FlexContainer>
    </FlexContainer>
  );
};

export default Dex;
