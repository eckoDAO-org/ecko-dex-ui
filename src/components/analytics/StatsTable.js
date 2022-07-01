/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import { TradeUpIcon } from '../../assets';
import tokenData from '../../constants/cryptoCurrencies';
import { getTokenVolumeDiff, getUSDPriceDiff, getKDAPriceDiff } from '../../api/kaddex-stats';
import { usePactContext } from '../../contexts';
import { useApplicationContext } from '../../contexts';
import { ROUTE_TOKEN_INFO } from '../../router/routes';
import { theme } from '../../styles/theme';
import { extractDecimal, humanReadableNumber } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import GraphicPercentage from '../shared/GraphicPercentage';

const StatsTable = () => {
  const { themeMode } = useApplicationContext();
  const pact = usePactContext();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    const setInitData = async () => {
      if (pact?.tokensUsdPrice) {
        const data = [];
        for (const t of Object.values(tokenData)) {
          const asset = (t.statsID || t.code) === 'coin' ? 'KDA' : t.statsID || t.code;
          const currency = (t.statsID || t.code) === 'coin' ? 'USDT' : 'coin';
          const price = pact?.tokensUsdPrice && pact?.tokensUsdPrice[t?.name];
          const kdaUsdPrice = pact?.tokensUsdPrice?.KDA;
          const volume24 = await getTokenVolumeDiff(
            moment().subtract(2, 'days').toDate(),
            moment().subtract(1, 'days').toDate(),
            t.statsID || t.code
          );
          let price24Diff = null;
          if (asset === 'KDA') {
            price24Diff = await getKDAPriceDiff(moment().subtract(1, 'days').toDate(), new Date(), asset, currency);
          } else {
            price24Diff = await getUSDPriceDiff(moment().subtract(1, 'days').toDate(), new Date(), asset, currency);
          }
          data.push({
            ...t,
            price,
            dailyPriceChange: [price24Diff?.initial, price24Diff?.final],
            dailyVolume: volume24?.final * price24Diff?.final,
            dailyVolumeChange: [volume24?.initial * kdaUsdPrice, volume24?.final * kdaUsdPrice],
          });
        }
        setLoading(false);
        setStatsData(data);
      }
    };
    setInitData();
  }, [pact?.tokensUsdPrice]);

  return !loading ? (
    <CommonTable
      items={statsData}
      columns={renderColumns(history)}
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
    <AppLoader containerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} />
  );
};

export default StatsTable;

const ScalableCryptoContainer = styled(FlexContainer)`
  transition: all 0.3s ease-in-out;

  :hover {
    transform: scale(1.18);
  }
`;

const renderColumns = (history) => {
  return [
    {
      name: '',
      width: 160,
      render: ({ item }) => (
        <ScalableCryptoContainer className="align-ce pointer" onClick={() => history.push(ROUTE_TOKEN_INFO.replace(':token', item.name))}>
          <CryptoContainer style={{ zIndex: 2 }}>{item.icon} </CryptoContainer>
          {item.name}
        </ScalableCryptoContainer>
      ),
    },

    {
      name: 'Price',
      width: 160,
      render: ({ item }) => (
        <ScalableCryptoContainer className="align-ce pointer h-100" onClick={() => history.push(ROUTE_TOKEN_INFO.replace(':token', item.name))}>
          $ {humanReadableNumber(extractDecimal(item.price))}
        </ScalableCryptoContainer>
      ),
    },

    {
      name: '24h Price Change',
      width: 160,
      render: ({ item }) => {
        return <GraphicPercentage componentStyle={{ margin: 0 }} prevValue={item.dailyPriceChange[0]} currentValue={item.dailyPriceChange[1]} />;
      },
    },

    {
      name: '24h Volume',
      width: 160,
      render: ({ item }) => {
        return `$ ${humanReadableNumber(extractDecimal(item.dailyVolume))}`;
      },
    },
    {
      name: '24h Volume Change',
      width: 160,
      render: ({ item }) => {
        return <GraphicPercentage componentStyle={{ margin: 0 }} prevValue={item.dailyVolumeChange[0]} currentValue={item.dailyVolumeChange[1]} />;
      },
    },
  ];
};
