import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components/macro';
import CustomDropdown from '../shared/CustomDropdown';
import Input from '../shared/Input';
import Label from '../shared/Label';
import { simplexQuote, simplexPaymentRequest } from '../../api/kaddex-be-tools';
import CustomButton from '../shared/CustomButton';
import { useDebounce } from '../../hooks/useDebounce';
import { useAccountContext } from '../../contexts';
import { commonColors } from '../../styles/theme';
import { FlexContainer } from '../shared/FlexContainer';
import { SimplexLogo } from '../../assets';
import { ROUTE_BUY_CRYPTO } from '../../router/routes';
// import CustomCheckbox from '../shared/CustomCheckbox';
// import { CheckboxContainer } from '../modals/liquidity/LiquidityTxView';
// import { Checkbox } from 'semantic-ui-react';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;
`;

const FormRow = styled.div`
  margin: 10px 0px;
`;

const BuyCryptoForm = ({}) => {
  const formRef = useRef(null);
  const [quoteRequestData, setQuoteRequestData] = useState({
    endUserId: null,
    fiatCurrency: 'USD',
    digitalCurrency: 'KDA',
    requestedCurrency: 'KDA',
  });
  const [quoteResponse, setQuoteResponse] = useState(null);

  const [assetAmount, setAssetAmount] = useState(null);
  const [quoteError, setQuoteError] = useState(null);
  const debounceAssetAmount = useDebounce(assetAmount, 500);
  const {
    account: { account },
  } = useAccountContext();

  const onQuote = useCallback(() => {
    setQuoteError(null);
    setQuoteResponse(null);
    setIsLoading(true);
    simplexQuote({ ...quoteRequestData, endUserId: account, requestedAmount: debounceAssetAmount })
      .then((res) => {
        const { quote_id } = res.data;
        setQuoteResponse(res.data);
        if (quote_id) {
          setQuoteError(null);
          simplexPaymentRequest({
            endUserId: account,
            quoteId: quote_id,
            currency: quoteRequestData.digitalCurrency,
            address: account,
            tag: '',
            httpRefUrl: window.location.origin,
          })
            .then((resPayment) => {
              console.log('resPayment', resPayment);
              setPaymentId(resPayment.data.paymentId);
              setIsLoading(false);
            })
            .catch((err) => console.log('err requestPayment', err))
            .finally(() => setIsLoading(false));
        } else if (res?.data?.error) {
          setIsLoading(false);
          setQuoteError(res?.data?.error);
        }
      })
      .catch((err) => {
        console.log('err quote', err);
        setIsLoading(false);
      });
  }, [quoteRequestData, debounceAssetAmount, account]);

  useEffect(() => {
    if (debounceAssetAmount) {
      onQuote();
    }
  }, [debounceAssetAmount, onQuote]);

  const [isLoading, setIsLoading] = useState(false);

  const [paymentId, setPaymentId] = useState('');

  return (
    <Container>
      <FormRow>
        <CustomDropdown
          title="Denomination"
          value={quoteRequestData?.fiatCurrency}
          options={simplexSupportedFiat.map((curr) => ({ text: curr, value: curr })).sort((a, b) => a.text.localeCompare(b.text))}
          onChange={(e, data) => setQuoteRequestData({ ...quoteRequestData, fiatCurrency: data.value })}
        />
      </FormRow>
      <FormRow>
        <CustomDropdown
          title="Asset"
          value={quoteRequestData?.digitalCurrency}
          options={[
            {
              text: 'KDA',
              value: 'KDA',
            },
          ]}
          onChange={(e, data) => setQuoteRequestData({ ...quoteRequestData, digitalCurrency: data.value, requestedCurrency: data.value })}
        />
      </FormRow>
      <FormRow>
        <Label fontSize={12} labelStyle={{ margin: '-10px 0px 10px 2px', opacity: 0.7 }}>
          Asset amount must meet $50.00 minimum / $20,000.00 maximum
        </Label>
        <Input
          topLeftLabel="amount"
          topRightLabel={
            quoteResponse &&
            `Fees: ${(quoteResponse?.fiat_money?.total_amount - quoteResponse?.fiat_money?.base_amount).toFixed(2)} ${
              quoteResponse?.fiat_money?.currency
            }`
          }
          placeholder="0.0"
          maxLength="15"
          numberOnly
          value={assetAmount || ''}
          inputRightComponent={null}
          bottomContent={
            quoteResponse && (
              <Label labelStyle={{ marginBottom: 10 }}>
                Total charge (including fees): {quoteResponse?.fiat_money?.total_amount} {quoteResponse?.fiat_money?.currency}
              </Label>
            )
          }
          onChange={(e, { value }) => setAssetAmount(e.target.value)}
        />
        {quoteError && (
          <Label color={commonColors.red} fontSize={13} labelStyle={{ marginTop: 25 }}>
            {quoteError}
          </Label>
        )}
      </FormRow>

      <FormRow style={{ margin: '20px 0px' }}>
        <form style={{ display: 'none' }} ref={formRef} id="payment_form" action={process.env.REACT_APP_SIMPLEX_NEW_PAYMENT_URL} method="POST">
          <input type="text" name="version" value="1" readOnly />
          <input type="text" name="partner" value="kaddex" readOnly />
          <input type="text" name="payment_flow_type" value="wallet" readOnly />
          <input type="text" name="return_url_success" value={`${window.location.origin}${ROUTE_BUY_CRYPTO}?success=true`} readOnly />
          <input type="text" name="return_url_fail" value={`${window.location.origin}${ROUTE_BUY_CRYPTO}?success=false`} readOnly />
          <input type="text" name="payment_id" value={paymentId || ''} readOnly />
        </form>
        {/* <CheckboxContainer checked={false}>
          <Label fontFamily="syncopate" fontSize={16}>
            stake my rewards
          </Label>
          <Checkbox checked={false} />
        </CheckboxContainer> */}
        <CustomButton disabled={!quoteResponse} loading={isLoading} onClick={() => formRef.current.submit()}>
          Buy
        </CustomButton>
        <FlexContainer className="justify-ce" style={{ marginTop: 20 }}>
          <Label fontSize={12}>
            Powered by Simplex <SimplexLogo />
          </Label>
        </FlexContainer>
      </FormRow>
    </Container>
  );
};

export default BuyCryptoForm;

export const simplexSupportedFiat = [
  'USD',
  'EUR',
  'JPY',
  'CAD',
  'GBP',
  'RUB',
  'AUD',
  'KRW',
  'CHF',
  'CZK',
  'DKK',
  'NOK',
  'NZD',
  'PLN',
  'SEK',
  'TRY',
  'ZAR',
  'HUF',
  'ILS',
  'INR',
  'UAH',
  'HKD',
  'MYR',
  'NGN',
  'SGD',
  'TWD',
  'BGN',
  'BRL',
  'MAD',
  'RON',
  'MXN',
  'VND',
  'KZT',
  'PHP',
  'DOP',
  'PEN',
  'ARS',
  'COP',
  'MDL',
  'QAR',
  'UZS',
  'GEL',
  'CNY',
  'UYU',
  'CLP',
  'CRC',
  'AZN',
  'NAD',
  'AED',
  'IDR',
  'ANG',
  'THB',
  'BHD',
  'IQD',
  'JOD',
  'KWD',
  'OMR',
  'XAF',
];
