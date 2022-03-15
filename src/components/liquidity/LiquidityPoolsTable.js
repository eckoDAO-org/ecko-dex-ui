/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useErrorState } from '../../hooks/useErrorState';
import { getDailyVolume } from '../../api/kaddex-stats';
import { getCoingeckoUsdPrice } from '../../api/coingecko';
import { getPairList } from '../../api/pact-pair';
import { NETWORK_TYPE } from '../../constants/contextConstants';
import { humanReadableNumber } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import { AddIcon, GasIcon } from '../../assets';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED, ROUTE_LIQUIDITY_POOLS } from '../../router/routes';
import Label from '../shared/Label';
import tokenData from '../../constants/cryptoCurrencies';
import { get24HTokenVolume, getApr, getUsdPoolLiquidity } from '../../utils/token-utils';

const LiquidityPoolsTable = () => {
  const history = useHistory();
  const [pairList, setPairList] = useErrorState([], true);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const resultPairList = await getPairList();
    const data = await getDailyVolume();

    const result = [];
    // calculate liquidity in usd and volume in usd for each pair
    for (const pair of resultPairList) {
      const token0 = Object.values(tokenData).find((t) => t.name === pair.token0);

      const token0UsdPrice = await getCoingeckoUsdPrice(token0.coingeckoName);

      const { volume24HUsd } = get24HTokenVolume(data, token0.tokenNameKaddexStats, token0UsdPrice);

      const liquidityUsd = await getUsdPoolLiquidity(pair);

      const apr = getApr(volume24HUsd, liquidityUsd);

      result.push({ ...pair, liquidityUsd, volume24HUsd, apr });
    }

    setPairList(result);

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
      onClick={(item) => {
        window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${item?.requestKey}`, '_blank', 'noopener,noreferrer');
      }}
      actions={[
        {
          icon: <AddIcon />,
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
      name: 'name',
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
        return `$ ${humanReadableNumber(item.liquidityUsd)}`;
      },
    },
    {
      name: '24h Volume',
      width: 160,
      render: ({ item }) => `$ ${humanReadableNumber(Number(item.volume24HUsd))}`,
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
      name: 'Rewards Booster',
      width: 160,
      render: ({ item }) => 'Coming Soon',
    },
    {
      name: 'APR',
      width: 160,
      render: ({ item }) => `${item.apr.toFixed(2)} %`,
    },
  ];
};
