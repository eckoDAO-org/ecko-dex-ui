/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { getDailyVolume } from '../../api/kaddex-stats';
import { getPairList } from '../../api/pact';
import { chartTimeRanges, CHART_OPTIONS, DAILY_VOLUME_RANGE } from '../../constants/chartOptionsConstants';
import tokenData, { pairsData } from '../../constants/cryptoCurrencies';
import { usePactContext } from '../../contexts';
import { humanReadableNumber } from '../../utils/reduceBalance';
import { get24HVolumeSingleSided } from '../../utils/token-utils';
import TVLChart from '../charts/TVLChart';
import VolumeChart from '../charts/VolumeChart';
import AnalyticsSimpleWidget from '../shared/AnalyticsSimpleWidget';
import CustomDropdown from '../shared/CustomDropdown';
import { FlexContainer } from '../shared/FlexContainer';
import GraphicPercentage from '../shared/GraphicPercentage';
import ProgressBar from '../shared/ProgressBar';
import StackedBarChart from '../shared/StackedBarChart';
import pairTokens from '../../constants/pairsConfig';
import AppLoader from '../shared/AppLoader';
import { NETWORK_TYPE } from '../../constants/contextConstants';

const KDX_TOTAL_SUPPLY = 1000000000;

const Dex = ({ kdaPrice }) => {
  const [stakeDataRange, setStakeDataRange] = useState(DAILY_VOLUME_RANGE.value);
  const [volumeRange, setVolumeRange] = useState(DAILY_VOLUME_RANGE.value);

  const [loading, setLoading] = useState(true);
  const [tokensVolumes, setTokensVolumes] = useState([]);
  const [pairsVolume, setPairsVolume] = useState([]);

  const fakeTokensVolume = [
    {
      ...tokenData['KDA'],
      percentage: 50,
      precision: 12,
      tokenNameKaddexStats: 'coin',
      tokenUsdPrice: 2.05,
      volume24H: 28192.62209297493,
      volumeUsd: 86692.31293589789,
    },
    {
      ...tokenData['KDX'],
      percentage: 25,
      precision: 12,
      tokenNameKaddexStats: 'kdx',
      tokenUsdPrice: 2.05,
      volume24H: 28192.62209297493,
      volumeUsd: 86692.31293589789,
    },
    {
      ...tokenData['ABC'],
      percentage: 25,
      precision: 12,
      tokenNameKaddexStats: 'abc',
      tokenUsdPrice: 2.05,
      volume24H: 28192.62209297493,
      volumeUsd: 86692.31293589789,
    },
  ];

  const fakePairsVolume = [
    {
      chain: 2,
      color: '#5dcbe5',
      day: '2022-06-05T00:00:00.066Z',
      dayString: '2022-06-05',
      name: 'KDA/KDX',
      percentage: 60,
      tokenFrom: 'coin',
      tokenFromTVL: 51166.03235845142,
      tokenTo: 'kaddex.kdx',
      tokenToTVL: 128334.41023473465,
      volumeUsd: 0,
      __v: 0,
      _id: '629d51b0a6e1e6629b5fe88a',
    },
    {
      chain: 2,
      color: '#ed1cb5',
      day: '2022-06-05T00:00:00.066Z',
      dayString: '2022-06-05',
      name: 'KDA/ABC',
      percentage: 20,
      tokenFrom: 'coin',
      tokenFromTVL: 51166.03235845142,
      tokenTo: 'kaddex.abc',
      tokenToTVL: 128334.41023473465,
      volumeUsd: 0,
      __v: 0,
      _id: '629d51b0a6e1e6629b5fe88a',
    },
    {
      chain: 2,
      day: '2022-06-05T00:00:00.066Z',
      dayString: '2022-06-05',
      name: 'OTHER',
      percentage: 20,
      tokenFrom: 'coin',
      tokenFromTVL: 51166.03235845142,
      tokenTo: 'kaddex.xyz',
      tokenToTVL: 128334.41023473465,
      volumeUsd: 0,
      __v: 0,
      _id: '629d51b0a6e1e6629b5fe88a',
    },
  ];

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
        let volumeUsd = 0;
        let volume24H = 0;
        for (let i = 0; i < tokenPairs.length; i++) {
          volume24H += get24HVolumeSingleSided(volumes, token.tokenNameKaddexStats);
          volumeUsd += volume24H * tokenUsdPrice;
        }
        result.push({ ...token, volumeUsd, volume24H, tokenUsdPrice });
      }
      const totalVolume = result.reduce((acc, t) => acc + t.volumeUsd, 0);

      const mainTokens = result.filter((t) => t.main).map((token) => ({ ...token, percentage: (token.volumeUsd / totalVolume) * 100 }));
      const otherTokensVolume = result.filter((t) => !t.main).reduce((acc, t) => acc + t.volumeUsd, 0);
      const otherTokens = {
        name: 'OTHER',
        volumeUsd: otherTokensVolume,
        percentage: (otherTokensVolume / totalVolume) * 100,
      };

      setTokensVolumes(otherTokensVolume.length > 0 ? [...mainTokens, otherTokens] : [...mainTokens]);
    }
    setLoading(false);
  };

  const getPairsVolume = async () => {
    axios
      .get(
        `${process.env.REACT_APP_KADDEX_STATS_API_URL}/tvl/daily?dateStart=${chartTimeRanges[volumeRange].dateStartTvl}&dateEnd=${moment()
          .subtract(1, 'day')
          .format('YYYY-MM-DD')}`
      )
      .then(async (res) => {
        console.log('res -->', res.data);
        const lastTvl = res.data[0];
        const allTVL = [];

        const mainsTVL = lastTvl.tvl.filter((t) => {
          const name0 = `${t.tokenTo}:${t.tokenFrom}`;
          const name1 = `${t.tokenFrom}:${t.tokenTo}`;

          return (pairTokens[name0] && pairTokens[name0].main) || (pairTokens[name1] && pairTokens[name1].main);
        });
        const otherTVL = lastTvl.tvl.filter((t) => {
          const name0 = `${t.tokenTo}:${t.tokenFrom}`;
          const name1 = `${t.tokenFrom}:${t.tokenTo}`;
          return (pairTokens[name0] && !pairTokens[name0].main) || (pairTokens[name1] && !pairTokens[name1].main);
        });

        const otherTvlTotalSum = otherTVL.reduce((partialSum, currVol) => {
          if (currVol.tokenFrom === 'coin') {
            const tokenToPrice = (currVol.tokenFromTVL / currVol.tokenToTVL) * kdaPrice;
            return partialSum + currVol.tokenFromTVL * kdaPrice + currVol.tokenToTVL * tokenToPrice;
          } else {
            const tokenFromPrice = (currVol.tokenToTVL / currVol.tokenFromTVL) * kdaPrice;
            return partialSum + currVol.tokenFromTVL * tokenFromPrice + currVol.tokenToTVL * kdaPrice;
          }
        }, 0);

        let totalTvl = otherTvlTotalSum;

        for (const mainTVL of mainsTVL) {
          let sum = 0;
          const name0 = `${mainTVL.tokenTo}:${mainTVL.tokenFrom}`;
          const name1 = `${mainTVL.tokenFrom}:${mainTVL.tokenTo}`;
          const pair = Object.values(pairsData).find((p) => p.name === name0 || p.name === name1);
          if (mainTVL.tokenFrom === 'coin') {
            const tokenToPrice = (mainTVL.tokenFromTVL / mainTVL.tokenToTVL) * kdaPrice;
            sum = mainTVL.tokenFromTVL * kdaPrice + mainTVL.tokenToTVL * tokenToPrice;
          } else {
            const tokenFromPrice = (mainTVL.tokenToTVL / mainTVL.tokenFromTVL) * kdaPrice;
            sum = mainTVL.tokenFromTVL * tokenFromPrice + mainTVL.tokenToTVL * kdaPrice;
          }
          totalTvl += sum;
          allTVL.push({
            ...mainTVL,
            volumeUsd: sum,
            name: `${pair.token0}/${pair.token1}`,
            color: pair.color,
          });
        }
        if (otherTvlTotalSum > 0)
          allTVL.push({
            name: 'OTHER',
            volumeUsd: otherTvlTotalSum,
          });

        for (const tvl of allTVL) {
          tvl.percentage = (tvl.volumeUsd / totalTvl) * 100;
        }
        setPairsVolume(allTVL);
        setLoading(false);
      })
      .catch((err) => {
        console.error('get tvl error', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (tokensUsdPrice) {
      getTokensVolume();
      getPairsVolume();
    }
  }, [tokensUsdPrice, volumeRange]);

  const fakeData = {
    totalStaked: 150002300.75,
  };

  return loading ? (
    <AppLoader containerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} />
  ) : (
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
            <GraphicPercentage prevValue={80} currentValue={100} />
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
        <StackedBarChart title="TVL Details" data={NETWORK_TYPE === 'mainnet' ? tokensVolumes : fakeTokensVolume} />
      </FlexContainer>
      <FlexContainer>
        <StackedBarChart
          title="Volume Details"
          data={NETWORK_TYPE === 'mainnet' ? pairsVolume : fakePairsVolume}
          withDoubleToken
          rightComponent={
            <CustomDropdown
              options={CHART_OPTIONS}
              dropdownStyle={{ minWidth: '66px', padding: 10, height: 30 }}
              onChange={(e, { value }) => {
                setVolumeRange(value);
              }}
              value={volumeRange}
            />
          }
        />
      </FlexContainer>
    </FlexContainer>
  );
};

export default Dex;
