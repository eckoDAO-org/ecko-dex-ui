/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useHistory, useParams } from 'react-router-dom';
import { useApplicationContext, usePactContext } from '../contexts';
import { ArrowBack, VerifiedBoldLogo } from '../assets';
import { getDailyCandles, getTotalVolume, getUSDPriceDiff, getKDAPriceDiff } from '../api/kaddex-stats';
import TokenPriceChart from '../components/charts/TokenPriceChart';
import AnalyticsSimpleWidget from '../components/shared/AnalyticsSimpleWidget';
import { CryptoContainer, FlexContainer } from '../components/shared/FlexContainer';
import GraphicPercentage from '../components/shared/GraphicPercentage';
import Label from '../components/shared/Label';
import { getDecimalPlaces, humanReadableNumber } from '../utils/reduceBalance';
import { theme, commonColors, commonTheme } from '../styles/theme';
import styled from 'styled-components';
import CustomButton from '../components/shared/CustomButton';

const initialMonthlyRange = {
  initial: 0,
  final: 0,
};

const TokenInfoContainer = () => {
  const history = useHistory();
  const { token } = useParams();

  const pact = usePactContext();
  const { themeMode } = useApplicationContext();
  const asset =
    (pact.allTokens?.[token].statsID || pact.allTokens?.[token].code) === 'coin'
      ? 'KDA'
      : pact.allTokens?.[token].statsID || pact.allTokens?.[token].code;
  const currency = (pact.allTokens?.[token].statsID || pact.allTokens?.[token].code) === 'coin' ? 'USDT' : 'coin';

  const [monthlyRange, setMonthlyRange] = useState(initialMonthlyRange);
  const [monthlyVolumeRange, setMonthlyVolumeRange] = useState(initialMonthlyRange);
  const [price24h, setPrice24h] = useState({
    initial: null,
    final: null,
  });

  useEffect(() => {
    const initData = async () => {
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
        setMonthlyVolumeRange({
          initial: pastLastMonthVolume,
          final: lastMonthVolume,
        });
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
      desktopStyle={{ paddingRight: commonTheme.layout.desktopPadding, paddingLeft: commonTheme.layout.desktopPadding }}
      tabletStyle={{ paddingRight: commonTheme.layout.tabletPadding, paddingLeft: commonTheme.layout.tabletPadding }}
      mobileStyle={{ paddingRight: commonTheme.layout.mobilePadding, paddingLeft: commonTheme.layout.mobilePadding }}
    >
      <FlexContainer className="w-100 align-ce justify-sb">
        <div className="flex w-100 align-ce">
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
          <div>
            <Label fontSize={24} fontFamily="syncopate">
              {token}
            </Label>
            <Label fontSize={12} className="mobile-none" color={commonColors.gameEditionBlueGrey}>
              {pact.allTokens?.[token].code}
            </Label>
          </div>
        </div>
        {!pact.allTokens?.[token].isVerified && (
          <CustomButton
            fontSize={13}
            buttonStyle={{ height: 33, width: 'min-content' }}
            type={'secondary'}
            fontFamily="syncopate"
            onClick={() =>
              window.open(
                `https://docs.google.com/forms/d/e/1FAIpQLSfb_1LIY594I87WotLwD8SzmOte9gc9KT4_2y5z6ot5Wv46nw/viewform`,
                '_blank',
                'noopener,noreferrer'
              )
            }
          >
            <ButtonContent color={commonColors.white}>
              <VerifiedBoldLogo className={'svg-app-inverted-color'} />
              <Label fontFamily="syncopate" color={theme(themeMode).colors.primary} labelStyle={{ marginTop: 1 }}>
                VERIFY
              </Label>
            </ButtonContent>
          </CustomButton>
        )}
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
    </FlexContainer>
    // <div>
    //   <CustomButton onClick={() => history.goBack()}>Token Info</CustomButton>
    // </div>
  );
};

export default TokenInfoContainer;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 8px;
    path {
      fill: ${({ color }) => color};
    }
  }
`;
