/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { getDailyVolume } from '../../api/kaddex-stats';
import { getPairList } from '../../api/pact-pair';
import { chainId, NETWORK_TYPE } from '../../constants/contextConstants';
import tokenData from '../../constants/cryptoCurrencies';
import { useErrorState } from '../../hooks/useErrorState';
import { reduceBalance } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';

const LiquidityPoolsTable = () => {
  const [pairList, setPairList] = useErrorState([], true);
  const [loading, setLoading] = useState(false);
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
    />
  ) : (
    <AppLoader containerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} />
  );
};

export default LiquidityPoolsTable;
