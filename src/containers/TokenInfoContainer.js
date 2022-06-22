import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useHistory, useParams } from 'react-router-dom';
import { ArrowBack } from '../assets';
import { getDailyCandles, getTotalVolume } from '../api/kaddex-stats';
import TokenPriceChart from '../components/charts/TokenPriceChart';
import AnalyticsSimpleWidget from '../components/shared/AnalyticsSimpleWidget';
import { CryptoContainer, FlexContainer } from '../components/shared/FlexContainer';
import GraphicPercetage from '../components/shared/GraphicPercetage';
import Label from '../components/shared/Label';
import tokenData from '../constants/cryptoCurrencies';
import { usePactContext } from '../contexts';
import theme from '../styles/theme';
import { getDecimalPlaces, humanReadableNumber } from '../utils/reduceBalance';

const initialMonthlyRange = {
  initial: 0,
  final: 0,
};

const TokenInfoContainer = () => {
  const history = useHistory();
  const { token } = useParams();
  const pact = usePactContext();

  const [monthlyRange, setMonthlyRange] = useState(initialMonthlyRange);
  const [monthlyVolumeRange, setMonthlyVolumeRange] = useState(initialMonthlyRange);

  useEffect(() => {
    getDailyCandles(tokenData[token]?.code, 'coin', moment().subtract(30, 'days').toDate()).then((res) => {
      if (res?.data) {
        const initial = res?.data[0]?.usdPrice?.close || 0;
        const final = res?.data[res?.data?.length - 1]?.usdPrice?.close || 0;
        setMonthlyRange({
          initial,
          final,
        });
      }
    });
    getTotalVolume(moment().subtract(1, 'months').toDate(), new Date(), tokenData[token]?.code).then((lastMonthVolume) => {
      if (lastMonthVolume) {
        getTotalVolume(moment().subtract(2, 'months').toDate(), moment().subtract(1, 'months').toDate(), tokenData[token]?.code).then(
          (pastLastMonthVolume) => {
            if (pastLastMonthVolume) {
              setMonthlyVolumeRange({
                initial: pastLastMonthVolume,
                final: lastMonthVolume,
              });
            }
          }
        );
      }
    });
  }, []);

  return (
    <FlexContainer
      className="column w-100"
      gap={24}
      style={{ paddingTop: 35, paddingBottom: 35 }}
      desktopStyle={{ paddingRight: theme.layout.desktopPadding, paddingLeft: theme.layout.desktopPadding }}
      tabletStyle={{ paddingRight: theme.layout.tabletPadding, paddingLeft: theme.layout.tabletPadding }}
      mobileStyle={{ paddingRight: theme.layout.mobilePadding, paddingLeft: theme.layout.mobilePadding }}
    >
      <FlexContainer className="w-100 align-ce">
        <ArrowBack
          className="arrow-back svg-app-color"
          style={{
            cursor: 'pointer',
            marginRight: '16px',
            justifyContent: 'center',
          }}
          onClick={() => history.goBack()}
        />
        <CryptoContainer style={{ marginRight: 8 }}>{tokenData[token].icon}</CryptoContainer>
        <Label fontSize={24} fontFamily="syncopate">
          {token}
        </Label>
      </FlexContainer>
      <FlexContainer gap={16} className="w-100 justify-sb" tabletClassName="column" mobileClassName="column">
        <AnalyticsSimpleWidget
          title={'Price'}
          mainText={
            <div className="flex align-ce" style={{ marginBottom: 10 }}>
              {`$ ${pact?.tokensUsdPrice?.[token] || '-'}`}
              <GraphicPercetage prevValue={50} currentValue={99} componentStyle={{ marginLeft: 10, marginTop: 0 }} />
            </div>
          }
          subtitle={
            /*pact?.tokensUsdPrice?.[token] &&*/ `1 KDX = ${getDecimalPlaces(pact?.tokensUsdPrice?.KDX / pact?.tokensUsdPrice?.[token])} ${token}`
          }
        />
        <AnalyticsSimpleWidget
          title="1m Trading Volume"
          mainText={`$ ${humanReadableNumber(monthlyVolumeRange?.final * monthlyRange?.final)}`}
          subtitle={
            monthlyVolumeRange?.initial && <GraphicPercetage prevValue={monthlyVolumeRange?.initial} currentValue={monthlyVolumeRange?.final} />
          }
        />
        <AnalyticsSimpleWidget
          title="1m Price Delta"
          mainText={`$ ${humanReadableNumber(monthlyRange?.final - monthlyRange?.initial)}`}
          subtitle={<GraphicPercetage prevValue={monthlyRange?.initial} currentValue={monthlyRange?.final} />}
        />
      </FlexContainer>
      <TokenPriceChart tokenData={tokenData[token]} height={300} />
    </FlexContainer>
    // <div>
    //   <CustomButton onClick={() => history.goBack()}>Token Info</CustomButton>
    // </div>
  );
};

export default TokenInfoContainer;
