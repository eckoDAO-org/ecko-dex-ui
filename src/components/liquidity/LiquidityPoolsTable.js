/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useErrorState } from '../../hooks/useErrorState';
import { humanReadableNumber } from '../../utils/reduceBalance';
import {DEFAULT_ICON_URL} from '../../constants/cryptoCurrencies';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import { AddIcon, TradeUpIcon, GasIcon } from '../../assets';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED, ROUTE_LIQUIDITY_POOLS, ROUTE_POOL_INFO } from '../../router/routes';
import Label from '../shared/Label';
import { getAllPairsData } from '../../utils/token-utils';
import { theme, commonColors } from '../../styles/theme';
import { useApplicationContext, usePactContext } from '../../contexts';
import useWindowSize from '../../hooks/useWindowSize';
import styled from 'styled-components';
import Search from '../shared/Search';


const LiquidityPoolsTable = () => {
  
  const history = useHistory();
  const { enableGasStation, tokensUsdPrice, allTokens, allPairs } = usePactContext();

  const [loading, setLoading] = useState(false);
  const [allPairList, setAllPairList] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const { themeMode } = useApplicationContext();

  const [width] = useWindowSize();

  const fetchData = async () => {
    const pairsDataInfo = await getAllPairsData(tokensUsdPrice, allTokens, allPairs);
    setAllPairList(pairsDataInfo.sort((x, y) => y.liquidityUsd - x.liquidityUsd));
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    if (tokensUsdPrice) fetchData();
  }, [tokensUsdPrice]);

  const pairList = Object.values(allPairList).filter((c) => {
    const firstToken = c.name.split(':')[0];
    const secondToken = c.name.split(':')[1];

    const codeFirstToken = firstToken !== 'coin' ? firstToken.split('.')[1] : firstToken;
    const codeSecondToken = secondToken !== 'coin' ? secondToken.split('.')[1] : secondToken;

    return (
      codeFirstToken.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
      codeSecondToken.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
      c.token0.toLowerCase().includes(searchValue?.toLowerCase()) ||
      c.token1.toLowerCase().includes(searchValue?.toLowerCase())
    );
  });

  return !loading ? (
    <>
      <CommonTable
        items={pairList}
        columns={renderColumns(history, allTokens, allPairs, width, searchValue, setSearchValue)}
        actions={[
          {
            icon: () => <AddIcon />,
            onClick: (item) =>
              history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED.concat(`?token0=${item.token1}&token1=${item.token0}`), {
                from: ROUTE_LIQUIDITY_POOLS,
              }),
          },
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
              history.push(ROUTE_POOL_INFO.replace(':pool', `${item.token0}:${item.token1}`), { from: history.location.pathname });
            },
          },
        ]}
      />
    </>
  ) : (
    <AppLoader containerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} />
  );
};

export default LiquidityPoolsTable;

const ScalableCryptoContainer = styled(FlexContainer)`
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  :hover {
    transform: scale(1.18);
  }
`;

const renderColumns = (history, allTokens, allPairs, width, searchValue, setSearchValue) => {
  return [
    {
      name: (
        <Search
          containerStyle={{
            marginBottom: '-10px',
            marginTop: '-8px',
            border: 'none',
            width: '100px',
          }}
          iconFirst
          fluid
          placeholder="Search"
          value={searchValue}
          onChange={(e, { value }) => setSearchValue(value)}
        />
      ),
      width: width <= theme().mediaQueries.mobilePixel ? 80 : 160,
      render: ({ item }) => {

        // Extract token names from the item.name 
        const [t0, t1] = item.name.split(':');

        // Find the tokens in allTokens
        const token0 = Object.values(allTokens).find(token => token.name === t0 || token.code === t0);
        const token1 = Object.values(allTokens).find(token => token.code === t1 || token.name === t1);

        if (!token0 || !token1) {
          console.warn(`Token not found for ${t0} or ${t1}`);
          return null;
        }

        // Determine which token is KDA
        const [nonKdaToken, kdaToken] = token0.name === 'KDA' ? [token0, token1] : [token0, token1];

        return (
          <ScalableCryptoContainer
            desktopClassName="align-ce"
            tabletClassName="align-ce"
            mobileClassName="column align-fs"
            mobilePixel={769}
            onClick={() => history.push(ROUTE_POOL_INFO.replace(':pool', `${nonKdaToken.name}:${kdaToken.name}`), 
            { from: history.location.pathname })}          >
            <div className="flex align-ce">
              
              <CryptoContainer style={{ zIndex: 2 }}>
                <img
                  alt={`${kdaToken.name} icon`}
                  src={kdaToken.icon}
                  style={{ width: 20, height: 20, marginRight: '8px' }}
                  onError={(e) => {
                    console.error(`Failed to load icon for ${kdaToken.name}:`, e);
                    e.target.onerror = null;
                    e.target.src = DEFAULT_ICON_URL;
                  }}
                />
              </CryptoContainer>
              <CryptoContainer style={{ marginLeft: -12, zIndex: 1 }} size={30}>
                <img
                  alt={`${nonKdaToken.name} icon`}
                  src={nonKdaToken.icon}
                  style={{ width: 20, height: 20, marginRight: '8px' }}
                  onError={(e) => {
                    console.error(`Failed to load icon for ${nonKdaToken.name}:`, e);
                    e.target.onerror = null;
                    e.target.src = DEFAULT_ICON_URL;
                  }}
                />
              </CryptoContainer>
            </div>
            <div
              className="align-fs flex"
              style={{
                marginLeft: width <= theme().mediaQueries.mobilePixel && 32,
                marginTop: width <= theme().mediaQueries.mobilePixel && 4,
              }}
            >
              {kdaToken.name}/{nonKdaToken.name}
            </div>
          </ScalableCryptoContainer>
        );
      },
    },
    {
      name: 'liquidity',
      width: 160,
      sortBy: 'liquidityUsd',
      render: ({ item }) => {
        if (item.liquidityUsd) {
          return `$ ${humanReadableNumber(item.liquidityUsd)}`;
        }
        return `$ 0.00`;
      },
    },
    {
      name: '24h Volume',
      width: 160,
      sortBy: 'volume24HUsd',
      render: ({ item }) => {
        if (item.volume24HUsd) {
          return `$ ${humanReadableNumber(item.volume24HUsd)}`;
        }
        return `$ 0.00`;
      },
    },
    {
      name: 'APR',
      width: 100,
      sortBy: 'apr',
      render: ({ item }) => `${item.apr.toFixed(2)} %`,
    },
  ];
};
