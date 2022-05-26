import React from 'react';
import { Label } from 'recharts';
import { usePactContext } from '../../contexts';
import useWindowSize from '../../hooks/useWindowSize';
import theme from '../../styles/theme';
import { humanReadableNumber } from '../../utils/reduceBalance';
import VestingPieChart from '../charts/VestingPieChart';

import VestingScheduleChart from '../charts/VestingScheduleChart';
import AnalyticsSimpleWidget from '../shared/AnalyticsSimpleWidget';
import { FlexContainer } from '../shared/FlexContainer';
import InfoPopup from '../shared/InfoPopup';
import ProgressBar from '../shared/ProgressBar';

const Kdx = ({ KDX_TOTAL_SUPPLY, kdxSupply, kdaPrice, kdxBurnt }) => {
  const [width] = useWindowSize();
  const pact = usePactContext();

  const getColumns = () => {
    if (width <= theme.mediaQueries.mobilePixel) {
      return 1;
    } else return width <= theme.mediaQueries.desktopPixel ? 2 : 3;
  };
  return (
    <FlexContainer className="column" gap={16}>
      <FlexContainer className="grid" columns={getColumns()} gridColumnGap={16}>
        <AnalyticsSimpleWidget
          title={'KDX price'}
          mainText={`$ ${pact?.tokensUsdPrice?.KDX || '-'}`}
          subtitle={pact?.tokensUsdPrice?.KDX && `${(pact?.tokensUsdPrice?.KDX / kdaPrice).toFixed(4)} KDA`}
        />
        <AnalyticsSimpleWidget
          title={
            <>
              Marketcap{' '}
              <InfoPopup size={16} type="modal" title="Analytics data info">
                <Label>
                  The information displayed on this page is currently under BETA testing, and is provided on an "as is" and "as available" basis
                </Label>
              </InfoPopup>
            </>
          }
          mainText={(kdxSupply && `$ ${humanReadableNumber(Number(kdxSupply * pact?.tokensUsdPrice?.KDX))}`) || '-'}
          subtitle={null}
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
          title={'KDX Burned'}
          mainText={(kdxBurnt && `${humanReadableNumber(kdxBurnt, 2)} KDX`) || '-'}
          subtitle={`${((100 * kdxBurnt) / KDX_TOTAL_SUPPLY).toFixed(2)} %`}
        />

        <AnalyticsSimpleWidget
          title={'KDX Treasury'}
          mainText={`${humanReadableNumber(KDX_TOTAL_SUPPLY * 0.25, 2)} KDX` || '-'}
          subtitle={`${(25).toFixed(2)} %`}
        />
        <AnalyticsSimpleWidget
          title={'KDX Rewards'}
          mainText={`${humanReadableNumber(KDX_TOTAL_SUPPLY * 0.4, 2)} KDX` || '-'}
          subtitle={`${(40).toFixed(2)} %`}
        />
      </FlexContainer>
      <VestingScheduleChart height={300} />
      <VestingPieChart kdxSupply={kdxSupply} KDX_TOTAL_SUPPLY={KDX_TOTAL_SUPPLY} />
    </FlexContainer>
  );
};

export default Kdx;
