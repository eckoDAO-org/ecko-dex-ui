import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getDailyVolume } from '../../api/kaddex-stats';
import { getPairList } from '../../api/pact-pair';
import CommonTable from '../shared/CommonTable';
import tokenData from '../../constants/cryptoCurrencies';
import { humanReadableNumber, reduceBalance } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import { AddIcon, GasIcon } from '../../assets';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED, ROUTE_LIQUIDITY_TOKENS } from '../../router/routes';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import { get24HTokenVolume, getAllApr, getUsdTokenLiquidity, getUsdTokenPrice } from '../../utils/token-utils';

const LiquidityTokensTable = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState([]);

  const fetchData = async () => {
    const resultPairList = await getPairList();
    const volumes = await getDailyVolume();

    const tokens = Object.values(tokenData);

    // calculate all apr for each pair
    const aprs = await getAllApr(resultPairList, volumes);
    const result = [];

    // calculate sum of liquidity in usd and volumes in usd for each token in each pair
    for (const token of tokens) {
      let tokenUsdPrice = await getUsdTokenPrice(token.coingeckoName);

      const tokenPairs = resultPairList.filter((p) => p.token0 === token.name || p.token1 === token.name);
      let volume24HUsd = 0;
      let liquidity = 0;
      for (const tokenPair of tokenPairs) {
        volume24HUsd += get24HTokenVolume(volumes, token.tokenNameKaddexStats, tokenUsdPrice).volume24HUsd;
        liquidity += token.name === tokenPair.token0 ? reduceBalance(tokenPair.reserves[0]) : tokenPair.reserves[1];
      }

      const liquidityUSD = await getUsdTokenLiquidity(token.coingeckoName, liquidity, tokenUsdPrice);

      // filter all apr that contains the token in at least one side of the pair
      const filteredApr = aprs.filter((a) => a.token0 === token.name || a.token1 === token.name);
      // get the highest apr for filtered apr
      const highestApr = Math.max([...filteredApr].map((apr) => apr.value));

      result.push({ ...token, volume24HUsd, apr: highestApr, liquidityUSD });
    }
    console.log('aprs', aprs);
    setTokens(result);
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  return !loading ? (
    <CommonTable
      items={tokens}
      columns={renderColumns()}
      actions={[
        {
          icon: <AddIcon />,
          onClick: (item) =>
            history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED.concat(`?token0=${item.token0}`), {
              from: ROUTE_LIQUIDITY_TOKENS,
            }),
        },
      ]}
    />
  ) : (
    <AppLoader containerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} />
  );
};

export default LiquidityTokensTable;

const renderColumns = () => {
  return [
    {
      name: 'name',
      width: 160,
      render: ({ item }) => (
        <FlexContainer className="align-ce">
          <CryptoContainer style={{ zIndex: 2 }}> {tokenData[item.name].icon}</CryptoContainer>
          {item.name}
        </FlexContainer>
      ),
    },
    {
      name: 'liquidity',
      width: 160,

      render: ({ item }) => {
        return `$ ${humanReadableNumber(item.liquidityUSD)}`;
      },
    },
    {
      name: '24h Volume',
      width: 160,
      render: ({ item }) => `$ ${humanReadableNumber(item.volume24HUsd)}`,
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
