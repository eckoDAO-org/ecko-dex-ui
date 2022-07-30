import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components/macro';
import CustomDropdown from '../shared/CustomDropdown';
import Input from '../shared/Input';
import Label from '../shared/Label';
import { simplexQuote, simplexPaymentRequest } from '../../api/kaddex-be-tools';
import CustomButton from '../shared/CustomButton';
import { useDebounce } from '../../hooks/useDebounce';
import { useAccountContext, useNotificationContext } from '../../contexts';
import { commonColors } from '../../styles/theme';
import { FlexContainer } from '../shared/FlexContainer';
import { SimplexLogo } from '../../assets';
import { ROUTE_BUY_CRYPTO } from '../../router/routes';
import { CheckboxContainer } from '../modals/liquidity/LiquidityTxView';
import { Checkbox } from 'semantic-ui-react';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;
`;

const FormRow = styled.div`
  margin: 10px 0px;
`;
const initialDisclaimerData = {
  isShowing: false,
  isAccepted: false,
};

const BuyCryptoForm = () => {
  const formRef = useRef(null);

  const [quoteRequestData, setQuoteRequestData] = useState({
    endUserId: null,
    fiatCurrency: 'USD',
    digitalCurrency: 'KDA',
    requestedCurrency: 'KDA',
  });
  const [quoteResponse, setQuoteResponse] = useState(null);
  const { showNotification, STATUSES } = useNotificationContext();

  const [assetAmount, setAssetAmount] = useState(null);
  const [quoteError, setQuoteError] = useState(null);
  const [disclaimerData, setDisclaimerData] = useState(initialDisclaimerData);
  const debounceAssetAmount = useDebounce(assetAmount, 500);
  const {
    account: { account },
  } = useAccountContext();

  useEffect(() => {
    const successPayment = new URLSearchParams(window.location?.search).get('success');
    if (successPayment) {
      if (successPayment === 'true') {
        showNotification({
          title: 'SUCCESS',
          message: 'Crypto purchase made successfully',
          type: STATUSES.SUCCESS,
          autoClose: 5000,
          hideProgressBar: false,
        });
      } else {
        showNotification({
          title: 'ERROR',
          message: 'Something went wrong while buying cryptocurrencies',
          type: STATUSES.ERROR,
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
    }
  }, [showNotification, STATUSES]);

  const onQuote = useCallback(() => {
    if (!account) {
      showNotification({
        title: 'CONNECT WALLET',
        message: 'Please connect your wallet before buying crypto',
        type: STATUSES.WARNING,
        autoClose: 3000,
        hideProgressBar: false,
      });
      return;
    }
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
  }, [quoteRequestData, debounceAssetAmount, account, showNotification, STATUSES]);

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
        <CheckboxContainer style={{ margin: '0px 0px 20px 0px' }}>
          <Label fontSize={12}>
            <span>
              I have read the{' '}
              <DisclaimerLabel
                onClick={() =>
                  setDisclaimerData((prev) => ({
                    ...prev,
                    isShowing: !prev.isShowing,
                  }))
                }
              >
                disclaimer
              </DisclaimerLabel>{' '}
              and consent to Kaddex providing my deposit address and user name to Simplex.
            </span>
          </Label>
          <Checkbox
            checked={disclaimerData?.isAccepted}
            onClick={() =>
              setDisclaimerData((prev) => ({
                ...prev,
                isAccepted: !prev.isAccepted,
              }))
            }
          />
        </CheckboxContainer>
        <CustomButton disabled={!disclaimerData?.isAccepted || !quoteResponse} loading={isLoading} onClick={() => formRef.current.submit()}>
          Buy
        </CustomButton>
        <FlexContainer className="justify-ce" style={{ marginTop: 20 }}>
          <Label fontSize={12}>
            Powered by Simplex <SimplexLogo />
          </Label>
        </FlexContainer>
        {disclaimerData.isShowing && (
          <FlexContainer className="justify-ce" style={{ marginTop: 20 }}>
            <Label fontSize={12}>
              <span>
                Please read and agree to the Terms of Use of Simplex before using this service. Kaddex does not currently support purchases of
                cryptocurrency using debit or credit cards. These transactions must be completed with a third-party. While Kaddex will direct you to
                Simplex to complete the transaction above, you are not required to purchase cryptocurrency through Simplex and there may be other ways
                to purchase cryptocurrency using your debit or credit card. Simplex is not owned or operated by Kaddex and as such we cannot guarantee
                that your transaction will process successfully. As a convenience to our customers, Kaddex will provide your deposit address and
                username to Simplex should you choose to complete this transaction. By checking the box below, you consent to Kaddex providing this
                information to Simplex on your behalf and acknowledge your agreement to this disclaimer. For any questions about your card payment,
                please contact <a href={`mailto:support@simplex.com`}>support@simplex.com</a>. Kaddex does not assume responsibility for any loss or
                damage caused by the use of the service.
              </span>
            </Label>
          </FlexContainer>
        )}
      </FormRow>
    </Container>
  );
};

export default BuyCryptoForm;

const DisclaimerLabel = styled.span`
  font-weight: bold;
  cursor: pointer;
`;

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
