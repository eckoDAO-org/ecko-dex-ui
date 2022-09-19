/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useErrorState } from '../../hooks/useErrorState';
import { getPairList } from '../../api/pact';
import { humanReadableNumber, reduceBalance } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import { AddIcon, BoosterIcon, GasIcon } from '../../assets';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED, ROUTE_LIQUIDITY_POOLS } from '../../router/routes';
import Label from '../shared/Label';
import tokenData from '../../constants/cryptoCurrencies';
import { getApr, getTokenName } from '../../utils/token-utils';
import { getPairsMultiplier } from '../../api/liquidity-rewards';
import { commonColors } from '../../styles/theme';
import { usePactContext } from '../../contexts';
import { getAnalyticsPoolsStatsData } from '../../api/kaddex-analytics';

const LiquidityPoolsTable = () => {
  const history = useHistory();
  const { enableGasStation, tokensUsdPrice } = usePactContext();

  const [pairList, setPairList] = useErrorState([], true);
  console.log('LOG --> pairList', pairList);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const pools = await getPairList();

    if (pools.length) {
      const volumes = await getAnalyticsPoolsStatsData();
      let allData = [];
      const multipliers = await getPairsMultiplier(pools);
      for (const pool of pools) {
        let volume24HUsd = 0;
        let apr = 0;
        let liquidityUsd = 0;
        const token0 = Object.values(tokenData).find((t) => t.name === pool.token0);
        const token1 = Object.values(tokenData).find((t) => t.name === pool.token1);

        let multiplier = multipliers.find((m) => m.pair === pool.name).multiplier;

        if (tokensUsdPrice) {
          const liquidity0 = tokensUsdPrice[token0.name] ? reduceBalance(pool.reserves[0]) * tokensUsdPrice[token0.name] : 0;
          const liquidity1 = tokensUsdPrice[token1.name] ? reduceBalance(pool.reserves[1]) * tokensUsdPrice[token1.name] : 0;

          let token0UsdPrice = tokensUsdPrice[getTokenName(volumes[pool.name].baseTokenCode)];
          let token1UsdPrice = tokensUsdPrice[getTokenName(volumes[pool.name].targetTokenCode)];

          volume24HUsd =
            token0UsdPrice && token1UsdPrice ? volumes[pool.name].baseVolume * token0UsdPrice + volumes[pool.name].targetVolume * token1UsdPrice : 0;

          liquidityUsd = liquidity0 + liquidity1;

          apr = getApr(volume24HUsd, liquidityUsd);
        } else {
          apr = null;
          liquidityUsd = null;
          volume24HUsd = null;
        }

        let data = {
          ...pool,
          liquidityUsd,
          volume24HUsd,
          apr,
          multiplier,
        };
        allData.push(data);
      }

      setPairList(allData);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    if (tokensUsdPrice) fetchData();
  }, [tokensUsdPrice]);

  return !loading ? (
    <CommonTable
      items={pairList}
      columns={enableGasStation ? renderColumns() : renderColumns().filter((x) => x.name !== 'Fees')}
      actions={[
        {
          icon: () => <AddIcon />,
          onClick: (item) =>
            history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED.concat(`?token0=${item.token0}&token1=${item.token1}`), {
              from: ROUTE_LIQUIDITY_POOLS,
            }),
        },
      ]}
    />
  ) : (
    <AppLoader containerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} />
  );
};

export default LiquidityPoolsTable;

const renderColumns = () => {
  return [
    {
      name: '',
      width: 160,
      render: ({ item }) => (
        <FlexContainer className="align-ce">
          <CryptoContainer style={{ zIndex: 2 }}> {tokenData[item.token0].icon}</CryptoContainer>
          <CryptoContainer style={{ marginLeft: -12, zIndex: 1 }}>{tokenData[item.token1].icon} </CryptoContainer>
          {item.token0}/{item.token1}
        </FlexContainer>
      ),
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
      name: 'KDX Multiplier',
      width: 160,
      sortBy: 'multiplier',
      render: ({ item }) =>
        item.multiplier > 1 ? (
          <FlexContainer className="align-ce svg-pink">
            <BoosterIcon style={{ width: 16, height: 16 }} />
            <Label labelStyle={{ fontWeight: 600, marginLeft: 6 }} fontSize={13} color={commonColors.pink}>
              {item.multiplier.toFixed(2)} x
            </Label>
          </FlexContainer>
        ) : (
          '-'
        ),
    },
    {
      name: 'APR',
      width: 160,
      sortBy: 'apr',
      multiplier: 'multiplier',
      render: ({ item }) =>
        item.multiplier > 1 ? (
          <div className="column flex">
            <Label labelStyle={{ fontWeight: 600 }} fontSize={14} color={commonColors.pink}>
              {(item.apr * item.multiplier).toFixed(2)} %
            </Label>
            <Label fontSize={11} labelStyle={{ marginTop: 4, opacity: 0.7 }}>
              {item.apr.toFixed(2)} %
            </Label>
          </div>
        ) : (
          `${item.apr.toFixed(2)} %`
        ),
    },
  ];
};
