import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PoolContainer from '../containers/PoolContainer';
import SwapContainer from '../containers/SwapContainer';
import DaoContainer from '../containers/DaoContainer';
import WrapContainer from '../containers/WrapContainer';
import StatsHistoryContainer from '../containers/StatsHistoryContainer';
import AnalyticsContainer from '../containers/AnalyticsContainer';
import GameEditionMenuContainer from '../components/game-edition-v2/GameEditionMenuContainer';
import GameEditionStartAnimation from '../components/game-edition-v2/GameEditionStartAnimation';
import {
  ROUTE_INDEX,
  ROUTE_POOL,
  ROUTE_WRAP,
  ROUTE_STATS,
  ROUTE_GAME_START_ANIMATION,
  ROUTE_GAME_EDITION_MENU,
  ROUTE_ANALYTICS,
  ROUTE_DAO,
} from './routes';

export default () => {
  if (window.location.pathname.includes('serviceworker')) {
    return <></>;
  } else {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route exact path={ROUTE_INDEX} component={SwapContainer} />
            <Route exact path={ROUTE_GAME_START_ANIMATION} component={GameEditionStartAnimation} />
            <Route exact path={ROUTE_GAME_EDITION_MENU} component={GameEditionMenuContainer} />
            <Route exact path={ROUTE_POOL} component={PoolContainer} />
            <Route exact path={ROUTE_DAO} component={DaoContainer} />
            <Route exact path={ROUTE_STATS} component={StatsHistoryContainer} />
            <Route exact path={ROUTE_ANALYTICS} component={AnalyticsContainer} />
            <Route exact path={ROUTE_WRAP} component={WrapContainer} />
          </Switch>
        </Layout>
      </Router>
    );
  }
};
