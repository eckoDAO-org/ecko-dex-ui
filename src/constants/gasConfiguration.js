import {
  ROUTE_INDEX,
  ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED,
  ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED,
  ROUTE_LIQUIDITY_REMOVE_LIQUIDITY,
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
};

export const GAS_OPTIONS = {
  ECONOMY: {
    SWAP: {
      gasLimit: 6000,
      gasPrice: 0.00000001,
    },
    ADD_LIQUIDITY_DOUBLE_SIDE: {
      gasLimit: 16000,
      gasPrice: 0.00000001,
    },
    ADD_LIQUIDITY_SINGLE_SIDE: {
      gasLimit: 16000,
      gasPrice: 0.00000001,
    },
    REMOVE_LIQUIDITY: {
      gasLimit: 16000,
      gasPrice: 0.00000001,
    },
  },
  NORMAL: {
    SWAP: {
      gasLimit: 6000,
      gasPrice: 0.000001,
    },
    ADD_LIQUIDITY_DOUBLE_SIDE: {
      gasLimit: 16000,
      gasPrice: 0.000001,
    },
    ADD_LIQUIDITY_SINGLE_SIDE: {
      gasLimit: 16000,
      gasPrice: 0.000001,
    },
    REMOVE_LIQUIDITY: {
      gasLimit: 16000,
      gasPrice: 0.000001,
    },
  },
  FAST: {
    SWAP: {
      gasLimit: 6000,
      gasPrice: 0.0001,
    },
    ADD_LIQUIDITY_DOUBLE_SIDE: {
      gasLimit: 16000,
      gasPrice: 0.0001,
    },
    ADD_LIQUIDITY_SINGLE_SIDE: {
      gasLimit: 16000,
      gasPrice: 0.0001,
    },
    REMOVE_LIQUIDITY: {
      gasLimit: 16000,
      gasPrice: 0.0001,
    },
  },
  DEFAULT: {
    SWAP: {
      gasLimit: 6000,
      gasPrice: 0.0000001,
    },
    ADD_LIQUIDITY_DOUBLE_SIDE: {
      gasLimit: 16000,
      gasPrice: 0.0000001,
    },
    ADD_LIQUIDITY_SINGLE_SIDE: {
      gasLimit: 16000,
      gasPrice: 0.0000001,
    },
    REMOVE_LIQUIDITY: {
      gasLimit: 16000,
      gasPrice: 0.0000001,
    },
  },
};
