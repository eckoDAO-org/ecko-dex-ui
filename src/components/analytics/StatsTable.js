/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { TradeUpIcon, VerifiedLogo } from '../../assets';
import { usePactContext } from '../../contexts';
import { useApplicationContext } from '../../contexts';
import { ROUTE_TOKEN_INFO } from '../../router/routes';
import { theme } from '../../styles/theme';
import { extractDecimal, humanReadableNumber } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import GraphicPercentage from '../shared/GraphicPercentage';
import { getAnalyticsTokenStatsData } from '../../api/kaddex-analytics';
import DecimalFormatted from '../shared/DecimalFormatted';

const StatsTable = ({ verifiedActive }) => {
  const { themeMode } = useApplicationContext();
  const pact = usePactContext();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState([]);
  const [verifiedStatsData, setVerifiedStatsData] = useState([]);

  useEffect(() => {
    const setInitData = async () => {
      if (pact?.tokensUsdPrice) {
        const data = [];
        const tokensStatsData = await getAnalyticsTokenStatsData();
        for (const t of Object.values(pact.allTokens)) {
          const price = pact?.tokensUsdPrice && pact?.tokensUsdPrice[t?.name];
          const tokenStats = tokensStatsData ? tokensStatsData[t.code] : undefined;
          data.push({
            ...t,
            price,
            dailyPriceChangeValue: tokenStats && tokenStats.priceChange24h,
            dailyVolume: tokenStats && tokenStats.volume24h * price,
            dailyVolumeChange: tokenStats && tokenStats.volumeChange24h,
          });
        }
        const dataVerified = data.filter((r) => r.isVerified);

        setStatsData(data.sort((x, y) => y.dailyVolume - x.dailyVolume));
        setVerifiedStatsData(dataVerified.sort((x, y) => y.dailyVolume - x.dailyVolume));
        setLoading(false);
      }
    };
    setInitData();
  }, [pact?.tokensUsdPrice]);

  return !loading ? (
    <CommonTable
      items={verifiedActive ? verifiedStatsData : statsData}
      columns={renderColumns(history, pact.allTokens)}
      actions={[
        {
          icon: () => (
            <FlexContainer
              className="align-ce"
              style={{
                background: theme(themeMode).colors.white,
                padding: '8px 4px',
                borderRadius: 100,
                width: 24,
                height: 24,
              }}
            >
              <TradeUpIcon className="svg-app-inverted-color" />
            </FlexContainer>
          ),
          onClick: (item) => {
            history.push(ROUTE_TOKEN_INFO.replace(':token', item.name));
          },
        },
      ]}
    />
  ) : (
    <AppLoader className="h-100 w-100 align-ce justify-ce" />
  );
};

export default StatsTable;

const ScalableCryptoContainer = styled(FlexContainer)`
  transition: all 0.3s ease-in-out;

  :hover {
    transform: scale(1.18);
  }
`;

const renderColumns = (history, allTokens) => {
  return [
    {
      name: '',
      width: 100,
      render: ({ item }) => (
        <ScalableCryptoContainer className="align-ce pointer" onClick={() => history.push(ROUTE_TOKEN_INFO.replace(':token', item.name))}>
          
          <CryptoContainer style={{ zIndex: 2 }}>{item.icon} </CryptoContainer>
          {item.name}
        </ScalableCryptoContainer>
      ),
    },

    {
      name: 'Price',
      width: 100,
      sortBy: 'price',
      render: ({ item }) => (
        <ScalableCryptoContainer className="align-ce pointer h-100" onClick={() => history.push(ROUTE_TOKEN_INFO.replace(':token', item.name))}>
          <DecimalFormatted value={item.price} />
        </ScalableCryptoContainer>
      ),
    },

    {
      name: '24h Price Change',
      width: 120,
      sortBy: 'dailyPriceChangeValue',
      render: ({ item }) => {
        return <GraphicPercentage componentStyle={{ margin: 0 }} percentageValue={item.dailyPriceChangeValue} />;
      },
    },

    {
      name: '24h Volume',
      width: 160,
      sortBy: 'dailyVolume',
      render: ({ item }) => {
        return `$ ${humanReadableNumber(extractDecimal(item.dailyVolume))}`;
      },
    },
    {
      name: '24h Volume Change',
      width: 120,
      sortBy: 'dailyVolumeValue',
      render: ({ item }) => {
        return <GraphicPercentage componentStyle={{ margin: 0 }} percentageValue={item.dailyVolumeChange} />;
      },
    },
  ];
};
