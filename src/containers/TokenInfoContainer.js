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
import { theme, commonColors, commonTheme } from '../styles/theme';
import styled from 'styled-components';
import CustomButton from '../components/shared/CustomButton';
import AppLoader from '../components/shared/AppLoader';
import UsdKdaPrice from '../components/shared/UsdKdaPrice';
import UsdKdaToggle from '../components/shared/UsdKdaToggle';

const initialMonthlyRange = {
  initial: 0,
  final: 0,
};

const TokenInfoContainer = () => {
  const history = useHistory();
  const { token } = useParams();
  const {allTokens, tokensKdaPrice, tokensUsdPrice} = usePactContext();
  const { themeMode } = useApplicationContext();
  const [usdKda, setUsdKda] = useState(false); // False measn USD, while true means KDA => Default is USD

  const unit = usdKda?"KDA":"$";
  const precision = allTokens?.[token]?.precision

  // Find the correct token key in allTokens
  const tokenKey = Object.keys(allTokens).find(
    key => allTokens[key].name === token || allTokens[key].code === token
  );

  const asset = tokenKey && (allTokens[tokenKey].statsID || allTokens[tokenKey].code) === 'coin'
    ? 'KDA'
    : allTokens[tokenKey]?.statsID || allTokens[tokenKey]?.code;

  const currency = tokenKey && (allTokens[tokenKey].statsID || allTokens[tokenKey].code) === 'coin'
    ? 'USDT'
    : 'coin';

  const [monthlyRange, setMonthlyRange] = useState(initialMonthlyRange);
  const [monthlyVolumeRange, setMonthlyVolumeRange] = useState(initialMonthlyRange);
  const [price24h, setPrice24h] = useState({
    initial: null,
    final: null,
  });

  useEffect(() => {
    const initData = async () => {
      if (!tokenKey) {
        console.warn(`Token key not found for ${token}`);
        return;
      }

      const { data } = await getDailyCandles(asset, currency, moment().subtract(30, 'days').toDate());
      if (data) {
        const initial = (unit==="KDA"?data[0]?.price?.close : data[0]?.usdPrice?.close) || 0;
        const final = (unit==="KDA"?data[data?.length - 1]?.price?.close : data[data?.length - 1]?.usdPrice?.close) || 0;
        setMonthlyRange({
          initial,
          final,
        });
      }
      const lastMonthVolume = await getTotalVolume(
        moment().subtract(1, 'months').toDate(),
        new Date(),
        allTokens[tokenKey].statsID || allTokens[tokenKey].code
      );
      if (lastMonthVolume) {
        const pastLastMonthVolume = await getTotalVolume(
          moment().subtract(2, 'months').toDate(),
          moment().subtract(1, 'months').toDate(),
          allTokens[tokenKey].statsID || allTokens[tokenKey].code
        );
        setMonthlyVolumeRange({
          initial: pastLastMonthVolume,
          final: lastMonthVolume,
        });
      }
      let price24Diff = null;
      if (asset === 'KDA' || unit==="KDA") {
        price24Diff = await getKDAPriceDiff(moment().subtract(1, 'days').toDate(), new Date(), asset, currency);
      } else {
        price24Diff = await getUSDPriceDiff(moment().subtract(1, 'days').toDate(), new Date(), asset, currency);
      }
      setPrice24h(price24Diff);
    };
    initData();
  }, [asset, currency, token, tokenKey, unit, allTokens]);

  if(Object.keys(allTokens).length === 0)
    return <AppLoader className="h-100 w-100 align-ce justify-ce" />;

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
        <CryptoContainer style={{ marginRight: 8 }}>
          <img
            alt={`${token} icon`}
            src={allTokens[tokenKey]?.icon}
            style={{ width: 20, height: 20, marginRight: '8px' }}
          />
        </CryptoContainer>
          <div>
            <Label fontSize={24} fontFamily="syncopate">
              {allTokens[tokenKey]?.name}
            </Label>
            <Label fontSize={12} className="mobile-none" color={commonColors.gameEditionBlueGrey}>
              {allTokens[tokenKey]?.code}
            </Label>
          </div>
          <div style={{marginLeft:"auto"}}> <UsdKdaToggle initialState={false} onClick={setUsdKda} /> </div>
        </div>
        {!allTokens[tokenKey]?.isVerified && (
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
              <UsdKdaPrice value={unit==="KDA"?tokensKdaPrice?.[tokenKey]:tokensUsdPrice?.[tokenKey]} precision={precision} unit={unit} fontSize={32}/>
              <GraphicPercentage prevValue={price24h?.initial} currentValue={price24h?.final} />
            </FlexContainer>
          }
        />
        <AnalyticsSimpleWidget
          title="1M Trading Volume"
          mainText={<UsdKdaPrice value={monthlyVolumeRange?.final * monthlyRange?.final} unit={unit} precision={precision} fontSize={24}/>}
          subtitle={
            monthlyVolumeRange?.initial && <GraphicPercentage prevValue={monthlyVolumeRange?.initial} currentValue={monthlyVolumeRange?.final} />
          }
        />
        <AnalyticsSimpleWidget
          title="1M Price Delta"
          mainText={<UsdKdaPrice value={monthlyRange?.final - monthlyRange?.initial} precision={precision} unit={unit} fontSize={24}/>}
          subtitle={<GraphicPercentage prevValue={monthlyRange?.initial} currentValue={monthlyRange?.final} />}
        />
      </FlexContainer>
      <TokenPriceChart dataToken={allTokens?.[tokenKey]} height={300} unit={unit}/>
    </FlexContainer>
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
