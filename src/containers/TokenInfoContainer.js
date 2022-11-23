/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useHistory, useParams } from 'react-router-dom';
import { usePactContext } from '../contexts';
import { ArrowBack, DiscordIconCircle, GithubIconCircle, MediumIconCircle, TwitterIconCircle } from '../assets';
import { getDailyCandles, getTotalVolume, getUSDPriceDiff, getKDAPriceDiff } from '../api/kaddex-stats';
import TokenPriceChart from '../components/charts/TokenPriceChart';
import AnalyticsSimpleWidget from '../components/shared/AnalyticsSimpleWidget';
import { CryptoContainer, FlexContainer } from '../components/shared/FlexContainer';
import GraphicPercentage from '../components/shared/GraphicPercentage';
import Label from '../components/shared/Label';
import { getDecimalPlaces, humanReadableNumber } from '../utils/reduceBalance';
import theme from '../styles/theme';
import { getAnalyticsTokenData } from '../api/kaddex-analytics';
import CopyPopup from '../components/shared/CopyPopup';

const initialMonthlyRange = {
  initial: 0,
  final: 0,
};

const TokenInfoContainer = () => {
  const history = useHistory();
  const { token } = useParams();
  const pact = usePactContext();

  const asset =
    (pact.allTokens?.[token].statsID || pact.allTokens?.[token].code) === 'coin'
      ? 'KDA'
      : pact.allTokens?.[token].statsID || pact.allTokens?.[token].code;

  console.log('LOG --> asset', asset);

  const currency = (pact.allTokens?.[token].statsID || pact.allTokens?.[token].code) === 'coin' ? 'USDT' : 'coin';

  const [monthlyRange, setMonthlyRange] = useState(initialMonthlyRange);
  const [monthlyVolumeRange, setMonthlyVolumeRange] = useState(initialMonthlyRange);
  const [price24h, setPrice24h] = useState({
    initial: null,
    final: null,
  });
  const [tokenData, setTokenData] = useState(null);
  console.log('LOG --> tokenData', tokenData);

  useEffect(() => {
    const initData = async () => {
      if (token === 'KDA' || token === 'KDX') {
        //temporally mocked data
        const analyticsTokenData = {
          circulatingSupply: 9729644.329006802,
          tokenId: asset,
          totalSupply: 9997296.988999998,
          updatedAt: '2022-11-11T00:10:12.775Z',
          __v: 0,
          _id: '636ba945864835ddd1fe767b',
        };
        setTokenData(analyticsTokenData);
      } else {
        const analyticsTokenData = await getAnalyticsTokenData(asset);
        setTokenData(analyticsTokenData[0]);
      }

      const { data } = await getDailyCandles(asset, currency, moment().subtract(30, 'days').toDate());
      if (data) {
        const initial = data[0]?.usdPrice?.close || data[0]?.price?.close || 0;
        const final = data[data?.length - 1]?.usdPrice?.close || data[data?.length - 1]?.price?.close || 0;
        setMonthlyRange({
          initial,
          final,
        });
      }
      const lastMonthVolume = await getTotalVolume(
        moment().subtract(1, 'months').toDate(),
        new Date(),
        pact.allTokens[token].statsID || pact.allTokens[token].code
      );
      if (lastMonthVolume) {
        const pastLastMonthVolume = await getTotalVolume(
          moment().subtract(2, 'months').toDate(),
          moment().subtract(1, 'months').toDate(),
          pact.allTokens[token].statsID || pact.allTokens[token].code
        );
        if (pastLastMonthVolume) {
          setMonthlyVolumeRange({
            initial: pastLastMonthVolume,
            final: lastMonthVolume,
          });
        }
      }
      let price24Diff = null;
      if (asset === 'KDA') {
        price24Diff = await getKDAPriceDiff(moment().subtract(1, 'days').toDate(), new Date(), asset, currency);
      } else {
        price24Diff = await getUSDPriceDiff(moment().subtract(1, 'days').toDate(), new Date(), asset, currency);
      }
      setPrice24h(price24Diff);
    };
    initData();
  }, [asset, currency, token]);

  return (
    <FlexContainer
      className="column w-100 main"
      gap={24}
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
        <CryptoContainer style={{ marginRight: 8 }}>{pact.allTokens?.[token].icon}</CryptoContainer>
        <Label fontSize={24} fontFamily="syncopate" labelStyle={{ marginRight: 16 }}>
          {token}
        </Label>
        <Label fontSize={16} labelStyle={{ marginRight: 8 }}>
          {pact.allTokens?.[token].code}
        </Label>
        <CopyPopup containerStyle={{ marginBottom: 4, marginRight: 12 }} textToCopy={pact.allTokens?.[token].code} />
        <FlexContainer gap={12} style={{ marginBottom: 4 }}>
          <GithubIconCircle width={18} height={18} />
          <TwitterIconCircle width={18} height={18} />
          <DiscordIconCircle width={18} height={18} />
          <MediumIconCircle width={18} height={18} />
        </FlexContainer>
      </FlexContainer>
      <FlexContainer gap={16} className="w-100 justify-sb" tabletClassName="column" mobileClassName="column">
        <AnalyticsSimpleWidget
          title={'Circulating Supply'}
          mainText={`$ ${
            pact?.tokensUsdPrice?.[token] && tokenData ? humanReadableNumber(pact?.tokensUsdPrice?.[token] * tokenData.circulatingSupply, 3) : '-'
          }`}
          subtitle={`${tokenData ? humanReadableNumber(tokenData.circulatingSupply, 3) : '-'} ${token}`}
        />
        <AnalyticsSimpleWidget
          title="Total Supply"
          mainText={`$ ${
            pact?.tokensUsdPrice?.[token] && tokenData ? humanReadableNumber(pact?.tokensUsdPrice?.[token] * tokenData.totalSupply, 3) : '-'
          }`}
          subtitle={`${tokenData ? humanReadableNumber(tokenData.totalSupply, 3) : '-'} ${token}`}
        />
        <AnalyticsSimpleWidget title="Max Supply TO ADD" mainText={`TO ADD`} subtitle="TO ADD" />
      </FlexContainer>
      <FlexContainer gap={16} className="w-100 justify-sb" tabletClassName="column" mobileClassName="column">
        <AnalyticsSimpleWidget
          title={'Price'}
          mainText={
            <FlexContainer className="flex align-fs column" style={{ marginBottom: 7 }}>
              {`$ ${
                pact?.tokensUsdPrice?.[token]
                  ? humanReadableNumber(pact?.tokensUsdPrice?.[token], 3) !== '0.000'
                    ? humanReadableNumber(pact?.tokensUsdPrice?.[token], 3)
                    : (pact?.tokensUsdPrice?.[token]).toFixed(pact.allTokens?.[token].precision)
                  : '-'
              }`}
              <GraphicPercentage prevValue={price24h?.initial} currentValue={price24h?.final} />
            </FlexContainer>
          }
          subtitle={token !== 'KDX' ? `1 KDX = ${getDecimalPlaces(pact?.tokensUsdPrice?.KDX / pact?.tokensUsdPrice?.[token])} ${token}` : null}
        />
        <AnalyticsSimpleWidget
          title="1M Trading Volume"
          mainText={`$ ${humanReadableNumber(monthlyVolumeRange?.final * monthlyRange?.final)}`}
          subtitle={
            monthlyVolumeRange?.initial && <GraphicPercentage prevValue={monthlyVolumeRange?.initial} currentValue={monthlyVolumeRange?.final} />
          }
        />
        <AnalyticsSimpleWidget
          title="1M Price Delta"
          mainText={`$ ${humanReadableNumber(monthlyRange?.final - monthlyRange?.initial)}`}
          subtitle={<GraphicPercentage prevValue={monthlyRange?.initial} currentValue={monthlyRange?.final} />}
        />
      </FlexContainer>
      <TokenPriceChart dataToken={pact.allTokens?.[token]} height={300} />
      <FlexContainer gap={16} className="w-100 justify-sb" tabletClassName="column" mobileClassName="column">
        <AnalyticsSimpleWidget title="Liquidity" mainText={`$ 0.00 TODO`} subtitle={`$ 0.00 TODO ${token}`} />
        <AnalyticsSimpleWidget title="24h Volume" mainText={`$ 0.00 TODO`} subtitle={`$ 0.00 TODO ${token}`} />
        <AnalyticsSimpleWidget title="Marketcap - Fully Diluted Marketcap" mainText={`$ 0.00 TODO`} subtitle={`$ 0.00 TODO ${token}`} />
      </FlexContainer>
    </FlexContainer>
    // <div>
    //   <CustomButton onClick={() => history.goBack()}>Token Info</CustomButton>
    // </div>
  );
};

export default TokenInfoContainer;
