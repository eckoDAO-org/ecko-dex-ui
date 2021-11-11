// export const chainId = process.env.REACT_APP_KDA_CHAIN_ID || "0";
export const chainId = "2";
// export const PRECISION = process.env.REACT_APP_KDA_PRECISION || 12;
export const PRECISION = 12;
// export const NETWORKID = process.env.REACT_APP_KDA_NETWORK_ID || "testnet04";
export const NETWORKID = "mainnet01";
// export const FEE = process.env.REACT_APP_KDA_FEE || 0.003;
export const FEE = 0.003;
// export const NETWORK_TYPE = process.env.REACT_APP_KDA_NETWORK_TYPE || "testnet";
export const NETWORK_TYPE = "mainnet";

// export const network =
//   process.env.REACT_APP_KDA_NETWORK ||
//   `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORKID}/chain/${chainId}/pact`;

export const network = `https://api.chainweb.com/chainweb/0.0/${NETWORKID}/chain/${chainId}/pact`;

export const creationTime = () => Math.round(new Date().getTime() / 1000) - 10;
export const GAS_PRICE = 0.00000001;
//Enable or disable gas station
export const ENABLE_GAS_STATION = false;
