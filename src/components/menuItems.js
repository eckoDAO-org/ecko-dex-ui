import { ROUTE_POOL, ROUTE_STATS, ROUTE_SWAP } from '../router/routes';

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
export const STATS = {
  id: 2,
  label: 'stats',
  route: ROUTE_STATS,
  className: '',
};

export default [SWAP, POOL, STATS];
