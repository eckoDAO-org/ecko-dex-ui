/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Label from '../shared/Label';
import CommonWrapper from './CommonWrapper';
import { getPairList } from '../../api/pact';
import { getDailyVolume } from '../../api/kaddex-stats';
import { getAllPairValues, getStakingApr, getDailyUSDRewards } from '../../utils/token-utils';
import { extractDecimal, humanReadableNumber, reduceBalance } from '../../utils/reduceBalance';
import { usePactContext } from '../../contexts';
import AnalyticsInfo from './AnalyticsInfo';
import styled from 'styled-components';

const SubLabel = styled(Label)`
  font-size: 16px;
  margin-top: 4px;
  opacity: 0.7;
`;

const Analytics = ({ staked, stakedShare, totalStaked, totalBurnt }) => {
  const [totalVolumeUSD, setTotalVolumeUSD] = useState(null);
  const [stakingAPR, setStakingAPR] = useState(null);
  const { tokensUsdPrice } = usePactContext();
  useEffect(() => {
    getPairList()
      .then(async (pools) => {
        const volumes = await getDailyVolume();
        const allPairValues = await getAllPairValues(pools, volumes);
        console.log('LOG --> allPairValues', allPairValues);
        let totalUsd = 0;
        if (allPairValues?.length) {
          for (const pair of allPairValues) {
            totalUsd += pair.volume24HUsd;
          }
          setTotalVolumeUSD(totalUsd);
        }
      })
      .catch((err) => console.log('error fetching pair list', err));
  }, []);

  const dailyUSDIncome = totalVolumeUSD && (getDailyUSDRewards(totalVolumeUSD) * stakedShare) / 100;

  useEffect(() => {
    if (totalVolumeUSD && tokensUsdPrice?.KDX && totalStaked) {
      setStakingAPR(getStakingApr(totalVolumeUSD, tokensUsdPrice?.KDX * extractDecimal(totalStaked)));
    }
  }, [totalVolumeUSD, totalStaked, tokensUsdPrice?.KDX]);

  return (
    <CommonWrapper title="analytics" gap={24} popup={<AnalyticsInfo />} popupTitle="Analytics">
      <div className="flex justify-sb">
        <div>
          <div className="flex align-ce">
            <Label>Daily Income</Label>
          </div>
          <Label fontSize={24}>
            {(dailyUSDIncome && tokensUsdPrice?.KDX && humanReadableNumber(dailyUSDIncome / tokensUsdPrice?.KDX)) || '-'} KDX
          </Label>
          <SubLabel>$ {(dailyUSDIncome && humanReadableNumber(dailyUSDIncome)) || '-'}</SubLabel>
        </div>
        <div>
          <div className="flex column align-fe">
            <Label>APR</Label>
          </div>
          <Label fontSize={24}>{(stakingAPR && stakingAPR.toFixed(2)) || '-'}%</Label>
        </div>
      </div>
      <div>
        <Label>Daily Volume</Label>
        <Label fontSize={24}>$ {humanReadableNumber(totalVolumeUSD)}</Label>
      </div>
      <div>
        <Label>KDX Burned</Label>
        <Label fontSize={24}>{(totalBurnt && humanReadableNumber(reduceBalance(totalBurnt))) || '-'} KDX</Label>
        <SubLabel>{(totalStaked && totalBurnt && (reduceBalance(totalBurnt) * 100) / reduceBalance(totalStaked))?.toFixed(2) || '-'} %</SubLabel>
      </div>
      <div className="flex  justify-sb">
        <div>
          <div className="flex align-ce">
            <Label>Staked Share</Label>
          </div>
          <Label fontSize={24}>{(stakedShare && extractDecimal(stakedShare).toFixed(2)) || '-'}% </Label>
          <SubLabel labelStyle={{ fontSize: 12 }}>{staked} KDX</SubLabel>
        </div>
        <div className="flex column align-fe">
          <Label>Total Staked</Label>
          <Label fontSize={24}>38.20 %{/* {(totalStaked && humanReadableNumber(reduceBalance(totalStaked))) || '-'} KDX */}</Label>
          <SubLabel labelStyle={{ fontSize: 12, textAlign: 'end' }}>{extractDecimal(totalStaked).toFixed(2)} KDX</SubLabel>
        </div>
      </div>
    </CommonWrapper>
  );
};

export default Analytics;
