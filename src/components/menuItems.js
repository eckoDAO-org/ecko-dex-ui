import { NETWORK_TYPE } from '../constants/contextConstants';
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
  ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_SINGLE_SIDED,
  ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_DOUBLE_SIDED,
  ROUTE_STAKE,
  ROUTE_UNSTAKE,
  ROUTE_DAO,
  ROUTE_LIQUIDITY_REWARDS,
  ROUTE_LIQUIDITY_CREATE_PAIR,
  ROUTE_ANALYTICS_KDX,
  ROUTE_ANALYTICS_STATS,
} from '../router/routes';

export const SWAP = {
  id: 0,
  label: 'Swap',
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
    ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_SINGLE_SIDED,
    ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_DOUBLE_SIDED,
    ROUTE_LIQUIDITY_REWARDS,
    ROUTE_LIQUIDITY_CREATE_PAIR,
  ],
};
export const DAO = {
  id: 2,
  label: 'DAO',
  route: ROUTE_DAO,
  activeRoutes: [ROUTE_DAO],
  className: '',
};
export const ANALYTICS = {
  id: 4,
  label: 'Analytics',
  route: ROUTE_ANALYTICS,
  activeRoutes: [ROUTE_ANALYTICS_KDX, ROUTE_ANALYTICS_STATS],
};
export const STAKE = {
  id: 3,
  label: 'Stake',
  route: ROUTE_STAKE,
  activeRoutes: [ROUTE_UNSTAKE],
};
export const VAULT = {
  id: 3,
  label: 'Vault',
  target: '_blank',
  link: process.env.REACT_APP_VAULTING_URL,
};

export default NETWORK_TYPE === 'development' ? [SWAP, LIQUIDITY, STAKE, DAO, ANALYTICS] : [SWAP, LIQUIDITY, STAKE, DAO, ANALYTICS];

export const gameEditionRoutes = [
  {
    id: 0,
    label: 'Swap',
    route: ROUTE_SWAP,
  },
  {
    id: 1,
    label: 'Stats',
    route: ROUTE_STATS,
  },
  {
    id: 2,
    label: 'History',
    route: ROUTE_MY_SWAP,
  },
];
