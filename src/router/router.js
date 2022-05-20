import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Layout from "../components/layout/Layout";
import PoolContainer from "../containers/PoolContainer";
import SwapContainer from "../containers/SwapContainer";
import WrapContainer from "../containers/WrapContainer";
import StatsContainer from "../containers/StatsContainer";
import StaticContainer from "../containers/StaticContainer";
import KpennyContainer from "../containers/KpennyContainer";
import KpennyRedeemContainer from "../containers/KpennyRedeemContainer";
// import RedeemGuide from "../modals/RedeemGuide";
import styled from "styled-components/macro";
import { MAINTENANCE_MODE } from "../constants/contextConstants";
import MaintenanceContainer from "../containers/MaintenanceContainer";

import {
  ROUTE_INDEX,
  ROUTE_POOL,
  ROUTE_WRAP,
  ROUTE_STATS,
  ROUTE_STATIC,
  ROUTE_KPY_RES,
  ROUTE_KPY_RED,
} from "./routes";

const Container = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-flow: column;
`;

export default () => {
  if (window.location.pathname.includes("serviceworker")) {
    return <></>;
  } else {
    return (
      <Router>
        <Layout>
          <Container>
            <Switch>
              <Route
                exact
                path={ROUTE_INDEX}
                component={
                  MAINTENANCE_MODE ? MaintenanceContainer : SwapContainer
                }
              />
              <Route
                exact
                path={ROUTE_POOL}
                component={
                  MAINTENANCE_MODE ? MaintenanceContainer : PoolContainer
                }
              />
              <Route exact path={ROUTE_WRAP} component={WrapContainer} />
              <Route exact path={ROUTE_STATS} component={StatsContainer} />
              <Route exact path={ROUTE_STATIC} component={StaticContainer} />
              <Route exact path={ROUTE_KPY_RES} component={KpennyContainer} />
              <Route
                exact
                path={ROUTE_KPY_RED}
                component={KpennyRedeemContainer}
              />
            </Switch>
          </Container>
        </Layout>
      </Router>
    );
  }
};
