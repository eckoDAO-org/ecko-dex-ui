import { ROUTE_POOL, ROUTE_STATS, ROUTE_SWAP, ROUTE_ANALYTICS, ROUTE_DAO } from '../router/routes';

export const SWAP = {
  id: 0,
  label: 'swap',
  route: ROUTE_SWAP,
  className: '',
};
export const POOL = {
  id: 1,
  label: 'pool',
  route: ROUTE_POOL,
  className: '',
};
export const DAO = {
  id: 2,
  label: 'dao',
  route: ROUTE_DAO,
  className: '',
};
export const STATS = {
  id: 3,
  label: 'stats',
  route: ROUTE_STATS,
  className: '',
};
export const ANALYTICS = {
  id: 4,
  label: 'analytics',
  route: ROUTE_ANALYTICS,
  className: '',
};

export default [SWAP, POOL, DAO, STATS, ANALYTICS];
