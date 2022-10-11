/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useErrorState } from '../../hooks/useErrorState';
import { humanReadableNumber } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import { AddIcon, BoosterIcon, GasIcon, VerifiedLogo } from '../../assets';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED, ROUTE_LIQUIDITY_POOLS } from '../../router/routes';
import Label from '../shared/Label';
import { getAllPairsData } from '../../utils/token-utils';
import { theme, commonColors } from '../../styles/theme';
import { usePactContext } from '../../contexts';
import useWindowSize from '../../hooks/useWindowSize';

const LiquidityPoolsTable = () => {
  const history = useHistory();
  const { enableGasStation, tokensUsdPrice, allTokens, allPairs } = usePactContext();

  const [pairList, setPairList] = useErrorState([], true);
  const [loading, setLoading] = useState(false);
  const [width] = useWindowSize();

  const fetchData = async () => {
    const pairsData = await getAllPairsData(tokensUsdPrice, allTokens, allPairs);
    setPairList(pairsData.sort((x, y) => y.liquidityUsd - x.liquidityUsd));
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    if (tokensUsdPrice) fetchData();
  }, [tokensUsdPrice]);

  return !loading ? (
    <CommonTable
      items={pairList}
      columns={
        enableGasStation ? renderColumns(allTokens, allPairs, width) : renderColumns(allTokens, allPairs, width).filter((x) => x.name !== 'Fees')
      }
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

const renderColumns = (allTokens, allPairs, width) => {
  return [
    {
      name: '',
      width: width <= theme().mediaQueries.mobilePixel ? 80 : 160,
      render: ({ item }) => {
        let t0 = item.token0 === 'KDA' ? item.token0 : item.token1;
        let t1 = item.token1 !== 'KDA' ? item.token1 : item.token0;
        return (
          <FlexContainer desktopClassName="align-ce" tabletClassName="align-ce" mobileClassName="column align-fs" mobilePixel={769}>
            <div className="flex align-ce">
              {allPairs[item.name]?.isVerified ? (
                <div style={{ marginRight: 16 }}>
                  <VerifiedLogo className="svg-app-color" />
                </div>
              ) : (
                <div style={{ width: 32 }} />
              )}
              <CryptoContainer style={{ zIndex: 2 }}> {allTokens[t0].icon}</CryptoContainer>
              <CryptoContainer style={{ marginLeft: -12, zIndex: 1 }}>{allTokens[t1].icon} </CryptoContainer>
            </div>
            <div
              className="align-fs flex"
              style={{
                marginLeft: width <= theme().mediaQueries.mobilePixel && 32,
                marginTop: width <= theme().mediaQueries.mobilePixel && 4,
              }}
            >
              {t0}/{t1}
            </div>
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
      width: 100,
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
      width: 100,
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
      width: 100,
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
