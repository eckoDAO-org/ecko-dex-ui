import React, { useCallback, useEffect, useRef, useState } from 'react';
import { commonColors, commonTheme, theme } from '../styles/theme';
import { CryptoContainer, FlexContainer } from '../components/shared/FlexContainer';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useApplicationContext, usePactContext } from '../contexts';
import Label from '../components/shared/Label';
import { getAnalyticsDexscanPoolDetails, getAnalyticsDexscanPoolTransactions } from '../api/kaddex-analytics';
import AppLoader from '../components/shared/AppLoader';
import {
  ArrowBack,
  DiscordLogoIcon,
  GithubLogoIcon,
  KadenaExplorerLogo,
  TelegramLogoIcon,
  TwitterLogoIcon,
  UnmarshalLogo,
  VerifiedBoldLogo,
  WebsiteLogoIcon,
} from '../assets';
import CustomButton from '../components/shared/CustomButton';
import { ButtonContent } from 'semantic-ui-react';
import { humanReadableNumber } from '../utils/reduceBalance';
import GraphicPercentage from '../components/shared/GraphicPercentage';
import TradingViewChart from '../components/charts/TradingViewChart';
import CommonTable from '../components/shared/CommonTable';
import { convertUTCToSecond } from '../utils/time-utils';
import { shortenAddress } from '../utils/string-utils';
import moment from 'moment';
import { ROUTE_ANALYTICS_STATS, ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED, ROUTE_SWAP } from '../router/routes';
import Banner from '../components/layout/header/Banner';
import DecimalFormatted from '../components/shared/DecimalFormatted';

const formatPrice = (price, precision = 3) => {
  return `$ ${humanReadableNumber(price, 3) !== '0.000' ? humanReadableNumber(price, 3) : price.toFixed(precision)}`;
};

const formatSupplyInfo = (supply, token) => {
  if (supply === 0) {
    return '-';
  }

  return `${humanReadableNumber(supply)} ${token}`;
};

const formatMarketCapInfo = (supply, currentPrice) => {
  if (supply === 0) {
    return '-';
  }

  return `$ ${humanReadableNumber(supply * currentPrice)}`;
};

// Map of social key to logo icon
const socialIcons = {
  website: WebsiteLogoIcon,
  twitter: TwitterLogoIcon,
  discord: DiscordLogoIcon,
  telegram: TelegramLogoIcon,
  github: GithubLogoIcon,
};

const REFRESH_INTERVAL_IN_MS = 30000; // 30 seconds

const getSocialElement = (social) => {
  const Element = socialIcons[social.type];

  let style = { height: '24px', width: '24px' };

  if (social.type === 'github') {
    style = { ...style, color: 'white' };
  }

  return (
    <a key={social.type} href={social.url} target="_blank" rel="noopener noreferrer">
      <Element style={style} />
    </a>
  );
};

const formatTransactions = (transactions) => {
  return transactions.map((txn) => ({
    ...txn,
    timestampInSeconds: convertUTCToSecond(txn.timestamp),
    token0Amount: txn.token0.amount,
    token1Amount: txn.token1.amount,
  }));
};

const PoolInfoContainer = () => {
  const history = useHistory();
  const { pool } = useParams();
  const { pathname, state } = useLocation();
  const pact = usePactContext();
  const { themeMode } = useApplicationContext();
  const [poolDetails, setPoolDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingMoreTxns, setIsLoadingMoreTxns] = useState(false);
  const [firstTxnTime, setFirstTxnTime] = useState();
  const [lastTxnTime, setLastTxnTime] = useState();
  const [fromLocation, setFromLocation] = useState();
  const [hasErrors, setHasErrors] = useState(false);
  const timerRef = useRef(null);

  // Function to refresh pool details and transactions data
  const refreshData = useCallback(async () => {
    if (firstTxnTime) {
      const latestTxn = formatTransactions(await getAnalyticsDexscanPoolTransactions(pool, firstTxnTime));

      if (latestTxn.length > 0) {
        setFirstTxnTime(latestTxn[0].timestampInSeconds);
        setTransactions((prev) => [...latestTxn, ...prev]);
      }
    }

    const poolDetails = getAnalyticsDexscanPoolDetails(pool);
    setPoolDetails((prev) => ({ ...prev, ...poolDetails }));
  }, [pool, firstTxnTime]);

  // Update the previous page for back navigation
  useEffect(() => {
    const locationState = state?.from;

    if (locationState) {
      setFromLocation(locationState);
    }
  }, [state]);

  // Set initial data
  useEffect(() => {
    const setInitData = async () => {
      try {
        if (pact?.tokensUsdPrice) {
          const [dexscanPoolDetails, dexscanPoolTransactions] = await Promise.all([
            getAnalyticsDexscanPoolDetails(pool),
            getAnalyticsDexscanPoolTransactions(pool),
          ]);

          const pairInfo = pact.allPairs[`${dexscanPoolDetails.token1.address}:${dexscanPoolDetails.token0.address}`];
          const token0Info = pact.allTokens[dexscanPoolDetails.token0.name];
          const token1Info = pact.allTokens[dexscanPoolDetails.token1.name];

          const data = {
            token0Info,
            token1Info,
            ...pairInfo,
            ...dexscanPoolDetails,
          };

          const formattedTransactions = formatTransactions(dexscanPoolTransactions);

          setFirstTxnTime(formattedTransactions[0].timestampInSeconds);
          setLastTxnTime(formattedTransactions[formattedTransactions.length - 1].timestampInSeconds);

          setPoolDetails(data);
          setTransactions(formattedTransactions);
          setLoading(false);
        }
      } catch (error) {
        setHasErrors(true);
        setLoading(false);
      }
    };

    setInitData();
  }, [pact.allPairs, pact.allTokens, pact?.tokensUsdPrice, pool]);

  // Set interval for data refresh
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(async () => await refreshData(), REFRESH_INTERVAL_IN_MS);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [refreshData]);

  // Function to load older transactions
  const loadMoreTransactions = async () => {
    setIsLoadingMoreTxns(true);

    const olderTxns = formatTransactions(await getAnalyticsDexscanPoolTransactions(pool, undefined, lastTxnTime));

    setLastTxnTime(olderTxns[olderTxns.length - 1].timestampInSeconds);

    setTransactions((prev) => [...prev, ...olderTxns]);
    setIsLoadingMoreTxns(false);
  };

  if (loading) {
    return <AppLoader className="h-100 w-100 align-ce justify-ce" />;
  }

  if (hasErrors) {
    return (
      <div className="flex h-100 align-ce justify-ce">
        <Banner
          position="center"
          text={`Temporarily Unavailable: The ${pool.replace(
            ':',
            '/'
          )} pool analytics page is currently down for maintenance. We're working to restore it promptly.`}
        />
      </div>
    );
  }

  const header = (
    <FlexContainer className="w-100 align-ce justify-sb">
      <div className="flex w-100 align-ce">
        <ArrowBack
          className="arrow-back svg-app-color"
          style={{
            cursor: 'pointer',
            marginRight: '16px',
            justifyContent: 'center',
          }}
          onClick={() => history.push(fromLocation || ROUTE_ANALYTICS_STATS)}
        />
        <CryptoContainer style={{ marginRight: 8 }}>{poolDetails.token0Info.icon}</CryptoContainer>
        <Label fontSize={24} fontFamily="syncopate" style={{ whiteSpace: 'nowrap' }}>
          <span>{`${poolDetails.token0.name}`}</span>
          <span style={{ padding: '0 8px', color: commonColors.gameEditionBlueGrey }}>/</span>
          <span style={{ color: commonColors.gameEditionBlueGrey }}>{poolDetails.token1.name}</span>
        </Label>
      </div>
      {!poolDetails.token0Info.isVerified && (
        <CustomButton
          fontSize={13}
          buttonStyle={{ height: 33, width: 'min-content' }}
          type={'secondary'}
          fontFamily="syncopate"
          onClick={() =>
            window.open(
              `https://docs.google.com/forms/d/e/1FAIpQLSfb_1LIY594I87WotLwD8SzmOte9gc9KT4_2y5z6ot5Wv46nw/viewform`,
              '_blank',
              'noopener,noreferrer'
            )
          }
        >
          <ButtonContent color={commonColors.white} className="flex">
            <VerifiedBoldLogo className={'svg-app-inverted-color'} />
            <Label fontFamily="syncopate" color={theme(themeMode).colors.primary} labelStyle={{ marginTop: 1 }}>
              VERIFY
            </Label>
          </ButtonContent>
        </CustomButton>
      )}
    </FlexContainer>
  );

  const tokenPriceWidget = (
    <FlexContainer withGradient gap={8} className="relative column background-fill w-100" style={{ padding: 32, zIndex: 1 }}>
      <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
        Price
      </Label>
      <Label fontSize={32}>{formatPrice(poolDetails.price, poolDetails.token0Info.precision)}</Label>
      <FlexContainer gap={16}>
        <FlexContainer gap={8}>
          <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
            24H
          </Label>
          <GraphicPercentage componentStyle={{ margin: 0 }} percentageValue={poolDetails.pricePercChange24h * 100} />
        </FlexContainer>
        <FlexContainer gap={8}>
          <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
            7D
          </Label>
          <GraphicPercentage componentStyle={{ margin: 0 }} percentageValue={poolDetails.pricePercChange7d * 100} />
        </FlexContainer>
      </FlexContainer>
      <FlexContainer gap={12} className="column" style={{ marginTop: '16px' }}>
        <FlexContainer gap={4} className="column">
          <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
            24H Volume
          </Label>
          <Label fontSize={14}>$ {humanReadableNumber(poolDetails.volume24h)}</Label>
        </FlexContainer>
        <FlexContainer gap={4} className="column">
          <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
            All Time Low
          </Label>
          <Label fontSize={14}>{formatPrice(poolDetails.allTimeLow, poolDetails.token0Info.precision)}</Label>
        </FlexContainer>
        <FlexContainer gap={4} className="column">
          <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
            All Time High
          </Label>
          <Label fontSize={14}>{formatPrice(poolDetails.allTimeHigh, poolDetails.token0Info.precision)}</Label>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );

  const tokenDetailsWidget = (
    <FlexContainer withGradient gap={12} className="relative column background-fill w-100" style={{ padding: 32, zIndex: 1 }}>
      <Label fontSize={16}>Token Details</Label>
      <FlexContainer gap={6}>{poolDetails.socials.map((social) => getSocialElement(social))}</FlexContainer>
      <FlexContainer gap={4} className="column">
        <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
          Market Cap
        </Label>
        <Label fontSize={14}>{formatMarketCapInfo(poolDetails.circulatingSupply, poolDetails.price)}</Label>
      </FlexContainer>
      <FlexContainer gap={4} className="column">
        <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
          Fully Diluted Market Cap
        </Label>
        <Label fontSize={14}>{formatMarketCapInfo(poolDetails.totalSupply, poolDetails.price)}</Label>
      </FlexContainer>
      <FlexContainer gap={4} className="column">
        <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
          Circulating Supply
        </Label>
        <Label fontSize={14}>{formatSupplyInfo(poolDetails.circulatingSupply, poolDetails.token0.name)}</Label>
      </FlexContainer>
      <FlexContainer gap={4} className="column">
        <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
          Total Supply
        </Label>
        <Label fontSize={14}>{formatSupplyInfo(poolDetails.totalSupply, poolDetails.token0.name)}</Label>
      </FlexContainer>
    </FlexContainer>
  );

  const actionButtons = (
    <>
      <CustomButton
        fontSize={13}
        buttonStyle={{ height: 33, width: 200 }}
        type="secondary"
        fontFamily="syncopate"
        onClick={() => history.push(ROUTE_SWAP.concat(`?token0=${poolDetails.token1.name}&token1=${poolDetails.token0.name}`), { from: pathname })}
      >
        SWAP
      </CustomButton>
      <CustomButton
        fontSize={13}
        buttonStyle={{ height: 33, width: 200 }}
        type="secondary"
        fontFamily="syncopate"
        onClick={() =>
          history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED.concat(`?token0=${poolDetails.token0.name}&token1=${poolDetails.token1.name}`), {
            from: pathname,
          })
        }
      >
        ADD LIQUIDITY
      </CustomButton>
    </>
  );

  const transactionsTable = (
    <div style={{ fontFamily: commonTheme.fontFamily.regular }}>
      <CommonTable
        items={transactions}
        columns={renderColumns(history, poolDetails)}
        wantPagination
        hasMore={true}
        loading={isLoadingMoreTxns}
        offset={8}
        loadMore={async () => {
          await loadMoreTransactions();
        }}
        cellPadding={12}
      />
    </div>
  );

  return (
    <FlexContainer
      className="column w-100 main"
      gap={24}
      desktopStyle={{ paddingRight: commonTheme.layout.desktopPadding, paddingLeft: commonTheme.layout.desktopPadding }}
      tabletStyle={{ paddingRight: commonTheme.layout.tabletPadding, paddingLeft: commonTheme.layout.tabletPadding }}
      mobileStyle={{ paddingRight: commonTheme.layout.mobilePadding, paddingLeft: commonTheme.layout.mobilePadding }}
    >
      {header}
      <FlexContainer gap={16} className="w-100 justify-sb" tabletClassName="column" mobileClassName="column">
        {tokenPriceWidget}
        {tokenDetailsWidget}
      </FlexContainer>
      <FlexContainer className="w-100" mobileClassName="justify-ce" tabletClassName="justify-fe" desktopClassName="justify-fe" gap={8}>
        {actionButtons}
      </FlexContainer>
      <FlexContainer withGradient className="w-100 justify-sb relative column background-fill" style={{ height: 600, zIndex: 1, padding: 0 }}>
        <TradingViewChart symbol={poolDetails.symbol} />
      </FlexContainer>
      {transactionsTable}
    </FlexContainer>
  );
};

export default PoolInfoContainer;

const getColor = (item) => {
  if (item.type === 'BUY') {
    return '#9ce29c';
  } else {
    return '#f79898';
  }
};

export const getExplorerLink = (item) => {
  const unmarshalUrl = `https://xscan.io/transactions/${item.requestkey}?chain=kadena`;
  const kadenaExplorerUrl = `https://explorer.chainweb.com/mainnet/tx/${item.requestkey}`;

  const unmarshalLink = (
    <a href={unmarshalUrl} target="_blank" rel="noopener noreferrer">
      <UnmarshalLogo style={{ cursor: 'pointer', width: 24, height: 24 }} />
    </a>
  );

  const kadenaExplorerLink = (
    <a href={kadenaExplorerUrl} target="_blank" rel="noopener noreferrer">
      <KadenaExplorerLogo style={{ cursor: 'pointer', width: 18, height: 18 }} />
    </a>
  );

  return (
    <FlexContainer className="align-ce" gap={8}>
      {kadenaExplorerLink}
      {item.address.startsWith('k:') && unmarshalLink}
    </FlexContainer>
  );
};

const renderColumns = (history, poolDetails) => {
  return [
    {
      name: 'Transaction Date',
      width: 100,
      render: ({ item }) => (
        <FlexContainer className="align-ce">
          <Label color={getColor(item)} labelStyle={{ whiteSpace: 'nowrap' }}>
            {moment(new Date(item.timestamp)).format('yyyy-MM-DD HH:mm:ss')}
          </Label>
        </FlexContainer>
      ),
      sortBy: 'timestampInSeconds',
    },
    {
      name: 'Type',
      width: 100,
      render: ({ item }) => (
        <FlexContainer className="align-ce">
          <Label color={item.type === 'BUY' ? commonColors.green : commonColors.red}>{item.type}</Label>
        </FlexContainer>
      ),
      sortBy: 'type',
    },
    {
      name: 'Price',
      width: 100,
      render: ({ item }) => (
        <FlexContainer className="align-ce">
          <Label color={getColor(item)} labelStyle={{ whiteSpace: 'nowrap' }}>
            <DecimalFormatted value={item.price} />
          </Label>
        </FlexContainer>
      ),
      sortBy: 'price',
    },
    {
      name: poolDetails.token0.name,
      width: 100,
      render: ({ item }) => (
        <FlexContainer className="align-ce">
          <CryptoContainer size={32}>{poolDetails.token0Info.icon}</CryptoContainer>
          <Label color={getColor(item)}>{humanReadableNumber(item.token0Amount)}</Label>
        </FlexContainer>
      ),
      sortBy: 'token0Amount',
    },
    {
      name: poolDetails.token1.name,
      width: 100,
      render: ({ item }) => (
        <FlexContainer className="align-ce">
          <CryptoContainer size={28}>{poolDetails.token1Info.icon}</CryptoContainer>
          <Label color={getColor(item)}>{humanReadableNumber(item.token1Amount)}</Label>
        </FlexContainer>
      ),
      sortBy: 'token1Amount',
    },
    {
      name: 'Value',
      width: 100,
      render: ({ item }) => (
        <FlexContainer className="align-ce">
          <Label color={getColor(item)} labelStyle={{ whiteSpace: 'nowrap' }}>
            {formatPrice(item.amount)}
          </Label>
        </FlexContainer>
      ),
      sortBy: 'amount',
    },
    {
      name: 'Address',
      width: 100,
      render: ({ item }) => (
        <FlexContainer className="align-ce">
          <Label color={getColor(item)}>{shortenAddress(item.address)}</Label>
        </FlexContainer>
      ),
      sortBy: 'address',
    },
    {
      name: 'Explorer',
      width: 100,
      render: ({ item }) => getExplorerLink(item),
    },
  ];
};
