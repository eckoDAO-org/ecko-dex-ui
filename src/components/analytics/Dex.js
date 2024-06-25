/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { getPairList } from '../../api/pact';
import { chartTimeRanges, CHART_OPTIONS, DAILY_VOLUME_RANGE } from '../../constants/chartOptionsConstants';
import { usePactContext } from '../../contexts';
import { humanReadableNumber, extractDecimal, reduceBalance } from '../../utils/reduceBalance';
import TVLChart from '../charts/TVLChart';
import VolumeChart from '../charts/VolumeChart';
import AnalyticsSimpleWidget from '../shared/AnalyticsSimpleWidget';
import CustomDropdown from '../shared/CustomDropdown';
import { FlexContainer } from '../shared/FlexContainer';
import ProgressBar from '../shared/ProgressBar';
import StackedBarChart from '../shared/StackedBarChart';
import AppLoader from '../shared/AppLoader';
import { isMainnet } from '../../constants/contextConstants';
import { samplePairsVolume, sampleTokensVolume } from './devnetSampleVolumes';
import Label from '../shared/Label';
import { SKDXIcon } from '../../assets';

/* const KDX_TOTAL_SUPPLY = 1000000000; */

const Dex = ({ kdaPrice, kdxSupply, poolState }) => {
  const { tokensUsdPrice, allPairs } = usePactContext();
  const [volumeRange, setVolumeRange] = useState(DAILY_VOLUME_RANGE.value);

  const [loading, setLoading] = useState(true);
  const [localPairList, setLocalPairList] = useState([]);
  const [tvlDetails, setTVLDetails] = useState([]);
  const [pairsVolume, setPairsVolume] = useState([]);

  const stakedKdx = extractDecimal((poolState && poolState['staked-kdx']) || 0);

  useEffect(() => {
    if (allPairs) {
      getPairList(allPairs).then((pL) => {
        setLocalPairList(pL);
      });
    }
  }, [allPairs]);

  const getTVLDetails = async () => {
    if (localPairList?.length) {
      const totalKDATVL = localPairList.reduce((partialSum, curr) => {
        return partialSum + reduceBalance(curr.token0 === 'KDA' ? curr.reserves[0] : curr.reserves[1]);
      }, 0);

      const kdaPrice = tokensUsdPrice?.KDA;
      const pairData = localPairList
        .map((t) => {
          const kdaTVL = reduceBalance(t.token0 === 'KDA' ? t.reserves[0] : t.reserves[1]);
          return {
            color: t.color,
            name: `${t.token0}/${t.token1}`,
            kdaReserve: t.token0 === 'KDA' ? t.reserves[0] : t.reserves[1],
            volumeUsd: kdaPrice * reduceBalance(t.token0 === 'KDA' ? t.reserves[0] : t.reserves[1]) * 2,
            percentage: (kdaTVL * 100) / totalKDATVL,
          };
        })
        .sort((x, y) => y.percentage - x.percentage);

      const mains = pairData.splice(0, 3);

      const totalKDAOtherTVL = pairData.reduce((partialSum, curr) => partialSum + reduceBalance(curr.kdaReserve), 0);

      const otherTokens = {
        name: 'OTHER',
        volumeUsd: kdaPrice * totalKDAOtherTVL,
        percentage: (totalKDAOtherTVL * 100) / totalKDATVL,
      };

      setTVLDetails([...mains, otherTokens]);
    }
    setLoading(false);
  };

  const getPairsVolume = async () => {
    axios
      .get(
        `${process.env.REACT_APP_KADDEX_STATS_API_URL}/volume/daily?dateStart=${chartTimeRanges[volumeRange].dateStartTvl}&dateEnd=${moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD')}`
      )
      .then(async (volumeRes) => {
        const kdaPrice = tokensUsdPrice?.KDA;
        let allVolumes = [];
        const allTokenPairs = localPairList;
        const findTokenPair = (vol) =>
          allTokenPairs.find(
            (m) => m.name === `coin:${vol.tokenFromNamespace}.${vol.tokenFromName}` || m.name === `coin:${vol.tokenToNamespace}.${vol.tokenToName}`
          );

        for (const volumes of volumeRes?.data) {
          for (const volume of volumes?.volumes) {
            const pair = findTokenPair(volume);
            if (pair) {
              const alreadyAdded = allVolumes.find((mV) => mV.name === `${pair.token0}/${pair.token1}`);
              if (alreadyAdded) {
                const volumeKDA = alreadyAdded.volumeKDA + (volume.tokenFromName === 'coin' ? volume.tokenFromVolume : volume.tokenToVolume);
                allVolumes = [
                  ...allVolumes.filter((mV) => mV.name !== `${pair.token0}/${pair.token1}`),
                  {
                    color: pair.color,
                    name: `${pair.token0}/${pair.token1}`,
                    volumeKDA,
                  },
                ];
              } else {
                const volumeKDA = volume.tokenFromName === 'coin' ? volume.tokenFromVolume : volume.tokenToVolume;
                allVolumes.push({
                  color: pair.color,
                  name: `${pair.token0}/${pair.token1}`,
                  volumeKDA,
                });
              }
            }
          }
        }
        const allVolumeBarData = [...allVolumes]
          .map((volData) => ({
            ...volData,
            volumeUsd: volData.volumeKDA * kdaPrice,
            percentage: 10,
          }))
          .sort((x, y) => y.volumeUsd - x.volumeUsd);

        const topVolumesBarData = allVolumeBarData.splice(0, 3);
        const otherVolumePercentage = allVolumeBarData.reduce((acc, curr) => acc + curr.percentage, 0);
        const otherVolumeKda = allVolumeBarData.reduce((acc, curr) => acc + curr.volumeKDA, 0);
        const otherVolumeUsd = allVolumeBarData.reduce((acc, curr) => acc + curr.volumeUsd, 0);

        const otherVolumeBarData = {
          name: 'OTHER',
          volumeKDA: otherVolumeKda,
          volumeUsd: otherVolumeUsd,
          percentage: otherVolumePercentage,
        };

        const totVolumeBarData = [...topVolumesBarData, otherVolumeBarData];
        const totalVol = totVolumeBarData.reduce((partialSum, curr) => partialSum + curr.volumeUsd, 0);
        setPairsVolume(totVolumeBarData.map((v) => ({ ...v, percentage: (100 * v.volumeUsd) / totalVol })));
        setLoading(false);
      })
      .catch((err) => {
        console.error('get volume error', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (tokensUsdPrice) {
      getTVLDetails();
      getPairsVolume();
    }
  }, [tokensUsdPrice, volumeRange, localPairList]);

  return loading ? (
    <AppLoader containerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} />
  ) : (
    <FlexContainer className="w-100 column" mobileClassName="column" gap={24} style={{ paddingBottom: 32 }}>
      <FlexContainer mobileClassName="column" gap={24}>
        <TVLChart kdaPrice={kdaPrice} height={300} />

        <VolumeChart kdaPrice={kdaPrice} height={300} />
      </FlexContainer>
      <FlexContainer mobileClassName="column" gap={24}>
        <AnalyticsSimpleWidget
          title={'KDX Staked'}
          mainText={
            (
              <div>
                {humanReadableNumber(stakedKdx, 2)} KDX
                <Label fontSize={16} mobileFontSize={16} labelStyle={{ opacity: 0.7, marginBottom: 3 }}>
                  $ {humanReadableNumber(tokensUsdPrice?.KDX * extractDecimal(stakedKdx))}
                </Label>
              </div>
            ) || '-'
          }
          subtitle={
            <div className="w-100 flex column" style={{ paddingTop: 10 }}>
              <ProgressBar maxValue={kdxSupply} currentValue={stakedKdx} containerStyle={{ paddingTop: 2, width: '100%' }} />
              <div className="w-100 flex justify-sb" style={{ paddingTop: 4 }}>
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
              <div className="flex" style={{ paddingTop: 16 }}>
                <div
                  style={{
                    width: 32,
                    height: 16,
                    borderRadius: 4,
                    background: 'linear-gradient(to right, #FFD300, #FF00B8)',
                    marginRight: 8,
                  }}
                ></div>

                <SKDXIcon style={{ width: 16, height: 16, marginRight: 8 }} />

                <Label>sKDX {((100 * stakedKdx) / kdxSupply).toFixed(3)} %</Label>
              </div>
            </div>
          }
        />
      </FlexContainer>
      <FlexContainer>
        <StackedBarChart title="TVL Details" withDoubleToken data={isMainnet() ? tvlDetails : sampleTokensVolume} />
      </FlexContainer>
      <FlexContainer>
        <StackedBarChart
          title="Volume Details"
          data={isMainnet() ? pairsVolume : samplePairsVolume}
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
