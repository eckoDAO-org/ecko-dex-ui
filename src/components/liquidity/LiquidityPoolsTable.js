/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useErrorState } from '../../hooks/useErrorState';
import { getGroupedVolume } from '../../api/kaddex-stats';
import { getPairList } from '../../api/pact';
import { extractDecimal, humanReadableNumber } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import { AddIcon, BoosterIcon, GasIcon } from '../../assets';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED, ROUTE_LIQUIDITY_POOLS } from '../../router/routes';
import Label from '../shared/Label';
import tokenData from '../../constants/cryptoCurrencies';
import { getAllPairValues } from '../../utils/token-utils';
import { getPairsMultiplier } from '../../api/liquidity-rewards';
import { commonColors } from '../../styles/theme';
import moment from 'moment';
import { usePactContext } from '../../contexts';

const LiquidityPoolsTable = () => {
  const history = useHistory();
  const pact = usePactContext();
  const [pairList, setPairList] = useErrorState([], true);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const pools = await getPairList();
    if (pools.length) {
      const volumes = await getGroupedVolume(moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate(), 'daily');

      const allPairValues = await getAllPairValues(pools, volumes);
      let allData = [];
      const multipliers = await getPairsMultiplier(pools);
      for (let i = 0; i < allPairValues.length; i++) {
        try {
          const multiplierObj = multipliers.find((x) => x.pair === allPairValues[i].name);

          if (multiplierObj) {
            allPairValues[i].multiplier = extractDecimal(multiplierObj.multiplier);
          } else {
            allPairValues[i].multiplier = 1;
          }
        } catch (error) {
          console.log('fetchData -> error', error);
          allPairValues[i].multiplier = 1;
        }
        let data = {
          ...allPairValues[i],
          apr: allPairValues[i].apr.value,
        };
        allData.push(data);
      }

      setPairList(allData);
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
      columns={pact.enableGasStation ? renderColumns() : renderColumns().filter((x) => x.name !== 'Fees')}
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
      render: ({ item }) => {
        let t0 = item.token0 === 'KDA' ? item.token0 : item.token1;
        let t1 = item.token1 !== 'KDA' ? item.token1 : item.token0;
        return (
          <FlexContainer className="align-ce">
            <CryptoContainer style={{ zIndex: 2 }}> {tokenData[t0].icon}</CryptoContainer>
            <CryptoContainer style={{ marginLeft: -12, zIndex: 1 }}>{tokenData[t1].icon} </CryptoContainer>
            {t0}/{t1}
          </FlexContainer>
        );
      },
    },
    {
      name: 'liquidity',
      width: 160,
      sortBy: 'liquidityUsd',
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
