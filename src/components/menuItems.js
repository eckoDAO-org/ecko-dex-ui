import { ROUTE_POOL, ROUTE_STATS, ROUTE_SWAP, ROUTE_ANALYTICS, ROUTE_MY_SWAP } from '../router/routes';

export const SWAP = {
  id: 0,
  label: 'swap',
  route: ROUTE_SWAP,
  activeRoutes: [ROUTE_MY_SWAP],
};
export const POOL = {
  id: 1,
  label: 'pool',
  route: ROUTE_POOL,
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

export default [SWAP, POOL, STATS, ANALYTICS];

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
