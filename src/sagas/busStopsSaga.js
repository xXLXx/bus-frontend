import {
  BUS_STOPS_FETCH,
  BUS_STOP_FETCH
} from 'actions/types';
import {
  getBusStopsSuccess,
  getBusStopsFailure,
  getBusStopSuccess,
  getBusStopFailure,
  setSelectedBusStop
} from 'actions';
import { toQuery } from 'utils';

import { request } from '../api/app';

const saga = async (action, state, dispatch) => {

  switch (action.type) {
    case BUS_STOPS_FETCH:
      await fetchBusStops(dispatch, action, state);
      break;

    case BUS_STOP_FETCH:
      await fetchBusStop(dispatch, action, state);
      break;
  }
}

const fetchBusStops = async (dispatch, action, state) => {
  const busStops = state.busStops;

  if (busStops.isLastPage) {
    dispatch(getBusStopsSuccess({}));
  } else {
    try {
      // No pagination response
      const isLastPage = true;
      // Since this is an API-managed, we will only, re-query when empty
      const response = await request('get', `bus-stops?${toQuery(busStops.filters)}`);

      dispatch(getBusStopsSuccess({
        data: response,
        isLastPage
      }));
    } catch (error) {
      dispatch(getBusStopsFailure(error.message));
    }
  }
}

const fetchBusStop = async (dispatch, action, state) => {
  const { busStops, selectedBusStopIndex } = state.busStops;
  const { payload: { byId, reset } } = action;
  const index = selectedBusStopIndex || (byId && busStops.busStops.findIndex((busStop) => busStop.id === byId));

  /**
   * Set the currently selected whenever one isn't found,
   * and add an index for it to be filled in on retry.
   * Can be used for viewing single page details with only id provided
   */
  if (!busStops[index]) {
    if (byId) {
      dispatch(getBusStopsSuccess([{
        id: byId
      }]));
    }
    dispatch(setSelectedBusStop(busStops.length - 1));

    return await fetchBusStop(dispatch, action, state);
  }

  if (busStops[index].details === undefined || reset) {
    try {
      // Since this is an API-managed, we will only, re-query when empty
      const response = await request('get', `bus-stops/${encodeURIComponent(busStops[index].id)}`);

      dispatch(getBusStopSuccess({
        data: response,
        index
      }));
    } catch (error) {
      dispatch(getBusStopFailure(error.message));
    }
  } else {
    dispatch(getBusStopSuccess({}));
  }
}

export default saga;
