import axios from 'axios';

export const simplexQuote = async (data) => {
  return axios.post(`${process.env.REACT_APP_KADDEX_API_URL}/api/Simplex/Quote`, data);
};

export const simplexPaymentRequest = async (data) => {
  return axios.post(`${process.env.REACT_APP_KADDEX_API_URL}/api/Simplex/PaymentRequest`, data);
};
