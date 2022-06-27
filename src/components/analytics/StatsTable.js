import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { TradeUpIcon } from '../../assets';
import tokenData from '../../constants/cryptoCurrencies';
import { useApplicationContext } from '../../contexts';
import { ROUTE_TOKEN_INFO } from '../../router/routes';
import { theme } from '../../styles/theme';
import { extractDecimal, humanReadableNumber } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import GraphicPercetage from '../shared/GraphicPercetage';
import Label from '../shared/Label';

const StatsTable = () => {
  const { themeMode } = useApplicationContext();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const fakeData = Object.values(tokenData).map((t) => ({
    ...t,
    price: 284630080,
    dailyPriceChange: [12312300, 23423400],
    dailyVolume: 12312300,
    dailyVolumeChange: [12312300, 23423400],
  }));

  return !loading ? (
    <CommonTable
      items={fakeData}
      columns={renderColumns(history)}
      actions={[
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
            console.log('item', item);
            history.push(ROUTE_TOKEN_INFO.replace(':token', item.name));
          },
        },
      ]}
    />
  ) : (
    <AppLoader containerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} />
  );
};

export default StatsTable;

const ScalableCryptoContainer = styled(FlexContainer)`
  transition: all 0.3s ease-in-out;

  :hover {
    transform: scale(1.18);
  }
`;

const renderColumns = (history) => {
  return [
    {
      name: '',
      width: 160,
      render: ({ item }) => (
        <ScalableCryptoContainer className="align-ce pointer" onClick={() => history.push(ROUTE_TOKEN_INFO.replace(':token', item.name))}>
          <CryptoContainer style={{ zIndex: 2 }}>{item.icon} </CryptoContainer>
          {item.name}
        </ScalableCryptoContainer>
      ),
    },

    {
      name: 'Price',
      width: 160,
      render: ({ item }) => (
        <ScalableCryptoContainer className="align-ce pointer h-100" onClick={() => history.push(ROUTE_TOKEN_INFO.replace(':token', item.name))}>
          $ {humanReadableNumber(extractDecimal(item.price))}
        </ScalableCryptoContainer>
      ),
    },

    {
      name: '24H Price Change',
      width: 160,
      render: ({ item }) => {
        return <GraphicPercetage componentStyle={{ margin: 0 }} prevValue={item.dailyPriceChange[0]} currentValue={item.dailyPriceChange[1]} />;
      },
    },

    {
      name: '24H Volume',
      width: 160,
      render: ({ item }) => {
        return `$ ${humanReadableNumber(extractDecimal(item.dailyVolume))}`;
      },
    },
    {
      name: '24H Volume Change',
      width: 160,
      render: ({ item }) => {
        return <GraphicPercetage componentStyle={{ margin: 0 }} prevValue={item.dailyVolumeChange[0]} currentValue={item.dailyVolumeChange[1]} />;
      },
    },
  ];
};
