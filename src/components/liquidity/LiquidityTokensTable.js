/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getPairList } from '../../api/pact';
import CommonTable from '../shared/CommonTable';
import { humanReadableNumber, reduceBalance } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import { AddIcon, BoosterIcon, GasIcon, TradeUpIcon, VerifiedLogo } from '../../assets';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED, ROUTE_LIQUIDITY_TOKENS, ROUTE_TOKEN_INFO } from '../../router/routes';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import { getAllPairsData } from '../../utils/token-utils';
import { useApplicationContext, usePactContext } from '../../contexts';
import { commonColors, theme } from '../../styles/theme';
import styled from 'styled-components';
import useWindowSize from '../../hooks/useWindowSize';
import DecimalFormatted from '../shared/DecimalFormatted';
import Search from '../shared/Search';

const LiquidityTokensTable = ({ verifiedActive }) => {
  const history = useHistory();
  const { themeMode } = useApplicationContext();
  const [loading, setLoading] = useState(true);
  const [allTokensList, setAllTokensList] = useState([]);
  const [verifiedTokensList, setVerifiedTokensList] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const { tokensUsdPrice, enableGasStation, allTokens, allPairs } = usePactContext();

  const [width] = useWindowSize();

  const fetchData = async () => {
    const pairsList = await getPairList(allPairs);
    if (pairsList?.length) {
      const pairsData = await getAllPairsData(tokensUsdPrice, allTokens, allPairs, pairsList);
      const tokens = Object.values(allTokens);
      const result = [];
      // calculate sum of liquidity in usd and volumes in usd for each token in each pair
      for (const token of tokens) {
        const volume24UsdSum = pairsData
          .filter((t) => t.token0 === token.name || t.token1 === token.name)
          .reduce((total, v) => total + v.volume24HUsd, 0);

        const tokenPairs = pairsList.filter((p) => p.token0 === token.name || p.token1 === token.name);
        const tokenUsdPrice = tokensUsdPrice?.[token.name] ? tokensUsdPrice?.[token.name] : 0;

        const liquidityUSD = pairsData
          .filter((t) => t.token0 === token.name || t.token1 === token.name)
          .reduce((total, v) => total + (v.token0 === token.name ? v.liquidity0 : v.liquidity1), 0);

        let liquidity = 0;
        for (const tokenPair of tokenPairs) {
          liquidity += token.name === tokenPair.token0 ? reduceBalance(tokenPair.reserves[0]) : reduceBalance(tokenPair.reserves[1]);
        }

        const volume24H = volume24UsdSum / 2;
        let tokenInfo = pairsData
          .filter((d) => d.token0 === token.name || d.token1 === token.name)
          .sort((x, y) => y.apr * y.multiplier - x.apr * x.multiplier);
        let apr = tokenInfo?.[0]?.apr;
        let multiplier = tokenInfo?.[0]?.multiplier;

        result.push({
          ...token,
          volume24HUsd: volume24H,
          volume24H,
          apr,
          liquidityUSD,
          liquidity,
          tokenUsdPrice,
          multiplier,
        });
      }
      const verifiedTokensData = result.filter((r) => r.isVerified);
      setAllTokensList(result.sort((x, y) => y.liquidityUSD - x.liquidityUSD));
      setVerifiedTokensList(verifiedTokensData.sort((x, y) => y.liquidityUSD - x.liquidityUSD));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tokensUsdPrice) {
      fetchData();
    }
  }, [tokensUsdPrice]);

  const tokenList = Object.values(verifiedActive ? verifiedTokensList : allTokensList).filter((c) => {
    const code = c.code !== 'coin' ? c.code.split('.')[1] : c.code;
    return code.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) || c.name.toLowerCase().includes(searchValue?.toLowerCase());
  });

  return !loading ? (
    <>
      <CommonTable
        items={tokenList}
        columns={renderColumns(history, allTokens, width, searchValue, setSearchValue)}
        actions={[
          {
            icon: () => <AddIcon />,
            onClick: (item) => {
              history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED.concat(`?token0=${item.name}&token1=KDA`), {
                from: ROUTE_LIQUIDITY_TOKENS,
              });
            },
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
              history.push(ROUTE_TOKEN_INFO.replace(':token', item.name));
            },
          },
        ]}
      />
    </>
  ) : (
    <AppLoader className="h-100 w-100 align-ce justify-ce" />
  );
};

export default LiquidityTokensTable;

const ScalableCryptoContainer = styled(FlexContainer)`
  transition: all 0.3s ease-in-out;

  :hover {
    transform: scale(1.18);
  }
`;

const renderColumns = (history, allTokens, width, searchValue, setSearchValue) => {
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
      width: width <= theme().mediaQueries.mobilePixel ? 90 : 100,
      render: ({ item }) => (
        <ScalableCryptoContainer className="align-ce pointer" onClick={() => history.push(ROUTE_TOKEN_INFO.replace(':token', item.name))}>
          {allTokens[item.name]?.isVerified ? (
            <div style={{ marginRight: 16 }}>
              <VerifiedLogo className="svg-app-color" />
            </div>
          ) : (
            <div style={{ width: 32 }} />
          )}
          <CryptoContainer style={{ zIndex: 2 }}> {allTokens[item.name].icon}</CryptoContainer>
          {item.name}
        </ScalableCryptoContainer>
      ),
    },
    {
      name: 'price',
      width: width <= theme().mediaQueries.mobilePixel ? 90 : 100,
      sortBy: 'tokenUsdPrice',
      render: ({ item }) => (
        <ScalableCryptoContainer className="align-ce pointer h-100" onClick={() => history.push(ROUTE_TOKEN_INFO.replace(':token', item.name))}>
          <DecimalFormatted value={item.tokenUsdPrice} />
        </ScalableCryptoContainer>
      ),
    },
    {
      name: 'liquidity',
      width: 160,
      sortBy: 'liquidityUSD',
      render: ({ item }) => {
        if (item.liquidityUSD) {
          return `$ ${humanReadableNumber(item.liquidityUSD)}`;
        }
        return humanReadableNumber(item.liquidity);
      },
    },
    {
      name: '24h Volume',
      width: 160,
      sortBy: 'volume24HUsd',
      render: ({ item }) => {
        if (item.volume24HUsd) {
          return `$ ${humanReadableNumber(item.volume24HUsd)}`;
        } else {
          if (item.volume24H > 0) {
            return humanReadableNumber(item.volume24H);
          }
        }
        return '$ 0.00';
      },
    },

    {
      name: 'APR',
      width: 100,
      sortBy: 'apr',
      multiplier: 'multiplier',
      render: ({ item }) =>
        item.multiplier > 1 ? (
          <FlexContainer className="align-ce svg-pink">
            <BoosterIcon style={{ width: 16, height: 16 }} />
            <Label labelStyle={{ fontWeight: 600, marginLeft: 6 }} fontSize={14} color={commonColors.pink}>
              {(item?.apr * item?.multiplier)?.toFixed(2)} %
            </Label>
          </FlexContainer>
        ) : (
          `${item.apr.toFixed(2)} %`
        ),
    },
  ];
};
