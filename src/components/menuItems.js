import {
  ROUTE_STATS,
  ROUTE_SWAP,
  ROUTE_ANALYTICS,
  ROUTE_MY_SWAP,
  ROUTE_LIQUIDITY_TOKENS,
  ROUTE_LIQUIDITY_POOLS,
  ROUTE_LIQUIDITY_MY_LIQUIDITY,
  ROUTE_LIQUIDITY_ADD_LIQUIDITY,
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
  activeRoutes: [ROUTE_LIQUIDITY_POOLS, ROUTE_LIQUIDITY_MY_LIQUIDITY, ROUTE_LIQUIDITY_ADD_LIQUIDITY],
};
export const STATS = {
  id: 2,
  label: 'stats',
  route: ROUTE_STATS,
};
export const ANALYTICS = {
  id: 3,
  label: 'analytics',
  route: ROUTE_ANALYTICS,
};

export default [SWAP, LIQUIDITY, STATS, ANALYTICS];

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
