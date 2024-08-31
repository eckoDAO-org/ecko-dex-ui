import TransactionsTable from './TransactionsTable';

import { getAnalyticsDexscanPoolTransactions } from '../../api/kaddex-analytics';

const TransactionsTablePool = ({pool}) => {
  const [tokenA, tokenB] = pool.split(":").sort((a,b) => (a==="KDA" || a>b)?1:-1)

  return <TransactionsTable tokenA={tokenA} tokenB={tokenB} load_fct={(...args) => getAnalyticsDexscanPoolTransactions(pool, ...args)} />
}

export default TransactionsTablePool;
