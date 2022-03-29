export const chainId = process.env.REACT_APP_KDA_CHAIN_ID || '2';
// export const chainId = '2';
export const PRECISION = process.env.REACT_APP_KDA_PRECISION || 12;
// export const PRECISION = 12;
export const NETWORKID = process.env.REACT_APP_KDA_NETWORK_ID || 'mainnet01';
// export const NETWORKID = 'mainnet01';
export const FEE = process.env.REACT_APP_KDA_FEE || 0.003;
// export const FEE = 0.003;
export const NETWORK_TYPE = process.env.REACT_APP_KDA_NETWORK_TYPE || 'mainnet';
// export const NETWORK_TYPE = 'mainnet';

export const network = `${process.env.REACT_APP_KDA_NETWORK || 'https://api.chainweb.com'}/chainweb/0.0/${NETWORKID}/chain/${chainId}/pact`;

// export const network = `https://api.chainweb.com/chainweb/0.0/${NETWORKID}/chain/${chainId}/pact`;
//https://devnet.private.kate.land/chainweb/0.0/development/chain/0/pact/api/v1/local

export const creationTime = () => Math.round(new Date().getTime() / 1000) - 10;

export const getCurrentDate = () => {
  const d = new Date();
  let day = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const getDateFromCustomDate = (date, time) => {
  const splittedDate = date.split('/');
  const d = new Date(`${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]} ${time}`);
  return d;
};

export const getCurrentTime = () => {
  const t = new Date();
  let hours = t.getHours();
  let minutes = t.getMinutes();
  let seconds = t.getSeconds();
  return `${hours}:${minutes}:${seconds}`;
};

const get2numMoment = (moment) => {
  return moment < 10 ? `0${moment}` : moment;
};

export const getDate = (date) => {
  const d = new Date(date);
  let day = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();
  let hours = d.getHours();
  let minutes = d.getMinutes();
  let seconds = d.getSeconds();
  return `${get2numMoment(day)}/${get2numMoment(month)}/${get2numMoment(year)} - ${get2numMoment(hours)}:${get2numMoment(minutes)}:${get2numMoment(
    seconds
  )}`;
};

export const GAS_PRICE = 0.0000001;
//Enable or disable gas station
export const ENABLE_GAS_STATION = false;
