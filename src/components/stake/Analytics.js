import React, { useEffect, useState } from 'react';
import Label from '../shared/Label';
import CommonWrapper from './CommonWrapper';
import { getPairList } from '../../api/pact';
import { getDailyVolume } from '../../api/kaddex-stats';
import { getAllPairValues, getStakingApr } from '../../utils/token-utils';
import { extractDecimal, humanReadableNumber, reduceBalance } from '../../utils/reduceBalance';
import { usePactContext } from '../../contexts';
import AnalyticsInfo from './AnalyticsInfo';

const Analytics = ({ stakedShare, totalStaked }) => {
  const [totalVolumeUSD, setTotalVolumeUSD] = useState(null);
  const [stakingAPR, setStakingAPR] = useState(null);
  const { kdxPrice } = usePactContext();
  useEffect(() => {
    getPairList()
      .then(async (pools) => {
        const volumes = await getDailyVolume();
        const allPairValues = await getAllPairValues(pools, volumes);
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

  useEffect(() => {
    if (totalVolumeUSD && kdxPrice && totalStaked) {
      setStakingAPR(getStakingApr(totalVolumeUSD, kdxPrice * totalStaked));
    }
  }, [totalVolumeUSD, totalStaked, kdxPrice]);

  return (
    <CommonWrapper title="analytics" gap={24} popup={<AnalyticsInfo />} popupTitle="Analytics">
      <div>
        <div className="flex align-ce">
          <Label>APR</Label>
        </div>
        <Label fontSize={32}>{(stakingAPR && stakingAPR.toFixed(2)) || '-'}%</Label>
      </div>
      <div>
        <Label>Volume</Label>
        <Label fontSize={24}>{humanReadableNumber(totalVolumeUSD)} $</Label>
      </div>
      <div>
        <div className="flex align-ce">
          <Label>Staked Share</Label>
        </div>
        <Label fontSize={24}>{(stakedShare && extractDecimal(stakedShare).toFixed(2)) || '-'}% </Label>
      </div>
      <div>
        <Label>Total Staked</Label>
        <Label fontSize={24}>{(totalStaked && humanReadableNumber(reduceBalance(totalStaked))) || '-'} KDX</Label>
      </div>
    </CommonWrapper>
  );
};

export default Analytics;
