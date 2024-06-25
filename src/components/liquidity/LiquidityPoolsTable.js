/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useErrorState } from '../../hooks/useErrorState';
import { humanReadableNumber } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import { AddIcon, BoosterIcon, GasIcon, TradeUpIcon, VerifiedLogo } from '../../assets';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED, ROUTE_LIQUIDITY_POOLS, ROUTE_POOL_INFO } from '../../router/routes';
import Label from '../shared/Label';
import { getAllPairsData } from '../../utils/token-utils';
import { theme, commonColors } from '../../styles/theme';
import { useApplicationContext, usePactContext } from '../../contexts';
import useWindowSize from '../../hooks/useWindowSize';
import styled from 'styled-components';
import Search from '../shared/Search';

const LiquidityPoolsTable = ({ verifiedActive }) => {
  const history = useHistory();
  const { enableGasStation, tokensUsdPrice, allTokens, allPairs } = usePactContext();

  const [verifiedPairList, setVerifiedPairList] = useErrorState([], true);
  const [loading, setLoading] = useState(false);
  const [allPairList, setAllPairList] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const { themeMode } = useApplicationContext();

  const [width] = useWindowSize();

  const fetchData = async () => {
    const pairsDataInfo = await getAllPairsData(tokensUsdPrice, allTokens, allPairs);
    const verifiedPairsData = pairsDataInfo.filter((res) => res.isVerified);
    setAllPairList(pairsDataInfo.sort((x, y) => y.liquidityUsd - x.liquidityUsd));
    setVerifiedPairList(verifiedPairsData.sort((x, y) => y.liquidityUsd - x.liquidityUsd));
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    if (tokensUsdPrice) fetchData();
  }, [tokensUsdPrice]);

  const pairList = Object.values(verifiedActive ? verifiedPairList : allPairList).filter((c) => {
    const firstToken = c.name.split(':')[0];
    const secondToken = c.name.split(':')[1];

    const codeFirstToken = firstToken !== 'coin' ? firstToken.split('.')[1] : firstToken;
    const codeSecondToken = secondToken !== 'coin' ? secondToken.split('.')[1] : secondToken;

    return (
      codeFirstToken.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
      codeSecondToken.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
      c.token0.toLowerCase().includes(searchValue?.toLowerCase()) ||
      c.token1.toLowerCase().includes(searchValue?.toLowerCase())
    );
  });

  return !loading ? (
    <>
      <CommonTable
        items={pairList}
        columns={renderColumns(history, allTokens, allPairs, width, searchValue, setSearchValue)}
        actions={[
          {
            icon: () => <AddIcon />,
            onClick: (item) =>
              history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED.concat(`?token0=${item.token1}&token1=${item.token0}`), {
                from: ROUTE_LIQUIDITY_POOLS,
              }),
          },
          {
            icon: () => (
              <FlexContainer
                className="align-ce"
                style={{
                  background: theme(themeMode).colors.white,
                  padding: '8px 4px',
                  borderRadius: 100,
                  width: 24,
                  height: 24,
                }}
              >
                <TradeUpIcon className="svg-app-inverted-color" />
              </FlexContainer>
            ),
            onClick: (item) => {
              history.push(ROUTE_POOL_INFO.replace(':pool', `${item.token0}:${item.token1}`), { from: history.location.pathname });
            },
          },
        ]}
      />
    </>
  ) : (
    <AppLoader containerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} />
  );
};

export default LiquidityPoolsTable;

const ScalableCryptoContainer = styled(FlexContainer)`
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  :hover {
    transform: scale(1.18);
  }
`;

const renderColumns = (history, allTokens, allPairs, width, searchValue, setSearchValue) => {
  return [
    {
      name: (
        <Search
          containerStyle={{
            marginBottom: '-10px',
            marginTop: '-8px',
            border: 'none',
            width: '100px',
          }}
          iconFirst
          fluid
          placeholder="Search"
          value={searchValue}
          onChange={(e, { value }) => setSearchValue(value)}
        />
      ),
      width: width <= theme().mediaQueries.mobilePixel ? 80 : 160,

      render: ({ item }) => {
        let t0 = null;
        let t1 = null;
        if (item.token0 !== 'KDA' && item.token1 !== 'KDA') {
          t0 = item.token0;
          t1 = item.token1;
        } else {
          t0 = item.token0 === 'KDA' ? item.token0 : item.token1;
          t1 = item.token1 === 'KDA' ? item.token0 : item.token1;
        }

        return (
          <ScalableCryptoContainer
            desktopClassName="align-ce"
            tabletClassName="align-ce"
            mobileClassName="column align-fs"
            mobilePixel={769}
            onClick={() => history.push(ROUTE_POOL_INFO.replace(':pool', `${t0}:${t1}`), { from: history.location.pathname })}
          >
            <div className="flex align-ce">
              {allPairs[item.name]?.isVerified ? (
                <div style={{ marginRight: 16 }}>
                  <VerifiedLogo className="svg-app-color" />
                </div>
              ) : (
                <div style={{ width: 32 }} />
              )}
              <CryptoContainer style={{ zIndex: 2 }}> {allTokens[t1].icon}</CryptoContainer>
              <CryptoContainer style={{ marginLeft: -12, zIndex: 1 }} size={30}>
                {allTokens[t0].icon}{' '}
              </CryptoContainer>
            </div>
            <div
              className="align-fs flex"
              style={{
                marginLeft: width <= theme().mediaQueries.mobilePixel && 32,
                marginTop: width <= theme().mediaQueries.mobilePixel && 4,
              }}
            >
              {t1}/{t0}
            </div>
          </ScalableCryptoContainer>
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
