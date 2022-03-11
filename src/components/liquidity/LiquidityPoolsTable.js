/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useErrorState } from '../../hooks/useErrorState';
import { getDailyVolume } from '../../api/kaddex-stats';
import { getPairList } from '../../api/pact-pair';
import { chainId, NETWORK_TYPE } from '../../constants/contextConstants';
import tokenData from '../../constants/cryptoCurrencies';
import { reduceBalance } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import { AddIcon } from '../../assets';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED, ROUTE_LIQUIDITY_POOLS } from '../../router/routes';
import { useHistory } from 'react-router-dom';

const LiquidityPoolsTable = () => {
  const history = useHistory();
  const [pairList, setPairList] = useErrorState([], true);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const resultPairList = await getPairList();
    const data = await getDailyVolume();
    const last24hDailyVolume = data.find((d) => d._id === moment().subtract(1, 'day').format('YYYY-MM-DD'));
    const result = resultPairList.map((pair) => {
      const tokenName = pair.token0Name;
      const volume = last24hDailyVolume.volumes
        ?.filter((v) => v.chain === Number(chainId))
        .reduce((total, v) => {
          if (v.tokenFromName === tokenName) {
            total += v.tokenFromVolume;
          } else {
            total += v.tokenToVolume;
          }
          return total;
        }, 0);
      return { ...pair, volume24H: volume };
    });
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
            history.push(
              ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED.concat(`?token0=${item.token0}&token1=${item.token1}&back=${ROUTE_LIQUIDITY_POOLS}`)
            ),
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

      render: ({ item }) => reduceBalance(item.reserves[0]),
    },
    {
      name: '24h Volume',
      width: 160,
      render: ({ item }) => console.log('item', item),
    },

    {
      name: 'Fees',
      width: 160,
      render: ({ item }) => '',
    },

    {
      name: 'Rewards Booster',
      width: 160,
      render: ({ item }) => 'Coming Soon',
    },
    {
      name: 'APR',
      width: 160,
      render: ({ item }) => 'Coming Soon',
    },
  ];
};
