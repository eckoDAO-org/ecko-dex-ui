import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import { commonColors, commonTheme} from '../../styles/theme';
import Label from '../shared/Label';
import moment from 'moment';
import { humanReadableNumber } from '../../utils/reduceBalance';
import  CommonTable from '../shared/CommonTable';
import DecimalFormatted from '../shared/DecimalFormatted';
import {DEFAULT_ICON_URL} from '../../constants/cryptoCurrencies';
import { shortenAddress } from '../../utils/string-utils';

import { convertUTCToSecond } from '../../utils/time-utils';

import {
  KadenaExplorerLogo,
  UnmarshalLogo,
} from '../../assets';

const getColor = (item) => {
  if (item.type === 'BUY') {
    return '#9ce29c';
  } else {
    return '#f79898';
  }
};

const REFRESH_INTERVAL_IN_MS = 30000; // 30 seconds

const formatPrice = (price, precision = 3, unit="$") => {
  return `${unit} ${humanReadableNumber(price, 3) !== '0.000' ? humanReadableNumber(price, 3) : price.toFixed(precision)}`;
};

export const getExplorerLink = (item) => {
  const unmarshalUrl = `https://xscan.io/transactions/${item.requestkey}?chain=kadena`;
  const kadenaExplorerUrl = `https://explorer.chainweb.com/mainnet/tx/${item.requestkey}`;
  const kadenaDetailsExplorerUrl = `https://explorer.chainweb.com/mainnet/txdetail/${item.requestkey}`;

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

  const kadenaDetailsExplorerLink = (
    <a href={kadenaDetailsExplorerUrl} target="_blank" rel="noopener noreferrer">
      <KadenaExplorerLogo style={{ cursor: 'pointer', width: 18, height: 18 }} />
    </a>
  );

  return (
    <FlexContainer className="align-ce" gap={8}>
      {kadenaExplorerLink}
      {kadenaDetailsExplorerLink}
      {item.address.startsWith('k:') && unmarshalLink}
    </FlexContainer>
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

const TransactionsTable = ({tokenA, tokenB, load_fct}) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoadingMoreTxns, setIsLoadingMoreTxns] = useState(false);
  const [firstTxnTime, setFirstTxnTime] = useState();
  const [lastTxnTime, setLastTxnTime] = useState();
  const timerRef = useRef(null);
  const refreshData = useCallback(async () => {
    if (firstTxnTime) {
      const latestTxn = formatTransactions(await load_fct(firstTxnTime));

      if (latestTxn.length > 0) {
        setFirstTxnTime(latestTxn[0].timestampInSeconds);
        setTransactions((prev) => [...latestTxn, ...prev]);
      }
    }
  }, [firstTxnTime, load_fct]);

  useEffect(() => {
    const setInitData = async () => {
      const dexscanPoolTransactions =  await load_fct();
      const formattedTransactions = formatTransactions(dexscanPoolTransactions);
      setFirstTxnTime(formattedTransactions[0].timestampInSeconds);
      setLastTxnTime(formattedTransactions[formattedTransactions.length - 1].timestampInSeconds);
      setTransactions(formattedTransactions);
    }
    setInitData();
    }, [load_fct])

  // Function to load older transactions
  const loadMoreTransactions = async () => {
    setIsLoadingMoreTxns(true);

    const olderTxns = formatTransactions(await load_fct(undefined, lastTxnTime));

    if(olderTxns && olderTxns.length > 0)
    {
      setLastTxnTime(olderTxns[olderTxns.length - 1].timestampInSeconds);
      setTransactions((prev) => [...prev, ...olderTxns]);
    }

    setIsLoadingMoreTxns(false);
  };

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


  const renderColumns = () => {
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
        name: tokenA,
        width: 100,
        render: ({ item }) => (
          <FlexContainer className="align-ce">
            <CryptoContainer size={32}>
              <img
                src={item.token0.img}
                alt={item.token0.ticker}
                style={{ width: 20, height: 20 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_ICON_URL;
                }}
              />
            </CryptoContainer>
            <Label color={getColor(item)}>{humanReadableNumber(item.token0Amount)}</Label>
          </FlexContainer>
        ),
        sortBy: 'token0Amount',
      },
      {
        name: tokenB,
        width: 100,
        render: ({ item }) => (
          <FlexContainer className="align-ce">
            <CryptoContainer size={28}>
              <img
                src={item.token1.img}
                alt={item.token1.ticker}
                style={{ width: 20, height: 20 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_ICON_URL;
                }}
              />
            </CryptoContainer>
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


  return <div style={{ fontFamily: commonTheme.fontFamily.regular }}>
          {transactions &&
          <CommonTable items={transactions}
                       columns={renderColumns()}
                       wantPagination
                       hasMore={true}
                       loading={isLoadingMoreTxns}
                       offset={8}
                       loadMore={async () => {await loadMoreTransactions()}}
                       cellPadding={12} />}
          </div>


}

export default TransactionsTable
