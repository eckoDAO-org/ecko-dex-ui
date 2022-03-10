/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import tokenData from '../../constants/cryptoCurrencies';
import { AccountContext } from '../../contexts/AccountContext';
import { LiquidityContext } from '../../contexts/LiquidityContext';
import { extractDecimal, pairUnit, reduceBalance } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';

const LiquidityMyLiquidityTable = () => {
  const liquidity = useContext(LiquidityContext);
  const { account } = useContext(AccountContext);

  useEffect(() => {
    if (account.account) {
      liquidity.getPairListAccountBalance(account.account);
    }
  }, [account.account]);

  const renderColumns = () => {
    return [
      {
        name: 'name',
        width: 160,
        render: ({ item }) => (
          <FlexContainer className="align-ce">
            {console.log('item', item)}
            <CryptoContainer style={{ zIndex: 2 }}>{tokenData[item.token0].icon} </CryptoContainer>
            <CryptoContainer style={{ marginLeft: -12, zIndex: 1 }}> {tokenData[item.token1].icon}</CryptoContainer>
            {item.token0}/{item.token1}
          </FlexContainer>
        ),
      },
      {
        name: 'My Pool Tokens',
        width: 160,

        render: ({ item }) => pairUnit(extractDecimal(item.balance)),
      },
      {
        name: 'Pooled Token 1',
        width: 160,
        render: ({ item }) => `${pairUnit(extractDecimal(item.pooledAmount[0]))} ${item.token0}`,
      },

      {
        name: 'Pooled Token 2',
        width: 160,
        render: ({ item }) => `${pairUnit(extractDecimal(item.pooledAmount[1]))} ${item.token1}`,
      },

      {
        name: 'My Pool Share',
        width: 160,
        render: ({ item }) => `${((extractDecimal(item.balance) / extractDecimal(item.supply)) * 100).toPrecision(4)} %`,
      },
    ];
  };

  return !liquidity.loadingLiquidity ? (
    <CommonTable items={Object.values(liquidity.pairListAccount)} columns={renderColumns()} />
  ) : (
    <AppLoader containerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} />
  );
};

export default LiquidityMyLiquidityTable;
