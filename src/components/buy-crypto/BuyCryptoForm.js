import React, { useRef, useState } from 'react';
import styled from 'styled-components/macro';
import CustomDropdown from '../shared/CustomDropdown';
import Input from '../shared/Input';
import { simplexQuote, simplexPaymentRequest } from '../../api/kaddex-be-tools';
import CustomButton from '../shared/CustomButton';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;
`;

const BuyCryptoForm = ({}) => {
  const formRef = useRef(null);
  const [quoteRequestData, setQuoteRequestData] = useState({
    endUserId: 'kaddex-user11',
    fiatCurrency: 'EUR',
    digitalCurrency: 'KDA',
    requestedCurrency: 'KDA',
  });
  const [paymentId, setPaymentId] = useState('');

  const onQuote = () => {
    simplexQuote({ ...quoteRequestData })
      .then((res) => {
        console.log('res quote', res);
        const { quote_id } = res.data;
        console.log('🚀 !!! ~ quote_id', quote_id);
        if (quote_id) {
          simplexPaymentRequest({
            endUserId: 'kaddex-user11',
            quoteId: quote_id,
            currency: quoteRequestData.digitalCurrency,
            address:
              quoteRequestData.digitalCurrency === 'BTC'
                ? '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'
                : 'k:2e6a7275e51156c4e641c377bc8157fc057d20698b83f30ad2f1828a8b74940e',
            tag: '',
            httpRefUrl: 'http://localhost:3000',
          }).then((resPayment) => {
            console.log('resPayment', resPayment);
            setPaymentId(resPayment.data.paymentId);
            // formRef.current.submit();
          });
        }
      })
      .catch((err) => console.log('err quote', err));
  };

  return (
    <Container>
      <CustomDropdown
        title="Denomination"
        value={quoteRequestData?.fiatCurrency}
        options={[
          {
            text: 'EUR',
            value: 'EUR',
          },
          {
            text: 'USD',
            value: 'USD',
          },
        ]}
        onChange={(e, data) => setQuoteRequestData({ ...quoteRequestData, fiatCurrency: data.value })}
      />
      <CustomDropdown
        title="Asset"
        value={quoteRequestData?.digitalCurrency}
        options={[
          {
            text: 'KDA',
            value: 'KDA',
          },
          {
            text: 'BTC',
            value: 'BTC',
          },
        ]}
        onChange={(e, data) => setQuoteRequestData({ ...quoteRequestData, digitalCurrency: data.value, requestedCurrency: data.value })}
      />
      <Input
        type="number"
        value={quoteRequestData?.requestedAmount ?? ''}
        label="Asset amount"
        onChange={(e) => setQuoteRequestData({ ...quoteRequestData, requestedAmount: e.target.value })}
      />
      <div style={{ margin: '20px 0px' }}>
        <CustomButton label="Quote" onClick={onQuote} />
      </div>
      <form ref={formRef} id="payment_form" action="https://sandbox.test-simplexcc.com/payments/new" method="POST">
        <input type="text" name="version" value="1" />
        <input type="text" name="partner" value="kaddex" />
        <input type="text" name="payment_flow_type" value="wallet" />
        <input type="text" name="return_url_success" value="https://localhost:3000/buy-crypto" />
        <input type="text" name="return_url_fail" value="https://localhost:3000/buy-crypto" />
        <input type="text" name="payment_id" value={paymentId} />
        <button type="submit">submit</button>
      </form>
    </Container>
  );
};

export default BuyCryptoForm;
