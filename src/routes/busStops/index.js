import React from 'react';
import {
  Switch,
  Route
} from "react-router-dom";

import BusStopsMap from './busStopsMap';

const BusStops = ({ match }) => (
  <Switch>
    <Route path={`${match.path}`} component={BusStopsMap}></Route>
  </Switch>
);

export default BusStops;
