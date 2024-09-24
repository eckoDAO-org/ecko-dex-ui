/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAccountContext, usePactContext } from '../../contexts';
import { useErrorState } from '../../hooks/useErrorState';
import { getPairList, getPairListAccountBalance } from '../../api/pact';
import { AddIcon, RemoveIcon, VerifiedLogo } from '../../assets';
import {
  ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED,
  ROUTE_LIQUIDITY_MY_LIQUIDITY,
  ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_DOUBLE_SIDED,
} from '../../router/routes';
import { extractDecimal, getDecimalPlaces, humanReadableNumber } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import useWindowSize from '../../hooks/useWindowSize';
import { theme } from '../../styles/theme';

const LiquidityMyLiquidityTable = () => {
  const history = useHistory();
  const { account } = useAccountContext();
  const { tokensUsdPrice, allTokens, allPairs } = usePactContext();
  const [pairList, setPairList] = useErrorState([], true);
  const [loading, setLoading] = useState(true);
  const [width] = useWindowSize();

  const fetchData = async () => {
    const pairs = await getPairList(allPairs);
    const result = await getPairListAccountBalance(
      account.account,
      pairs.filter((x) => x.reserves[0] !== 0)
    );
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
    if (account.account && allPairs) {
      setLoading(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, [account.account, allPairs]);

  return !loading ? (
    !account.account ? (
      <Label className="justify-ce">Please connect your wallet to see your liquidity. </Label>
    ) : pairList.length === 0 ? (
      <Label className="justify-ce">Your active Mercatus liquidity positions will appear here.</Label>
    ) : (
      <div className="column">
        <div className="flex justify-fs" style={{ marginBottom: 16 }}>
          <Label fontSize={16} fontFamily="syncopate">
            MY LIQUIDITY
          </Label>
        </div>
        <CommonTable
          items={pairList}
          columns={renderColumns(tokensUsdPrice, allTokens, allPairs, width)}
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
                history.push(ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_DOUBLE_SIDED.concat(`?token0=${token0}&token1=${token1}`), {
                  from: ROUTE_LIQUIDITY_MY_LIQUIDITY,
                });
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
const renderColumns = (tokensUsdPrice, allTokens, allPairs, width) => {
  return [
    {
      name: '',
      width: width <= theme().mediaQueries.mobilePixel ? 80 : 160,
      render: ({ item }) => {
        return <FlexContainer desktopClassName="align-ce" tabletClassName="align-ce" mobileClassName="column align-fs" mobilePixel={769}>
          <div className="flex align-ce">

            <CryptoContainer style={{ zIndex: 2 }}> <img alt="" src={allTokens[item.token0_code].icon} style={{ width: 20, height: 20, marginRight: '8px' }} /></CryptoContainer>
            <CryptoContainer style={{ marginLeft: -12, zIndex: 1 }}>  <img alt="" src={allTokens[item.token1_code].icon} style={{ width: 20, height: 20, marginRight: '8px' }} /> </CryptoContainer>
          </div>
          <div
            className="align-fs flex"
            style={{
              marginLeft: width <= theme().mediaQueries.mobilePixel && 32,
              marginTop: width <= theme().mediaQueries.mobilePixel && 4,
            }}
          >
            {item.token0}/{item.token1}
          </div>
        </FlexContainer>
      },
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
              $ {humanReadableNumber(tokensUsdPrice?.[item.token0_code] * item?.pooledAmountToken0)}
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
              $ {humanReadableNumber(tokensUsdPrice?.[item.token1_code] * item?.pooledAmountToken1)}
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
