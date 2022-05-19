import React, { useEffect, useState } from 'react';
import moment from 'moment';
import styled from 'styled-components/macro';
import { BoosterIcon } from '../../assets';
import tokenData from '../../constants/cryptoCurrencies';
import { extractDecimal, pairUnit } from '../../utils/reduceBalance';
import AppLoader from '../shared/AppLoader';
import CommonTable from '../shared/CommonTable';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import { commonColors } from '../../styles/theme';
import InfoPopup from '../shared/InfoPopup';
import { useModalContext } from '../../contexts';
import ClaimYourKDXRewards from '../modals/liquidity/ClaimYourKDXRewards';
import CustomDropdown from '../shared/CustomDropdown';

const ClaimButton = styled.div`
  display: flex;
  align-items: center;
  border-radius: 100px;

  padding: 8px;
  border: 1px solid ${({ color, disabled, theme: { colors } }) => (color ? (disabled ? `${color}99` : color) : colors.white)};
  svg {
    margin-right: 8px;
    path {
      fill: ${({ color, disabled, theme: { colors } }) => (color ? color : disabled ? `${color || colors.white}99` : colors.white)} !important;
    }
  }
`;

const sortByOptions = [
  { key: 0, text: `Pending`, value: 'pending' },
  { key: 1, text: `Approved`, value: 'approved' },
  { key: 2, text: `Available`, value: 'available' },
];

const LiquidityRewards = () => {
  const modalContext = useModalContext();
  const [loading, setLoading] = useState(false);
  const [rewards, setRewards] = useState([]);

  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    sortBy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const sortBy = () => {
    const pendingRewards = fakeData.filter((r) => r.status === 'pending');
    const approvedRewards = fakeData.filter((r) => r.status === 'approved');
    const availableRewards = fakeData.filter((r) => r.status === 'available');
    let results = [];
    if (statusFilter === 'pending') {
      results = [...pendingRewards, ...approvedRewards, ...availableRewards];
    } else if (statusFilter === 'approved') {
      results = [...approvedRewards, ...pendingRewards, ...availableRewards];
    } else {
      results = [...availableRewards, ...approvedRewards, ...pendingRewards];
    }
    setRewards(results);
  };

  return !loading ? (
    <div className="column">
      <div className="flex justify-sb" style={{ marginBottom: 16 }}>
        <div className="flex align-ce">
          <Label fontSize={20} fontFamily="syncopate">
            REWARDS
          </Label>
          <InfoPopup size={18} type="modal" title="Rewards"></InfoPopup>
        </div>

        <CustomDropdown
          title="sort by:"
          options={sortByOptions}
          onChange={(e, { value }) => {
            setStatusFilter(value);
          }}
          value={statusFilter}
        />
      </div>
      <CommonTable
        items={rewards}
        columns={renderColumns()}
        actions={[
          {
            icon: (item) => (
              <ClaimButton
                disabled={item.remainingTime > 0 || item.status === 'approved'}
                color={item.status === 'pending' ? commonColors.pink : null}
              >
                <BoosterIcon />{' '}
                <Label
                  labelStyle={{ lineHeight: 1 }}
                  withShade={item.remainingTime > 0 || item.status === 'approved'}
                  color={item.status === 'pending' ? commonColors.pink : null}
                  fontFamily="syncopate"
                >
                  CLAIM
                </Label>
              </ClaimButton>
            ),
            disabled: (item) => item.remainingTime > 0 || item.status === 'approved',
            onClick: (item) => {
              const disabled = item.remainingTime > 0 || item.status === 'approved';
              if (!disabled) {
                modalContext.openModal({
                  title: 'CLAIM YOUR KDX REWARDS',
                  content: <ClaimYourKDXRewards multiplier={item.multiplier} />,
                });
              }
            },
          },
        ]}
      />
    </div>
  ) : (
    <AppLoader containerStyle={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} />
  );
};

export default LiquidityRewards;

const renderColumns = () => {
  return [
    {
      name: 'name',
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
      name: 'Amount',
      width: 160,
      render: ({ item }) => `${pairUnit(extractDecimal(item.amount), 6)} KDX`,
    },

    {
      name: '~ KDX Muliplayer',
      width: 160,
      render: ({ item }) => `X ${pairUnit(extractDecimal(item.multiplier), 2)}`,
    },

    {
      name: 'Transaction ID',
      width: 160,
      render: ({ item }) => {
        return item.transactionID;
      },
    },
    {
      name: 'Remaining Time',
      width: 160,
      render: ({ item }) => {
        return (
          <Label color={item?.remainingTime === 0 ? commonColors.green : commonColors.red}>
            {item.remainingTime === 0 ? '0 Days' : moment.utc(1000 * item.remainingTime).format('D[ days] H[ hours]')}
          </Label>
        );
      },
    },
    {
      name: 'Status',
      width: 160,
      render: ({ item }) => {
        let color = '';

        switch (item.status) {
          case 'pending':
            color = commonColors.orange;
            break;
          case 'available':
            color = commonColors.green;
            break;
          case 'approved':
            color = null;
            break;
          default:
            color = null;
            break;
        }
        return (
          <Label className={'capitalize'} color={color}>
            {item.status}
          </Label>
        );
      },
    },
  ];
};

const fakeData = [
  {
    token0: 'KDX',
    token1: 'KDA',
    amount: 10.2334,
    multiplier: 3,
    transactionID: '121dj...232jk',
    remainingTime: 846720,
    status: 'pending',
  },
  {
    token0: 'KDA',
    token1: 'KDX',
    amount: 20.12,
    multiplier: 1.23,
    transactionID: '121dj...232jk',
    remainingTime: 276480,
    status: 'pending',
  },
  {
    token0: 'KDX',
    token1: 'KDA',
    amount: 102334,
    multiplier: 3,
    transactionID: '121dj...232jk',
    remainingTime: 0,
    status: 'available',
  },
  {
    token0: 'KDX',
    token1: 'KDA',
    amount: 102334,
    multiplier: 3,
    transactionID: '121dj...232jk',
    remainingTime: 0,
    status: 'approved',
  },
];
