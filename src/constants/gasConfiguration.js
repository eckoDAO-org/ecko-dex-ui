import {
  ROUTE_DAO_PROPOSAL,
  ROUTE_INDEX,
  ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED,
  ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED,
  ROUTE_LIQUIDITY_REMOVE_LIQUIDITY,
  ROUTE_LIQUIDITY_REWARDS,
  ROUTE_STAKE,
  ROUTE_UNSTAKE,
} from '../router/routes';

export const PATH_CONFIGURATION = {
  SWAP: {
    name: 'SWAP',
    route: ROUTE_INDEX,
  },
  ADD_LIQUIDITY_DOUBLE_SIDE: {
    name: 'ADD_LIQUIDITY_DOUBLE_SIDE',
    route: ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED,
  },
  ADD_LIQUIDITY_SINGLE_SIDE: {
    name: 'ADD_LIQUIDITY_SINGLE_SIDE',
    route: ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED,
  },
  REMOVE_LIQUIDITY: {
    name: 'REMOVE_LIQUIDITY',
    route: ROUTE_LIQUIDITY_REMOVE_LIQUIDITY,
  },
  CLAIM_LIQUIDITY_REWARDS: {
    name: 'CLAIM_LIQUIDITY_REWARDS',
    route: ROUTE_LIQUIDITY_REWARDS,
  },
  DAO_VOTE: {
    name: 'DAO_VOTE',
    route: ROUTE_DAO_PROPOSAL,
  },
  STAKE: {
    name: 'STAKE',
    route: ROUTE_STAKE,
  },
  UNSTAKE: {
    name: 'UNSTAKE',
    route: ROUTE_UNSTAKE,
  },
};

const GAS_STATION_PRICE = 0.0000001;
const ECONOMY_GAS_PRICE = 0.00000001;
const NORMAL_GAS_PRICE = 0.000001;
const FAST_GAS_PRICE = 0.0001;

export const GAS_OPTIONS = {
  ECONOMY: {
    SWAP: {
      gasLimit: 6000,
      gasPrice: ECONOMY_GAS_PRICE,
    },
    ADD_LIQUIDITY_DOUBLE_SIDE: {
      gasLimit: 16000,
      gasPrice: ECONOMY_GAS_PRICE,
    },
    ADD_LIQUIDITY_SINGLE_SIDE: {
      gasLimit: 16000,
      gasPrice: ECONOMY_GAS_PRICE,
    },
    REMOVE_LIQUIDITY: {
      gasLimit: 16000,
      gasPrice: ECONOMY_GAS_PRICE,
    },
    CLAIM_LIQUIDITY_REWARDS: {
      gasLimit: 4000,
      gasPrice: ECONOMY_GAS_PRICE,
    },
    DAO_VOTE: {
      gasLimit: 2000,
      gasPrice: ECONOMY_GAS_PRICE,
    },
    STAKE: {
      gasLimit: 7000,
      gasPrice: ECONOMY_GAS_PRICE,
    },
    UNSTAKE: {
      gasLimit: 7000,
      gasPrice: ECONOMY_GAS_PRICE,
    },
  },
  NORMAL: {
    SWAP: {
      gasLimit: 6000,
      gasPrice: NORMAL_GAS_PRICE,
    },
    ADD_LIQUIDITY_DOUBLE_SIDE: {
      gasLimit: 16000,
      gasPrice: NORMAL_GAS_PRICE,
    },
    ADD_LIQUIDITY_SINGLE_SIDE: {
      gasLimit: 16000,
      gasPrice: NORMAL_GAS_PRICE,
    },
    REMOVE_LIQUIDITY: {
      gasLimit: 16000,
      gasPrice: NORMAL_GAS_PRICE,
    },
    CLAIM_LIQUIDITY_REWARDS: {
      gasLimit: 4000,
      gasPrice: NORMAL_GAS_PRICE,
    },
    DAO_VOTE: {
      gasLimit: 2000,
      gasPrice: NORMAL_GAS_PRICE,
    },
    STAKE: {
      gasLimit: 7000,
      gasPrice: NORMAL_GAS_PRICE,
    },
    UNSTAKE: {
      gasLimit: 7000,
      gasPrice: NORMAL_GAS_PRICE,
    },
  },
  FAST: {
    SWAP: {
      gasLimit: 6000,
      gasPrice: FAST_GAS_PRICE,
    },
    ADD_LIQUIDITY_DOUBLE_SIDE: {
      gasLimit: 16000,
      gasPrice: FAST_GAS_PRICE,
    },
    ADD_LIQUIDITY_SINGLE_SIDE: {
      gasLimit: 16000,
      gasPrice: FAST_GAS_PRICE,
    },
    REMOVE_LIQUIDITY: {
      gasLimit: 16000,
      gasPrice: FAST_GAS_PRICE,
    },
    CLAIM_LIQUIDITY_REWARDS: {
      gasLimit: 4000,
      gasPrice: FAST_GAS_PRICE,
    },
    DAO_VOTE: {
      gasLimit: 2000,
      gasPrice: FAST_GAS_PRICE,
    },
    STAKE: {
      gasLimit: 7000,
      gasPrice: FAST_GAS_PRICE,
    },
    UNSTAKE: {
      gasLimit: 7000,
      gasPrice: FAST_GAS_PRICE,
    },
  },
  DEFAULT: {
    SWAP: {
      gasLimit: 6000,
      gasPrice: GAS_STATION_PRICE,
    },
    ADD_LIQUIDITY_DOUBLE_SIDE: {
      gasLimit: 16000,
      gasPrice: GAS_STATION_PRICE,
    },
    ADD_LIQUIDITY_SINGLE_SIDE: {
      gasLimit: 16000,
      gasPrice: GAS_STATION_PRICE,
    },
    REMOVE_LIQUIDITY: {
      gasLimit: 16000,
      gasPrice: GAS_STATION_PRICE,
    },
    CLAIM_LIQUIDITY_REWARDS: {
      gasLimit: 4000,
      gasPrice: GAS_STATION_PRICE,
    },
    DAO_VOTE: {
      gasLimit: 2000,
      gasPrice: GAS_STATION_PRICE,
    },
    STAKE: {
      gasLimit: 7000,
      gasPrice: GAS_STATION_PRICE,
    },
    UNSTAKE: {
      gasLimit: 7000,
      gasPrice: GAS_STATION_PRICE,
    },
  },
};
