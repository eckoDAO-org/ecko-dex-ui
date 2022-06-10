/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useErrorState } from '../../hooks/useErrorState';
import { getDailyVolume } from '../../api/kaddex-stats';
import { getPairList } from '../../api/pact';
import { humanReadableNumber } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import { AddIcon, GasIcon } from '../../assets';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED, ROUTE_LIQUIDITY_POOLS } from '../../router/routes';
import Label from '../shared/Label';
import tokenData from '../../constants/cryptoCurrencies';
import { getAllPairValues } from '../../utils/token-utils';

const LiquidityPoolsTable = () => {
  const history = useHistory();
  const [pairList, setPairList] = useErrorState([], true);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const pools = await getPairList();
    if (pools.length) {
      const volumes = await getDailyVolume();

      const result = await getAllPairValues(pools, volumes);

      setPairList(result);
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  return !loading ? (
    <CommonTable
      items={pairList}
      columns={renderColumns()}
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

      render: ({ item }) => {
        if (item.liquidityUsd) {
          return `$ ${humanReadableNumber(item.liquidityUsd)}`;
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
      name: 'KDX Multiplier',
      width: 160,
      render: ({ item }) => 'Coming Soon',
    },
    {
      name: 'APR',
      width: 160,
      render: ({ item }) => `${item.apr?.value.toFixed(2)} %`,
    },
  ];
};
