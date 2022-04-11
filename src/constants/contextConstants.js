export const CHAIN_ID = process.env.REACT_APP_KDA_CHAIN_ID || '0';
export const PRECISION = Number(process.env.REACT_APP_KDA_PRECISION) || 12;
export const NETWORKID = process.env.REACT_APP_KDA_NETWORK_ID || 'testnet04';
export const FEE = process.env.REACT_APP_KDA_FEE || 0.003;
export const GAS_PRICE = Number(process.env.REACT_APP_KDA_GAS_PRICE) || 0.0000001;
export const GAS_LIMIT = Number(process.env.REACT_APP_KDA_GAS_LIMIT) || 100000;
export const NETWORK_TYPE = process.env.REACT_APP_KDA_NETWORK_TYPE || 'testnet';
export const ENABLE_GAS_STATION = process.env.ENABLE_GAS_STATION || false;
export const KADDEX_NAMESPACE = process.env.REACT_APP_KADDEX_NAMESPACE || 'kaddex'; //

export const NETWORK = `${process.env.REACT_APP_KDA_NETWORK}/chainweb/0.0/${NETWORKID}/chain/${CHAIN_ID}/pact`;

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
