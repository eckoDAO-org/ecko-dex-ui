/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getDailyVolume } from '../../api/kaddex-stats';
import { getPairList } from '../../api/pact';
import CommonTable from '../shared/CommonTable';
import tokenData from '../../constants/cryptoCurrencies';
import { humanReadableNumber, reduceBalance } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import { AddIcon, GasIcon, TradeUpIcon } from '../../assets';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED, ROUTE_LIQUIDITY_TOKENS, ROUTE_TOKEN_INFO } from '../../router/routes';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import { get24HVolumeSingleSided, getAllPairValues } from '../../utils/token-utils';
import { useApplicationContext, usePactContext } from '../../contexts';
import { theme } from '../../styles/theme';
import styled from 'styled-components';

const LiquidityTokensTable = () => {
  const history = useHistory();
  const { themeMode } = useApplicationContext();
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState([]);

  const { tokensUsdPrice } = usePactContext();

  const fetchData = async () => {
    const pairsList = await getPairList();
    if (pairsList?.length) {
      const volumes = await getDailyVolume();

      const tokens = Object.values(tokenData);

      // get all aprs from pairs list
      const aprs = (await getAllPairValues(pairsList, volumes)).map((pair) => pair.apr);
      const result = [];

      // calculate sum of liquidity in usd and volumes in usd for each token in each pair
      for (const token of tokens) {
        const tokenPairs = pairsList.filter((p) => p.token0 === token.name || p.token1 === token.name);
        const tokenUsdPrice = tokensUsdPrice?.[token.name];
        let volume24HUsd = 0;
        let volume24H = 0;
        let liquidity = 0;
        for (const tokenPair of tokenPairs) {
          volume24H += get24HVolumeSingleSided(volumes, token.tokenNameKaddexStats);
          volume24HUsd += volume24H * tokenUsdPrice;
          liquidity += token.name === tokenPair.token0 ? reduceBalance(tokenPair.reserves[0]) : reduceBalance(tokenPair.reserves[1]);
        }

        const liquidityUSD = tokenUsdPrice ? liquidity * tokenUsdPrice : null;

        // filter all apr that contains the token in at least one side of the pair
        const filteredApr = aprs.filter((a) => a.token0 === token.name || a.token1 === token.name);
        // get the highest apr for filtered apr
        const highestApr = Math.max(...filteredApr.map((apr) => apr.value));

        result.push({ ...token, volume24HUsd, volume24H, apr: highestApr, liquidityUSD, liquidity, tokenUsdPrice });
      }
      setTokens(result);
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
      items={tokens}
      columns={renderColumns(history)}
      actions={[
        {
          icon: () => <AddIcon />,
          onClick: (item) => {
            history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED.concat(`?token0=${item.name}`), {
              from: ROUTE_LIQUIDITY_TOKENS,
            });
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
  img {
    transition: all 0.3s ease-in-out;
  }

  :hover {
    img {
      transform: scale(1.15);
    }
  }
`;

const renderColumns = (history) => {
  return [
    {
      name: '',
      width: 160,
      render: ({ item }) => (
        <ScalableCryptoContainer className="align-ce pointer" onClick={() => history.push(ROUTE_TOKEN_INFO.replace(':token', item.name))}>
          <CryptoContainer style={{ zIndex: 2 }}> {tokenData[item.name].icon}</CryptoContainer>
          {item.name}
        </ScalableCryptoContainer>
      ),
    },
    {
      name: 'price',
      width: 160,
      render: ({ item }) => `$ ${item.tokenUsdPrice}`,
    },
    {
      name: 'liquidity',
      width: 160,

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
      render: ({ item }) => {
        if (item.volume24HUsd) {
          return `$ ${humanReadableNumber(item.volume24HUsd)}`;
        }
        return humanReadableNumber(item.volume24H);
      },
    },

    {
      name: 'Fees',
      width: 160,
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
      width: 120,
      render: ({ item }) => `${item.apr.toFixed(2)}%`,
    },
  ];
};
