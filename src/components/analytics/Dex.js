import React, { useState } from 'react';
import { CHART_OPTIONS, DAILY_VOLUME_RANGE } from '../../constants/chartOptionsConstants';
import { humanReadableNumber } from '../../utils/reduceBalance';
import TVLChart from '../charts/TVLChart';
import VolumeChart from '../charts/VolumeChart';
import AnalyticsSimpleWidget from '../shared/AnalyticsSimpleWidget';
import CustomDropdown from '../shared/CustomDropdown';
import { FlexContainer } from '../shared/FlexContainer';
import GraphicPercetage from '../shared/GraphicPercetage';
import ProgressBar from '../shared/ProgressBar';
import StackedBarChart from '../shared/StackedBarChart';

const KDX_TOTAL_SUPPLY = 1000000000;

const Dex = ({ kdaPrice }) => {
  const [stakeDataRange, setStakeDataRange] = useState(DAILY_VOLUME_RANGE.value);

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
        <StackedBarChart />
      </FlexContainer>
    </FlexContainer>
  );
};

export default Dex;
