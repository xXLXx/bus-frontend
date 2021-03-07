import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { StoreProvider } from 'store';
import MainLayout from 'components/layouts/main';
import BusStops from 'routes/busStops';

const App = () => (
  <StoreProvider>
    <MainLayout>
        <Router>
          <Switch>
            <Route path="/" component={BusStops}></Route>
          </Switch>
        </Router>
    </MainLayout>
  </StoreProvider>
);

export default App;
