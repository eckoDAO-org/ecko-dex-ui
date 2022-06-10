import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ArrowBack } from '../assets';
import TokenPriceChart from '../components/charts/TokenPriceChart';
import AnalyticsSimpleWidget from '../components/shared/AnalyticsSimpleWidget';
import { CryptoContainer, FlexContainer } from '../components/shared/FlexContainer';
import GraphicPercetage from '../components/shared/GraphicPercetage';
import Label from '../components/shared/Label';
import tokenData from '../constants/cryptoCurrencies';
import { usePactContext } from '../contexts';
import theme from '../styles/theme';
import { getDecimalPlaces, humanReadableNumber } from '../utils/reduceBalance';

const TokenInfoContainer = () => {
  const history = useHistory();
  const { token } = useParams();
  const pact = usePactContext();
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
          mainText={`$ ${humanReadableNumber(Number(99999999))}`}
          subtitle={<GraphicPercetage prevValue={99} currentValue={2} />}
        />
        <AnalyticsSimpleWidget
          title="1m Price Delta"
          mainText={`$ ${humanReadableNumber(Number(99999999))}`}
          subtitle={<GraphicPercetage prevValue={99} currentValue={2} />}
        />
      </FlexContainer>
      <TokenPriceChart token={token} height={300} />
    </FlexContainer>
    // <div>
    //   <CustomButton onClick={() => history.goBack()}>Token Info</CustomButton>
    // </div>
  );
};

export default TokenInfoContainer;
