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
import { getAnalyticsTokenStatsData } from '../../api/kaddex-analytics';
import useWindowSize from '../../hooks/useWindowSize';
import DecimalFormatted from '../shared/DecimalFormatted';

const LiquidityTokensTable = ({ verifiedActive }) => {
  const history = useHistory();
  const { themeMode } = useApplicationContext();
  const [loading, setLoading] = useState(true);
  const [allTokensList, setAllTokensList] = useState([]);
  const [verifiedTokensList, setVerifiedTokensList] = useState([]);

  const { tokensUsdPrice, enableGasStation, allTokens, allPairs } = usePactContext();

  const [width] = useWindowSize();

  const fetchData = async () => {
    const pairsList = await getPairList(allPairs);
    if (pairsList?.length) {
      const pairsData = await getAllPairsData(tokensUsdPrice, allTokens, allPairs, pairsList);
      const tokensStatsData = await getAnalyticsTokenStatsData();
      const tokens = Object.values(allTokens);
      const result = [];
      // calculate sum of liquidity in usd and volumes in usd for each token in each pair
      for (const token of tokens) {
        const tokenPairs = pairsList.filter((p) => p.token0 === token.name || p.token1 === token.name);
        const tokenUsdPrice = tokensUsdPrice?.[token.name] ? tokensUsdPrice?.[token.name] : 0;
        let liquidity = 0;
        for (const tokenPair of tokenPairs) {
          liquidity += token.name === tokenPair.token0 ? reduceBalance(tokenPair.reserves[0]) : reduceBalance(tokenPair.reserves[1]);
        }
        const liquidityUSD = tokenUsdPrice ? liquidity * tokenUsdPrice : null;
        const volume24H = tokensStatsData?.[token.code]?.volume24h;
        let tokenInfo = pairsData
          .filter((d) => d.token0 === token.name || d.token1 === token.name)
          .sort((x, y) => y.apr * y.multiplier - x.apr * x.multiplier);
        let apr = tokenInfo?.[0]?.apr;
        let multiplier = tokenInfo?.[0]?.multiplier;

        result.push({
          ...token,
          volume24HUsd: volume24H * tokensUsdPrice?.[token.name],
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

  return !loading ? (
    <CommonTable
      items={verifiedActive ? verifiedTokensList : allTokensList}
      columns={
        enableGasStation ? renderColumns(history, allTokens, width) : renderColumns(history, allTokens, width).filter((x) => x.name !== 'Fees')
      }
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

const renderColumns = (history, allTokens, width) => {
  return [
    {
      name: '',
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
        }
        return humanReadableNumber(item.volume24H);
      },
    },

    {
      name: 'Fees',
      width: width <= theme().mediaQueries.mobilePixel ? 90 : 100,
      render: () => (
        <FlexContainer className="align-ce">
          <GasIcon />
          <Label fontSize={13} color="#41CC41" labelStyle={{ marginLeft: 12 }}>
            Gasless
          </Label>
        </FlexContainer>
      ),
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
