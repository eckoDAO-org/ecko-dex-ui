import {
  ROUTE_STATS,
  ROUTE_SWAP,
  ROUTE_ANALYTICS,
  ROUTE_MY_SWAP,
  ROUTE_LIQUIDITY_TOKENS,
  ROUTE_LIQUIDITY_POOLS,
  ROUTE_LIQUIDITY_MY_LIQUIDITY,
  ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED,
  ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED,
  ROUTE_LIQUIDITY_REMOVE_LIQUIDITY,
  ROUTE_STAKE,
  ROUTE_UNSTAKE,
  ROUTE_DAO,
  ROUTE_LIQUIDITY_REWARDS,
  ROUTE_ANALYTICS_KDX,
  ROUTE_ANALYTICS_STATS,
  ROUTE_BUY_CRYPTO,
} from '../router/routes';

export const SWAP = {
  id: 0,
  label: 'swap',
  route: ROUTE_SWAP,
  activeRoutes: [ROUTE_MY_SWAP],
};
export const LIQUIDITY = {
  id: 1,
  label: 'Liquidity',
  route: ROUTE_LIQUIDITY_TOKENS,
  activeRoutes: [
    ROUTE_LIQUIDITY_POOLS,
    ROUTE_LIQUIDITY_MY_LIQUIDITY,
    ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED,
    ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED,
    ROUTE_LIQUIDITY_REMOVE_LIQUIDITY,
    ROUTE_LIQUIDITY_REWARDS,
  ],
};
export const DAO = {
  id: 2,
  label: 'DAO',
  route: ROUTE_DAO,
  className: '',
};
export const ANALYTICS = {
  id: 4,
  label: 'analytics',
  route: ROUTE_ANALYTICS,
  activeRoutes: [ROUTE_ANALYTICS_KDX, ROUTE_ANALYTICS_STATS],
};
export const STAKE = {
  id: 3,
  label: 'stake',
  route: ROUTE_STAKE,
  activeRoutes: [ROUTE_UNSTAKE],
};
export const VAULT = {
  id: 3,
  label: 'vault',
  target: '_self',
  link: 'http://134.209.219.136/',
};
export const BUY_CRYPTO = {
  id: 5,
  label: 'buy crypto',
  route: ROUTE_BUY_CRYPTO,
};

export default [SWAP, LIQUIDITY, STAKE, DAO, ANALYTICS, VAULT, BUY_CRYPTO];

export const gameEditionRoutes = [
  {
    id: 0,
    label: 'swap',
    route: ROUTE_SWAP,
  },
  {
    id: 1,
    label: 'stats',
    route: ROUTE_STATS,
  },
  {
    id: 2,
    label: 'history',
    route: ROUTE_MY_SWAP,
  },
];
