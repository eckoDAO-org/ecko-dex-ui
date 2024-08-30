import React, { useEffect, useState } from 'react';
import { ROUTE_POOL_INFO } from '../../router/routes';
import { TradeUpIcon } from '../../assets';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import { extractDecimal, humanReadableNumber } from '../../utils/reduceBalance';
import GraphicPercentage from '../shared/GraphicPercentage';
import { useApplicationContext, usePactContext } from '../../contexts';
import { useHistory } from 'react-router-dom';
import { getAnalyticsDexscanPoolsData } from '../../api/kaddex-analytics';
import CommonTable from '../shared/CommonTable';
import { commonColors, theme } from '../../styles/theme';
import AppLoader from '../shared/AppLoader';
import styled from 'styled-components';
import DecimalFormatted from '../shared/DecimalFormatted';
import Banner from '../../components/layout/header/Banner';

const getPairInfoPactContext = (allPairs, token0, token1) => {
  return allPairs[`${token1}:${token0}`] || allPairs[`${token0}:${token1}`];
};

const Pools = () => {

  const { themeMode } = useApplicationContext();

  const pact = usePactContext();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [hasErrors, setHasErrors] = useState(false);

  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    const setInitData = async () => {
      try {
        if (pact?.tokensUsdPrice) {
          const data = [];
          const dexscanPoolsStats = await getAnalyticsDexscanPoolsData();

          const kaddexDexscanPoolsStats = dexscanPoolsStats.filter((d) => d.exchange.name === 'MERCATUS');
          for (const dexscanPool of kaddexDexscanPoolsStats) {
            const pairInfo = getPairInfoPactContext(pact.allPairs, dexscanPool.token0.address, dexscanPool.token1.address);
            const tokenInfo = pact.allTokens[dexscanPool.token0.address];
           
            if (!pairInfo || !tokenInfo) {
              continue;
            }

            data.push({
              ...pairInfo,
              ...tokenInfo,
              ...dexscanPool,
            });
          }
          setStatsData(data.sort((x, y) => y.volume24h - x.volume24h));

          setLoading(false);
        }
      } catch (error) {
        setHasErrors(true);
        setLoading(false);
      }
    };

    setInitData();
  }, [pact.allPairs, pact.allTokens, pact.tokensUsdPrice]);

  if (!loading && (hasErrors || !statsData?.length > 0)) {
    return (
      <div className="flex h-100 align-ce justify-ce">
        <Banner
          position="center"
          text={`Temporarily Unavailable: the stats page is currently down for maintenance. We're working to restore it promptly.`}
        />
      </div>
    );
  }

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
            history.push(ROUTE_POOL_INFO.replace(':pool', item.id));
          },
        },
      ]}
    />
  ) : (
    <AppLoader className="h-100 w-100 align-ce justify-ce" />
  );
};

export default Pools;

const ScalableCryptoContainer = styled(FlexContainer)`
  transition: all 0.3s ease-in-out;

  :hover {
    transform: scale(1.18);
  }
`;

const renderColumns = (history) => {
  return [
    {
      name: 'Token Pair',
      width: 100,
      render: ({ item }) => (
        <ScalableCryptoContainer className="align-ce pointer" onClick={() => history.push(ROUTE_POOL_INFO.replace(':pool', item.id))}>
          
          <CryptoContainer style={{ zIndex: 2 }}>
            <img
              alt={`${item.token0.name} icon`}
              src={item.icon}
              style={{ width: 20, height: 20, marginRight: '8px' }}
            />
          </CryptoContainer>
          <div className="flex ce" style={{ whiteSpace: 'nowrap' }}>
            <b>{item.token0.name}</b>
            <span style={{ color: commonColors.gameEditionBlueGrey }}>/{item.token1.name}</span>
          </div>
        </ScalableCryptoContainer>
      ),
      sortBy: 'id',
    },
    {
      name: 'Price',
      width: 100,
      render: ({ item }) => <DecimalFormatted value={item.price} />,
      sortBy: 'price',
    },
    {
      name: '24H Price Change',
      width: 100,
      render: ({ item }) => <GraphicPercentage componentStyle={{ margin: 0 }} percentageValue={item.pricePercChange24h * 100} />,
      sortBy: 'pricePercChange24h',
    },
    {
      name: '7D Price Change',
      width: 100,
      render: ({ item }) => <GraphicPercentage componentStyle={{ margin: 0 }} percentageValue={item.pricePercChange7d * 100} />,
      sortBy: 'pricePercChange7d',
    },
    {
      name: '24H Volume',
      width: 100,
      render: ({ item }) => <div>{`$ ${humanReadableNumber(extractDecimal(item.volume24h))}`}</div>,
      sortBy: 'volume24h',
    },
  ];
};
