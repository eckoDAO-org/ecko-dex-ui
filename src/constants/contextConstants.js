export const CHAIN_ID = process.env.REACT_APP_KDA_CHAIN_ID || '0';
export const PRECISION = Number(process.env.REACT_APP_KDA_PRECISION) || 12;
export const NETWORKID = process.env.REACT_APP_KDA_NETWORK_ID || 'testnet04';
export const FEE = process.env.REACT_APP_KDA_FEE || 0.003;
export const GAS_PRICE = Number(process.env.REACT_APP_KDA_GAS_PRICE) || 0.0000001;
export const GAS_LIMIT = Number(process.env.REACT_APP_KDA_GAS_LIMIT) || 100000;
export const NETWORK_TYPE = process.env.REACT_APP_KDA_NETWORK_TYPE || 'testnet';
export const ENABLE_GAS_STATION = process.env.ENABLE_GAS_STATION || false;

export const NETWORK = `${process.env.REACT_APP_KDA_NETWORK}/chainweb/0.0/${NETWORKID}/chain/${CHAIN_ID}/pact`;
export const creationTime = () => Math.round(new Date().getTime() / 1000) - 10;

