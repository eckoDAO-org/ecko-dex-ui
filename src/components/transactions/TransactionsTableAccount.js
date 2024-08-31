import TransactionsTable from './TransactionsTable';

import { getAnalyticsDexscanAccountTransactions } from '../../api/kaddex-analytics';

const TransactionsTableAccount = ({account}) => {
  return <TransactionsTable tokenA="Token" tokenB="KDA" load_fct={(...args) => getAnalyticsDexscanAccountTransactions(account, ...args)} />
}

export default TransactionsTableAccount;
