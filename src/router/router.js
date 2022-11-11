import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useGameEditionContext } from '../contexts';
import {
  ROUTE_INDEX,
  ROUTE_STATS,
  ROUTE_GAME_START_ANIMATION,
  ROUTE_GAME_EDITION_MENU,
  ROUTE_ANALYTICS,
  ROUTE_MY_SWAP,
  ROUTE_LIQUIDITY_TOKENS,
  ROUTE_LIQUIDITY_MY_LIQUIDITY,
  ROUTE_LIQUIDITY_POOLS,
  ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED,
  ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED,
  ROUTE_LIQUIDITY_REMOVE_LIQUIDITY,
  ROUTE_STAKE,
  ROUTE_UNSTAKE,
  ROUTE_DAO,
  ROUTE_DAO_PROPOSAL,
  ROUTE_LIQUIDITY_REWARDS,
  ROUTE_LIQUIDITY_CREATE_PAIR,
  ROUTE_ANALYTICS_KDX,
  ROUTE_ANALYTICS_STATS,
  ROUTE_TOKEN_INFO,
} from './routes';

import Layout from '../components/layout/Layout';

// GAME EDITION CONTAINERS
const GameEditionMenuContainer = React.lazy(() =>
  import('../components/game-edition-v2/GameEditionMenuContainer' /* webpackChunkName: "gameeditionContainer" */)
);
const GameEditionStartAnimation = React.lazy(() =>
  import('../components/game-edition-v2/GameEditionStartAnimation' /* webpackChunkName: "gameeditionAnimation" */)
);
const StatsHistoryGameEditionContainer = React.lazy(() =>
  import('../containers/StatsHistoryGameEditionContainer' /* webpackChunkName: "gameeditionStatsHistory" */)
);

//APP CONTAINERS
const AddLiquidityContainer = React.lazy(() => import('../components/liquidity/AddLiquidityContainer' /* webpackChunkName: "add-liquidity" */));
const CreatePairContainer = React.lazy(() => import('../components/liquidity/CreatePairContainer' /* webpackChunkName: "create-pair" */));
const SwapContainer = React.lazy(() => import('../containers/SwapContainer' /* webpackChunkName: "swap" */));
const SwapHistoryContainer = React.lazy(() => import('../containers/SwapHistoryContainer' /* webpackChunkName: "swap-history" */));
const DaoContainer = React.lazy(() => import('../containers/DaoContainer' /* webpackChunkName: "dao" */));
const AnalyticsContainer = React.lazy(() => import('../containers/AnalyticsContainer' /* webpackChunkName: "analytics" */));
const LiquidityContainer = React.lazy(() => import('../containers/LiquidityContainer' /* webpackChunkName: "liquidity" */));
const RemoveLiquidityContainer = React.lazy(() => import('../containers/RemoveLiquidityContainer' /* webpackChunkName: "remove-liquidity" */));
const StakeContainer = React.lazy(() => import('../containers/StakeContainer' /* webpackChunkName: "stake" */));
const TokenInfoContainer = React.lazy(() => import('../containers/TokenInfoContainer' /* webpackChunkName: "token-info" */));

export default () => {
  const { gameEditionView } = useGameEditionContext();
  return (
    <Router>
      <Layout>
        {gameEditionView ? (
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route exact path={ROUTE_GAME_START_ANIMATION} component={GameEditionStartAnimation} />
              <Route exact path={ROUTE_GAME_EDITION_MENU} component={GameEditionMenuContainer} />
              <Route exact path={ROUTE_INDEX} component={SwapContainer} />
              <Route exact path={ROUTE_MY_SWAP} component={SwapHistoryContainer} />
              <Route exact path={ROUTE_STATS} component={StatsHistoryGameEditionContainer} />
            </Switch>
          </Suspense>
        ) : (
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route exact path={ROUTE_INDEX} component={SwapContainer} />
              <Route exact path={ROUTE_MY_SWAP} component={SwapHistoryContainer} />
              <Route
                exact
                path={[ROUTE_LIQUIDITY_TOKENS, ROUTE_LIQUIDITY_POOLS, ROUTE_LIQUIDITY_MY_LIQUIDITY, ROUTE_LIQUIDITY_REWARDS]}
                component={LiquidityContainer}
              />
              <Route
                exact
                path={[ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED, ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED]}
                component={AddLiquidityContainer}
              />
              <Route exact path={[ROUTE_LIQUIDITY_CREATE_PAIR]} component={CreatePairContainer} />
              <Route exact path={ROUTE_LIQUIDITY_REMOVE_LIQUIDITY} component={RemoveLiquidityContainer} />
              <Route exact path={[ROUTE_DAO, ROUTE_DAO_PROPOSAL]} component={DaoContainer} />
              <Route exact path={[ROUTE_ANALYTICS, ROUTE_ANALYTICS_KDX, ROUTE_ANALYTICS_STATS]} component={AnalyticsContainer} />
              <Route exact path={[ROUTE_STAKE, ROUTE_UNSTAKE]} component={StakeContainer} />
              <Route exact path={ROUTE_TOKEN_INFO} component={TokenInfoContainer} />
              {/*
             Remember to delete
            <Route exact path={ROUTE_BUY_CRYPTO} component={BuyCryptoContainer} /> */}
            </Switch>
          </Suspense>
        )}
      </Layout>
    </Router>
  );
};
