/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { getGroupedVolume } from '../../api/kaddex-stats';
import { getPairList } from '../../api/pact';
import CommonTable from '../shared/CommonTable';
import tokenData from '../../constants/cryptoCurrencies';
import { humanReadableNumber, reduceBalance } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import { AddIcon, BoosterIcon, GasIcon, TradeUpIcon } from '../../assets';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED, ROUTE_LIQUIDITY_TOKENS, ROUTE_TOKEN_INFO } from '../../router/routes';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import { getAllPairValues } from '../../utils/token-utils';
import { useApplicationContext, usePactContext } from '../../contexts';
import { commonColors, theme } from '../../styles/theme';
import styled from 'styled-components';
import { getPairsMultiplier } from '../../api/liquidity-rewards';
import { getAnalyticsTokenStatsData } from '../../api/kaddex-analytics';

const LiquidityTokensTable = () => {
  const history = useHistory();
  const { themeMode } = useApplicationContext();
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState([]);

  const { tokensUsdPrice, enableGasStation } = usePactContext();

  const fetchData = async () => {
    const pairsList = await getPairList();
    if (pairsList?.length) {
      const volumes = await getGroupedVolume(moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate(), 'daily');
      const tokensStatsData = await getAnalyticsTokenStatsData();
      const tokens = Object.values(tokenData);

      // get all aprs from pairs list
      const aprs = (await getAllPairValues(pairsList, volumes)).map((pair) => pair.apr);
      const result = [];

      // get all multipliers from pairs list
      const multipliers = await getPairsMultiplier(pairsList);

      // get an util object that contains all token info with its apr and multiplier
      const tokenAprAndMultiplier = pairsList.map((p) => {
        let apr = aprs.find((a) => a.token0 === p.token0 && a.token1 === p.token1).value;
        let mult = multipliers.find((m) => m.pair === p.name).multiplier;
        return { code: p.name, token0: p.token0, token1: p.token1, apr, mult };
      });

      // calculate sum of liquidity in usd and volumes in usd for each token in each pair
      //const stats = await getGroupedVolume(moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate(), 'daily');
      for (const token of tokens) {
        const tokenPairs = pairsList.filter((p) => p.token0 === token.name || p.token1 === token.name);
        const tokenUsdPrice = tokensUsdPrice?.[token.name] ? tokensUsdPrice?.[token.name] : 0;
        let liquidity = 0;
        for (const tokenPair of tokenPairs) {
          liquidity += token.name === tokenPair.token0 ? reduceBalance(tokenPair.reserves[0]) : reduceBalance(tokenPair.reserves[1]);
        }

        const liquidityUSD = tokenUsdPrice ? liquidity * tokenUsdPrice : null;

        const volume24H = tokensStatsData?.[token.code].volume24h;
        let apr = 0;
        let multiplier = 0;

        if (token.name === 'KDA') {
          // if token KDA, get the largests apr and multiplier among all pairs
          const majorAprMultiplierPair = tokenAprAndMultiplier.sort((x, y) => y.mult * y.apr - x.mult * x.apr)[0];
          apr = majorAprMultiplierPair.apr;
          multiplier = majorAprMultiplierPair.mult;
        } else {
          apr = tokenAprAndMultiplier.find((a) => a.token0 === token.name || a.token1 === token.name).apr;
          multiplier = tokenAprAndMultiplier.find((a) => a.code.split(':')[0] === token.code || a.code.split(':')[1] === token.code).mult;
        }

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
      columns={enableGasStation ? renderColumns(history) : renderColumns(history).filter((x) => x.name !== 'Fees')}
      actions={[
        {
          icon: () => <AddIcon />,
          onClick: (item) => {
            history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED.concat(`?token0=${item.name}`), {
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
      sortBy: 'tokenUsdPrice',
      render: ({ item }) => (
        <ScalableCryptoContainer className="align-ce pointer h-100" onClick={() => history.push(ROUTE_TOKEN_INFO.replace(':token', item.name))}>
          {humanReadableNumber(item.tokenUsdPrice, 3) !== '0.000' ? `$ ${humanReadableNumber(item.tokenUsdPrice, 3)}` : '<$ 0.001'}
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
      sortBy: 'apr',
      multiplier: 'multiplier',
      render: ({ item }) =>
        item.multiplier > 1 ? (
          <FlexContainer className="align-ce svg-pink">
            <BoosterIcon style={{ width: 16, height: 16 }} />
            <Label labelStyle={{ fontWeight: 600, marginLeft: 6 }} fontSize={14} color={commonColors.pink}>
              {(item.apr * item.multiplier).toFixed(2)} %
            </Label>
          </FlexContainer>
        ) : (
          `${item.apr.toFixed(2)} %`
        ),
    },
  ];
};
