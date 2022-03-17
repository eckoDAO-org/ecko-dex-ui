import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAccountContext, useModalContext, usePactContext } from '../../contexts';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED, ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED } from '../../router/routes';
import noExponents from '../../utils/noExponents';
import { limitDecimalPlaces, reduceBalance } from '../../utils/reduceBalance';
import TokenSelectorModalContent from '../modals/swap-modals/TokenSelectorModalContent';
import { FlexContainer } from '../shared/FlexContainer';
import Input from '../shared/Input';
import InputToken from '../shared/InputToken';
import Label from '../shared/Label';

const SingleSidedLiquidity = ({ pair }) => {
  const modalContext = useModalContext();
  const history = useHistory();

  const pact = usePactContext();
  const { account } = useAccountContext();
  const [values, setValues] = useState({
    coin: pair?.token0 || 'KDA',
    account: '',
    guard: null,
    balance: account.account.balance,
    amount: '',
    precision: 12,
  });

  useEffect(() => {
    history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED.concat(`?token0=${values.coin}`));
  }, [values.coin]);

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
      // content: (
      //   <TokenSelectorModalContent
      //     selectedToken={selectedToken}
      //     tokenSelectorType={tokenSelectorType}
      //     onTokenClick={onTokenClick}
      //     onClose={() => {
      //       modalContext.closeModal();
      //     }}
      //     fromToken={fromValues.coin}
      //     toToken={toValues.coin}
      //   />
      // ),
    });
  };
  return (
    <FlexContainer className="column background-fill" withGradient style={{ padding: 24 }}>
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
