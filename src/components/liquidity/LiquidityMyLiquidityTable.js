/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAccountContext, usePactContext } from '../../contexts';
import { useErrorState } from '../../hooks/useErrorState';
import { getPairListAccountBalance } from '../../api/pact';
import { AddIcon, RemoveIcon } from '../../assets';
import tokenData from '../../constants/cryptoCurrencies';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED, ROUTE_LIQUIDITY_MY_LIQUIDITY, ROUTE_LIQUIDITY_REMOVE_LIQUIDITY } from '../../router/routes';
import { extractDecimal, getDecimalPlaces, humanReadableNumber } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';

const LiquidityMyLiquidityTable = () => {
  const history = useHistory();
  const { account } = useAccountContext();
  const { tokensUsdPrice } = usePactContext();
  const [pairList, setPairList] = useErrorState([], true);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const result = await getPairListAccountBalance(account.account);

    if (!result.errorMessage) {
      const resultWithLiquidity = result?.filter((r) => extractDecimal(r.pooledAmount[0]) !== 0 && extractDecimal(r.pooledAmount[1]) !== 0);
      let allData = [];
      for (const res of resultWithLiquidity) {
        allData.push({
          ...res,
          pooledAmountToken0: extractDecimal(res.pooledAmount[0]),
          pooledAmountToken1: extractDecimal(res.pooledAmount[1]),
        });
      }

      setPairList(allData);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (account.account) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [account.account]);

  return !loading ? (
    !account.account ? (
      <Label className="justify-ce">Please connect your wallet to see your liquidity. </Label>
    ) : pairList.length === 0 ? (
      <Label className="justify-ce">Your active Kaddex liquidity positions will appear here.</Label>
    ) : (
      <div className="column">
        <div className="flex justify-fs" style={{ marginBottom: 16 }}>
          <Label fontSize={16} fontFamily="syncopate">
            MY LIQUIDITY
          </Label>
        </div>
        <CommonTable
          items={pairList}
          columns={renderColumns(tokensUsdPrice)}
          actions={[
            {
              icon: () => <AddIcon />,
              onClick: (item) =>
                history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED.concat(`?token0=${item.token0}&token1=${item.token1}`), {
                  from: ROUTE_LIQUIDITY_MY_LIQUIDITY,
                }),
            },
            {
              disabled: (item) => item.pooledAmount[0] === 0 || item.pooledAmount[1] === 0,
              icon: () => <RemoveIcon />,
              onClick: (item) => {
                const { token0, token1 } = item;
                history.push(ROUTE_LIQUIDITY_REMOVE_LIQUIDITY.concat(`?token0=${token0}&token1=${token1}`), { from: ROUTE_LIQUIDITY_MY_LIQUIDITY });
              },
            },
          ]}
        />
      </div>
    )
  ) : (
    <AppLoader containerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} />
  );
};

export default LiquidityMyLiquidityTable;
const renderColumns = (tokensUsdPrice) => {
  return [
    {
      name: '',
      width: 160,
      render: ({ item }) => (
        <FlexContainer className="align-ce">
          <CryptoContainer style={{ zIndex: 2 }}>{tokenData[item.token0].icon} </CryptoContainer>
          <CryptoContainer style={{ marginLeft: -12, zIndex: 1 }}> {tokenData[item.token1].icon}</CryptoContainer>
          {item.token0}/{item.token1}
        </FlexContainer>
      ),
    },
    {
      name: 'Token A',
      sortBy: 'pooledAmountToken0',
      width: 160,
      render: ({ item }) => (
        <div className="column flex">
          <Label>
            {getDecimalPlaces(item.pooledAmountToken0)} {item.token0}
          </Label>
          {tokensUsdPrice ? (
            <Label fontSize={11} labelStyle={{ marginTop: 4, opacity: 0.7 }}>
              $ {humanReadableNumber(tokensUsdPrice?.[item.token0] * item?.pooledAmountToken0)}
            </Label>
          ) : (
            ''
          )}
        </div>
      ),
    },

    {
      name: 'Token B',
      width: 160,
      sortBy: 'pooledAmountToken1',
      render: ({ item }) => (
        <div className="column flex">
          <Label>
            {getDecimalPlaces(item?.pooledAmountToken1)} {item.token1}
          </Label>
          {tokensUsdPrice ? (
            <Label fontSize={11} labelStyle={{ marginTop: 4, opacity: 0.7 }}>
              $ {humanReadableNumber(tokensUsdPrice?.[item.token1] * item?.pooledAmountToken1)}
            </Label>
          ) : (
            ''
          )}
        </div>
      ),
    },

    {
      name: 'My Pool Share',
      width: 160,
      sortBy: 'poolShare',
      render: ({ item }) => {
        return item.poolShare >= 0
          ? `${(item?.poolShare * 100).toPrecision(4)} %`
          : `${((extractDecimal(item.balance) / extractDecimal(item.supply)) * 100).toPrecision(4)} %`;
      },
    },
  ];
};
