import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { ArrowDown } from '../../assets';
import tokenData from '../../constants/cryptoCurrencies';
import { useAccountContext, useApplicationContext, useModalContext, usePactContext } from '../../contexts';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED, ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED } from '../../router/routes';
import theme from '../../styles/theme';
import noExponents from '../../utils/noExponents';
import { limitDecimalPlaces, reduceBalance } from '../../utils/reduceBalance';
import SelectPoolModal from '../modals/liquidity/SelectPoolModal';
import TokenSelectorModalContent from '../modals/swap-modals/TokenSelectorModalContent';
import AppLoader from '../shared/AppLoader';
import CustomButton from '../shared/CustomButton';
import CustomDropdown from '../shared/CustomDropdown';
import { CryptoContainer, FlexContainer } from '../shared/FlexContainer';
import Input from '../shared/Input';
import InputToken from '../shared/InputToken';
import Label from '../shared/Label';

const SingleSidedLiquidity = ({ pair, pools, onPairChange }) => {
  const { themeMode } = useApplicationContext();
  const modalContext = useModalContext();
  const history = useHistory();

  const pact = usePactContext();
  const { account } = useAccountContext();

  const [selectedPool, setSelectedPool] = useState(null);

  const [values, setValues] = useState({
    coin: pair?.token0 || 'KDA',
    account: '',
    guard: null,
    balance: account.account.balance,
    amount: '',
    precision: 12,
  });

  useEffect(() => {
    onPairChange(values.coin);
  }, [values.coin]);

  useEffect(() => {
    console.log('pools', pools);
    setSelectedPool(pools[0]);
    onPairChange(values.coin);
  }, []);

  const onSelectToken = async (crypto) => {
    setValues((prev) => ({ ...prev, coin: crypto.name }));
  };

  const openTokenSelectorModal = () => {
    modalContext.openModal({
      title: 'Select Token',
      description: '',
      containerStyle: {
        minWidth: '0px',
        width: '75%',
      },
      onClose: () => {
        modalContext.closeModal();
      },
      content: (
        <TokenSelectorModalContent
          token={values.coin}
          onSelectToken={onSelectToken}
          onClose={() => {
            modalContext.closeModal();
          }}
        />
      ),
    });
  };
  return (
    <FlexContainer className="column background-fill" withGradient style={{ padding: 24 }}>
      <CustomButton
        type="primary"
        buttonStyle={{ borderRadius: 4, height: 40 }}
        onClick={() => {
          modalContext.openModal({
            title: 'Select Pool',

            onClose: () => {
              modalContext.closeModal();
            },
            content: (
              <SelectPoolModal
                pools={pools}
                onSelect={(pool) => {
                  setSelectedPool(pool);
                }}
                onClose={() => {
                  modalContext.closeModal();
                }}
              />
            ),
          });
        }}
      >
        <div className="flex align-ce w-100 justify-sb">
          <div className="flex align-ce w-100">
            <div className="flex align-ce">
              <CryptoContainer size={22} style={{ zIndex: 2 }}>
                {tokenData?.[selectedPool?.token0]?.icon}
              </CryptoContainer>
              <CryptoContainer size={22} style={{ marginLeft: -12, zIndex: 1 }}>
                {tokenData?.[selectedPool?.token1]?.icon}{' '}
              </CryptoContainer>
            </div>
            <Label fontSize={13}>
              {selectedPool?.token0}/{selectedPool?.token1}
            </Label>
          </div>
          <ArrowDown />
        </div>
      </CustomButton>

      <Input
        error={isNaN(values.amount)}
        topLeftLabel="amount"
        topRightLabel={`balance: ${reduceBalance(values.balance) ?? '-'}`}
        bottomLeftLabel={`balance: ${reduceBalance(values.balance) ?? '-'}`} //using for gameEdition
        geColor="black"
        placeholder="0.0"
        maxLength="15"
        numberOnly
        inputRightComponent={
          <InputToken
            geColor="black"
            values={values}
            disabledButton={!values.balance}
            onClick={() => {
              // setTokenSelectorType('from');
              openTokenSelectorModal();
            }}
            onMaxClickButton={() => {
              setValues((prev) => ({
                ...prev,
                amount: reduceBalance(values.balance),
              }));
            }}
          />
        }
        value={noExponents(values.amount)}
        onSelectButtonClick={() => {
          // setTokenSelectorType('from');
        }}
        onChange={async (e, { value }) => {
          setValues((prev) => ({
            ...prev,
            amount: limitDecimalPlaces(value, values.precision),
          }));
        }}
      />

      <FlexContainer className="justify-sb w-100" style={{ marginTop: 16 }}>
        <Label fontSize={13}>Pool Share</Label>
        <Label fontSize={13} labelStyle={{ textAlign: 'end' }}>
          {!pact.share(values.amount) ? 0 : (pact.share(values.amount) * 100).toPrecision(4)} %
        </Label>
      </FlexContainer>
    </FlexContainer>
  );
};

export default SingleSidedLiquidity;
