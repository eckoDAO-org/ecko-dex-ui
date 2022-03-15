import axios from 'axios';

export const getCoingeckoUsdPrice = async (tokenName) => {
  const API = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenName}&vs_currencies=usd`;

  return await axios
    .get(API)
    .then(async (res) => {
      return res.data?.[tokenName]?.usd;
    })
    .catch((err) => console.log('error', err));
};
