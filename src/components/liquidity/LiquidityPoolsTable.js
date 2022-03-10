/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import { getDailyVolume } from '../../api/kaddex-stats';
import { NETWORK_TYPE } from '../../constants/contextConstants';
import tokenData from '../../constants/cryptoCurrencies';
import { PactContext } from '../../contexts/PactContext';
import { reduceBalance } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';

const LiquidityPoolsTable = () => {
  const pact = useContext(PactContext);

  const renderColumns = () => {
    return [
      {
        name: 'name',
        width: 160,
        render: ({ item }) => (
          <FlexContainer className="align-ce">
            {console.log('item', item)}
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
        render: ({ item }) => '',
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
    await pact.getPairList();
    const data = await getDailyVolume();
    console.log('data', data);

    console.log('pair list', pact.pairList);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return pact.pairList?.[0] ? (
    <CommonTable
      items={Object.values(pact.pairList)}
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
