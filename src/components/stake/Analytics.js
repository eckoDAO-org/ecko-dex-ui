import React, { useEffect, useState } from 'react';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';
import CommonWrapper from './CommonWrapper';
import { getPairList } from '../../api/pact';
import { getDailyVolume } from '../../api/kaddex-stats';
import { getAllPairValues, getStakingApr } from '../../utils/token-utils';
import { humanReadableNumber, reduceBalance } from '../../utils/reduceBalance';
import { usePactContext } from '../../contexts';

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
    <CommonWrapper title="analytics" gap={24}>
      <div>
        <div className="flex align-ce">
          <Label>APR</Label>
          <InfoPopup>
            Annual Percentage Rate. It shows the estimated yearly interest generated by your tokens in the respective liquidity pool.
          </InfoPopup>
        </div>
        <Label fontSize={32}>{(stakingAPR && stakingAPR.toFixed(2)) || '-'}%</Label>
      </div>
      <div>
        <Label>Volume</Label>
        <Label fontSize={32}>{totalVolumeUSD ? humanReadableNumber(totalVolumeUSD) : '-'} USD</Label>
      </div>
      <div>
        <div className="flex align-ce">
          <Label>Staked Share</Label>
          <InfoPopup>Your personal percentage share of KDX amongst all the KDX currently being staked.</InfoPopup>
        </div>
        <Label fontSize={32}>{stakedShare && stakedShare.toFixed(2)}%</Label>
      </div>
      <div>
        <Label>Total Staked</Label>
        <Label fontSize={32}>{(totalStaked && reduceBalance(totalStaked, 2)) || '-'} KDX</Label>
      </div>
    </CommonWrapper>
  );
};

export default Analytics;
